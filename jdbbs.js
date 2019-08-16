// ==UserScript==
// @name         家电论坛
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  个人习惯
// @author       Archxm
// @include      https://www.jdbbs.com/*
// @include      http://www.jdbbs.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var tabs = document.getElementById("moderate").getElementsByTagName("table")
    if(tabs){
        let len = tabs[0].tBodies.length
		let tmToday = new Date()
		tmToday.setHours(0)
		tmToday.setMinutes(0)
		tmToday.setSeconds(0)
		let yesterday = new Date(tmToday)
		yesterday.setDate(yesterday.getDate()-1)
		let anteayer = new Date(tmToday)
		anteayer.setDate(anteayer.getDate()-2)
		for (let i=0;i<len;i++) {
			let len2 = tabs[i].tBodies.length
			for (let j = 0; j < len2; j++) {
				let x = tabs[i].tBodies[j].rows[0].cells[2]
				if (x == null) {
					continue
				}
				let timeEm = x.getElementsByTagName("em")[0]
				if (timeEm){
					let span = timeEm.getElementsByTagName("span")
					if (!span || span.length == 0){
						continue
					}
					let timeText = span[0].innerHTML
					let dt = new Date(timeText + ":00")
					if (dt >= yesterday && dt < tmToday) {
						span[0].style.color="#FF6464"
					}else if (dt>=anteayer && dt < yesterday) {
						span[0].style.color="#F3A21B"
					}
				}
			}
		}
    }
})();
