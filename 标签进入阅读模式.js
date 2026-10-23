// ==UserScript==
// @name         局部阅读模式（纯黑夜间免刷新版）
// @namespace    http://tampermonkey.net
// @version      1.4
// @description  免刷新丝滑切换。强制纯黑背景(#000)与纯白文字(#FFF)，极度适合夜间阅读。
// @author       archxm with google ai
// @match        *://*/*
// @run-at       context-menu
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function activateReaderMode() {
        if (document.getElementById('super-reader-overlay')) return;

        document.body.style.cursor = 'crosshair';

        document.addEventListener('click', function handler(e) {
            e.preventDefault();
            e.stopPropagation();

            var target = e.target;
            while (target && target.tagName !== 'DIV' && target.tagName !== 'ARTICLE' && target.tagName !== 'SECTION') {
                target = target.parentNode;
            }

            if (target) {
                var content = target.cloneNode(true);

                var overlay = document.createElement('div');
                overlay.id = 'super-reader-overlay';

                overlay.innerHTML =
                    '<style>' +
                    // 整个大背景设为纯黑 #000
                    '#super-reader-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000 !important; z-index: 2147483647; overflow-y: auto; padding: 40px 20px; box-sizing: border-box; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }' +
                    // 阅读容器也设为纯黑 #000，限制黄金阅读宽度 750px
                    '#super-reader-container { max-width: 750px; margin: 0 auto; background: #000 !important; padding: 40px; line-height: 1.8 !important; font-size: 18px !important; color: #fff !important; }' +
                    // 核心强力清洗：容器内所有子元素强制纯白字、透明底、暗色边框
                    '#super-reader-container * { color: #fff !important; background-color: transparent !important; background-image: none !important; border-color: #333 !important; }' +
                    // 图片适度调暗，防止夜间太刺眼，鼠标悬停时恢复正常亮度
                    '#super-reader-container img { max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 4px; opacity: 0.8; transition: opacity 0.2s; }' +
                    '#super-reader-container img:hover { opacity: 1; }' +
                    // 暗色代码块适配，防止代码和背景混在一起
                    '#super-reader-container pre, #super-reader-container code { white-space: pre-wrap; word-break: break-all; background: #1a1a1a !important; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #ff7875 !important; }' +
                    '#super-reader-container pre, #super-reader-container pre * { background: #1a1a1a !important; color: #e8e8e8 !important; }' +
                    '#super-reader-container pre { padding: 15px; display: block; overflow-x: auto; border: 1px solid #333 !important; }' +
                    // 右上角退出按钮样式优化
                    '#super-exit-btn { position: fixed; top: 20px; right: 40px; padding: 10px 20px; background: #434343; color: #fff !important; border: 1px solid #595959; border-radius: 4px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); z-index: 2147483647; transition: all 0.3s; }' +
                    '#super-exit-btn:hover { background: #ff4d4f; border-color: #ff4d4f; }' +
                    '</style>' +
                    '<button id="super-exit-btn">退出阅读</button>' +
                    '<div id="super-reader-container"></div>';

                overlay.querySelector('#super-reader-container').appendChild(content);
                document.body.appendChild(overlay);

                overlay.querySelector('#super-exit-btn').addEventListener('click', function() {
                    overlay.remove();
                });
            }

            document.body.style.cursor = 'default';
            document.removeEventListener('click', handler);
        }, { once: true, capture: true });
    }

    activateReaderMode();

    window.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'r') {
            activateReaderMode();
        }
    });
})();
