// ==UserScript==
// @name         知乎首页内容列表自动编号（带视野停留变蓝）
// @namespace    http://tampermonkey.net
// @version      0.3
// @description  为知乎首页“关注”与“推荐”列表的 item 加上数字编号，且进入视野超过2秒后变蓝
// @author       Your Name
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 计数器，记录当前编号到多少了
    let itemCount = 0;

    // 建立交叉观察器实例，用来判断元素是否在屏幕内
    let viewObserver = null;

    // 为单个 item 添加编号的方法
    function addNumberBadge(item) {
        if (item.classList.contains('has-number-badge')) return;

        itemCount++;
        item.classList.add('has-number-badge');

        if (window.getComputedStyle(item).position === 'static') {
            item.style.position = 'relative';
        }

        const badge = document.createElement('div');
        badge.innerText = itemCount;
        
        // 初始样式：红色
        badge.style.position = 'absolute';
        badge.style.top = '0px';
        badge.style.left = '0px';
        badge.style.backgroundColor = '#ff4d4f'; // 初始红
        badge.style.color = '#fff';
        badge.style.padding = '2px 8px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.borderRadius = '4px';
        badge.style.zIndex = '10';
        badge.style.pointerEvents = 'none';
        badge.style.transition = 'background-color 0.5s ease'; // 加上平滑渐变效果

        item.appendChild(badge);

        // 将新标签元素和它的定时器绑定，并交给视野观察器
        if (viewObserver) {
            viewObserver.observe(item);
        }
    }

    // 核心处理函数：同时寻找关注列表和推荐列表
    function processItems() {
        const containers = document.querySelectorAll('.Topstory-follow, .Topstory-recommend');
        if (containers.length === 0) return;

        containers.forEach(container => {
            const items = container.querySelectorAll(':scope > div');
            items.forEach(item => {
                addNumberBadge(item);
            });
        });
    }

    // 初始化视野观察器
    function initViewObserver() {
        viewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const item = entry.target;
                const badge = item.querySelector('.has-number-badge > div:last-child'); // 找到内部的数字标签
                
                if (!badge) return;

                if (entry.isIntersecting) {
                    // 情况1：进入屏幕，如果还没变蓝，就启动 2 秒定时器
                    if (!item.dataset.isBlue) {
                        item.dataset.timerId = setTimeout(() => {
                            badge.style.backgroundColor = '#06f'; // 变成知乎蓝
                            item.dataset.isBlue = 'true'; // 标记已变蓝
                            viewObserver.unobserve(item); // 既然变蓝了，就取消对它的视口监听，省电省性能
                        }, 4000);
                    }
                } else {
                    // 情况2：划出屏幕，如果 2 秒还没到，直接清除定时器，保持红色
                    if (item.dataset.timerId) {
                        clearTimeout(parseInt(item.dataset.timerId));
                        item.removeAttribute('data-timer-id');
                    }
                }
            });
        }, {
            threshold: 0.1 // 只要 item 有 10% 的面积进入屏幕就算可见
        });
    }

    // 监控页面变化的观察器（应对滚动加载）
    function initObserver() {
        // 先初始化视野观察器
        initViewObserver();
        
        // 再对首屏已有的内容进行处理
        processItems();

        const observer = new MutationObserver(() => {
            processItems();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 切换标签重置
        const resetAll = () => {
            itemCount = 0;
            if(viewObserver) viewObserver.disconnect(); // 清空旧观察
            initViewObserver(); // 重新建立
        };

        window.addEventListener('popstate', resetAll);
        document.addEventListener('click', (e) => {
            if (e.target.closest('#TopstoryTabs')) {
                resetAll();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }
})();
