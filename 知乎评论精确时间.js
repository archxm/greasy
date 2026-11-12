// ==UserScript==
// @name         知乎评论显示精确时间
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  在知乎评论区显示精确的年月日时分秒
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const timeMap = new Map();

    // 格式化时间戳为 YYYY-MM-DD HH:mm:ss
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 递归提取接口返回的评论 ID 与 created_time
    function extractComments(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (obj.id && obj.created_time && typeof obj.created_time === 'number') {
            timeMap.set(String(obj.id), formatTime(obj.created_time));
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                extractComments(obj[key]);
            }
        }
    }

    // 劫持 fetch 请求获取评论原始时间戳
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await origFetch.apply(this, args);
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
        if (url.includes('/api/v4/comment') || url.includes('/comments')) {
            response.clone().json().then(data => extractComments(data)).catch(() => {});
        }
        return response;
    };

    // 定时扫描页面评论节点并替换/追加精确时间
    setInterval(() => {
        document.querySelectorAll('[data-id]').forEach(el => {
            const id = el.getAttribute('data-id');
            if (timeMap.has(id) && !el.dataset.exactTimeAdded) {
                const exactTime = timeMap.get(id);
                const spans = el.querySelectorAll('span');
                for (const span of spans) {
                    const text = span.textContent.trim();
                    if (/^(\d+\s*(秒|分钟|小时|天|个月|年)前|昨天|前天|\d{2}-\d{2}|\d{4}-\d{2}-\d{2})$/.test(text)) {
                        span.textContent = `${exactTime} (${text})`;
                        el.dataset.exactTimeAdded = 'true';
                        break;
                    }
                }
            }
        });
    }, 1000);
})();
