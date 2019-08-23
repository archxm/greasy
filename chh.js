// ==UserScript==
// @name         CHH 备注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更好体验
// @author       Archxm
// @include      https://www.chiphell.com/thread*
// @include      http://www.chiphell.com/thread*
// @include      https://www.chiphell.com/forum.php*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    function ButtonClickAction(zEvent){
        let a = $(zEvent.target)
        let b = a.prev()

		let name = b[0].innerHTML
		let remark = GM_getValue(name)
		$("#remarkName").html(name);
		$("#remarkVal").val (remark);

        $("#gmPopupContainer").show ();
        zEvent.stopPropagation()
    }

	function addBtn(v) {
		var zNode = document.createElement ('button');
		zNode.innerHTML = '备注';
		zNode.setAttribute ('id', 'myButton');
        zNode.setAttribute ('type', 'button');
        zNode.addEventListener (
            "click", ButtonClickAction, false
        );
		v.append (zNode);
	}

	$("body").append ( '                                                     \
		<div id="gmPopupContainer">                                          \
			<p id="remarkName" value="  "></p>                               \
			<textarea type="text" id="remarkVal" value="">                   \
		</div>                                                               \
	' );

    $("body").click(function(){
		let name = $("#remarkName").html ()
		let remark = $("#remarkVal").val ()
		GM_setValue(name, remark)
		$("#gmPopupContainer").hide();
	})

    $('#gmPopupContainer').click(function(){ return false; });

    let all = $(".authi")
    for (let i = 0; i < all.length; i=i+2){
        addBtn(all[i]);
    }

	//--- CSS styles make it work...
	GM_addStyle ( "                                                 \
		#gmPopupContainer {                                         \
            display:none;                                           \
			position:               fixed;                          \
			width:                  25%;                            \
			height:                 20%;                            \
			left:                   0;  							\
			bottom:                 10%;							\
			background:             powderblue;                     \
			border:                 3px double black;               \
			border-radius:          1ex;                            \
			z-index:                777;                            \
		}                                                           \
		#gmPopupContainer textarea{                                 \
			width:                  95%;                            \
            height:                 80%;                            \
		}                                                           \
	" );
})();