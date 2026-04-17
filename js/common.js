$(function(){
	//20190109 수정 - load 이벤트 삭제
	//슬라이딩 체크 박스 : change 시 텍스트 변경

	$(".switch input").each(function(){
		if($(this).is(":checked") == true) {
			$(this).prop("checked",true).closest(".rate-discount").addClass("on");
		} else {
			$(this).prop("checked",false).closest(".rate-discount").removeClass("on");
		}
	});

	$(".switch input").on("change",function(){
		if($(this).is(":checked")) {
			$(this).prop("checked",true).closest(".rate-discount").addClass("on");
		}else {
			$(this).prop("checked",false).closest(".rate-discount").removeClass("on");
		}
	})

	//input remove : 버튼 클릭시 내용이 있을 경우 내용 삭제
	$(".input-box").each(function(){
		var $input = $(this).find("input"),
		$btn = $(this).find(".btn-close");

		$input.on("input oninput", function(){
			if( !$input.val() == "") {
				$btn.show();
			} else {
				$btn.hide();
			}
		});

		$btn.on("click",function(){
			$input.val('');
			$btn.hide();
		});
	})
	//layer-open 2020-02-28 수정
	var $layer = $(".layer-pop"),
		$this,
		$focused_el = null;


	function layeropen ($click_btn) {//2020-02-28 수정 function 안에, 매개변수
		var target = '#' + $click_btn.data("target"),//2020-02-28 수정
		topLeft = $(target).width()/2,
		topPos = $(target).height()/2;

		$focused_el = $click_btn;

		if($(target).hasClass("wide") ) {//full size layer
			$(target).addClass("open").show()//2020-02-28 수정
		} else {//alert layerpop
			$(target).addClass("open").show().css({"marginTop":-topPos,"marginLeft":-topLeft})	//2020-02-28 수정
		}
		
		// 클릭한 레이어 제외하고 나머지 포커스 불가 2022-06-17 수정
		$("#wrap *").each(function(){
			$(this).attr({"aria-hidden":"true","tabindex":-1}).addClass("ariahidden_on");
		})

		// 오픈 후 레이어로 초점 이동 - 2022-06-17 수정 : 순서 변경
		$(target).attr("tabindex",0).focus()
		console.log($(target))
		// 초점 이동 제어 - 2022-06-17 포커스 이벤트 삭제 
		$(target).before("<div class='bg'></div>");//2020-02-28 수정
		$(".bg").show()	// 배경 제어 2020-02-28 수정

		//5) shift+tab - 2022-06-17 포커스 이벤트 삭제	
	}

	$(".open-layer").on("click",function(){
		layeropen($(this))
		popupOpen();//2022-04-29
		return false;
	});

	function layerclose ($thisLayer) {//2022-06-02 수정 / 2022-06-24
		setTimeout(function(){
			$thisLayer.closest(".layer-pop").removeClass("open").hide(); //2022-06-24
			$(".bg").remove();// 2022-06-17 수정
			$(".ariahidden_on").removeAttr("aria-hidden tabindex").removeClass("ariahidden_on");//2020-02-28 수정 / 2022-06-17 수정 removeAttr 추가
			$focused_el.attr("tabindex",0).focus();//$this 는 오픈 레이어 버튼 2020-02-28 수정 2022-06-17 수정
			return false;
		},100);				
	}


	$(".layer-close").on("click",function(){//2020-02-28 수정
		layerclose ($(this));//2022-06-24
		popupClose()//2022-04-29
	});
	// 2020-02-28 수정 마무리


	//4) tab

	// 20190109 수정 : 일부 스크립트 삭제 (동적 생성된 bg 삭제,layer focus tab 제어,layer shift tab 제어 삭제)

	//select 를 버튼으로 변환
	$("select.ui-select").each(function(){
		//select 변환
		var btnfind = $(this).attr("class").split(" ");

		$("."+btnfind[1]).hide();
		$('[data-target="'+btnfind[1]+'"]').show();
	});
	// 레이어팝업 활성화시, 높이값 기억 - 20190109 수정
	var originHei = $(window).height();

	//select open 스크립트와 충돌 20190326 삭제
	/*$(window).on("resize",function(){

	});*/

	//select 클릭시 팝업 열림 - button 태그로 변환시키기 : 모바일 기기에서 네이티브 메뉴 화면 제거위해서  2020-02-28 수정
	var $focused_sel = null;

	function selectopen ($click_select) {
		var target = $click_select.data("target"),
		$selectclass = $("."+target),
		$layer = $("#layer-slider");
		$focused_sel = $click_select;//2020-02-28 수정

		$selectclass.addClass('on-select');
		$layer.before("<div class='bg'></div>");
		$(".bg").show();
		$layer.show().animate({"bottom":0},300).attr("tabindex",0)//2020-02-28 수정 2022-06-17 수정

		// 클릭한 레이어 제외하고 나머지 포커스 제외 - 2022-06-17 수정
		$("#wrap *").each(function(){
			$(this).attr({"aria-hidden":"true","tabindex":-1}).addClass("ariahidden_on");
		})

		// 특정 select 를 체크하여, 레이어 팝업내 데이터로 반영
		$selectclass.find("option").each(function(index){
			var num = index + 1;
			$("#layer-slider ul").append("<li><span class='left-box'><label for='radio"+num+"'>"+$(this).text()+"</label></span><input type='radio' id='radio"+num+"' name='radiobox' class='right-middle'/></li>")//2020-02-28 수정 2022-06-17 수정 tabindex 삭제 
		});

		if($click_select.hasClass("btn-circle")) {//권종변경 버튼 2020-02-28 수정
			var showcnt = $(".product-show > li.on").index();
			$layer.find("ul li").eq(showcnt).find("input:radio").prop('checked', true).attr('checked', true);
			$selectclass.addClass("sortchange");
		} else {
			var showcnt = $selectclass.find("option:selected").index();
			$layer.find("ul li").eq(showcnt).find("input:radio").prop('checked', true).attr('checked', true);
		}
		//20190502 추가 : 레이어 스크롤 생성 - 문제 : 가상 키보드 올라와있는 경우 레이어 클릭시. 가로모드 전환시 스크롤 오류
		var layerH = $layer.height(); // 레이어 높이 : 초기에 한번 구함. 모바일 기기에서 화면 크기에 따라서 레이어의 높이가 달라짐 => 정확한 스크롤 정보를 얻을 수 없음

		if(layerH > originHei * 0.8 ) {//20190109 수정
			$layer.addClass("scrolltype");
		}

		// 20190502 추가 : 세로 -> 가로, 가로-> 세로 모드로 회전시 제어
		/*$(window).on("orientationchange",function(){
			 var orientation = window.orientation;

			if(90 == orientation || -90 == orientation) { //세로 -> 가로
				measureHeight(layerH); // 인자 값이 없으면 layer 의 높이가 null 값이 됨.
			} else {
				measureHeight(layerH); //
			}

		})*/
		//$layer.find(".half-position-box li:first-child .left-box").focus(); 2022-06-17 삭제
	}
	$(".select-open").on("click",function(){//2020-02-28 수정
		selectopen ($(this));
		popupOpen();
		return false;
	});

	//닫기 클릭시 팝업 닫히면서 select 태그에 반영 2020-02-28 수정
	function sliderclose () {
		var $layer = $("#layer-slider"),
			$layerlist = $layer.find(".half-position-box"),
			$opensel = $('.on-select');

		$layerlist.find("input[type=radio]").each(function() {
			if($(this).is(":checked")) {
				var selectcnt = $(this).prev().find("label").text(),
					num = $(this).parent().index();

				$opensel.find('option:eq('+num+')').prop('selected', true).attr('selected', true).siblings().removeAttr('selected',false);

				if( !$opensel.hasClass("sortchange") ) {//버튼 텍스트 변경
					$opensel.next('button').text(selectcnt);
				} else {//권종 변경 change
					$(".product-show > li").removeClass("on");
					$('.product-show > li:eq('+num+')').addClass("on");
				}
				$opensel.change().removeClass('on-select');

				//레이어팝업 내 체크 박스 스크롤 이동
				var num = $(this).filter(":checked").parent("li").index(),
					allnum = num * $(".half-position-box li").outerHeight(),
					allHei = $(".half-position-box li").outerHeight() * $(".half-position-box li").length,
					allHei2 = ( allnum / allHei);

				$(".half-position-box").scrollTop(allHei * allHei2);

			}
		});

		$layer.animate({"bottom":"-100%"},500).hide();
		$(".bg").remove();
		$layerlist.empty(); //확인 클릭시 태그 비워주기
		$layer.removeClass("scrolltype"); // 20190502 레이어 스크롤 삭제, 높이 초기화
		$(".ariahidden_on").removeAttr("aria-hidden tabindex").removeClass("ariahidden_on"); //2022-06-17 수정 removeAttr 추가/removeClass 매개변수 . 삭제
		$focused_sel.attr("tabindex",0).focus();//$this 는 오픈 레이어 버튼 //2022-06-17 수정
	}
	$(".popup-close").on("click",function(){//2020-02-28 수정
		sliderclose();
		popupClose();
		return false;
	});
	// 2020-02-28 수정 마무리

	//layer-slider tab 제어 - 20190109 수정 /2022-06-17 삭제 
	// $("#layer-slider .last").keydown(function(e){
	// 	var $thislayer = $(this).closest("#layer-slider");
	// 	if(e.keyCode == 9) {
	// 		$thislayer.attr("tabindex", 0).focus();
	// 	}
	// });

	//layer-slider shift tab 제어 - 20190109 수정 /2022-06-17 삭제 
	// $("#layer-slider").keydown(function(e){
	// 	if(e.shiftKey && e.keyCode == 9){ // Shift + Tab 키를 의미합니다.
	// 		$(this).find(".last").attr("tabindex", 0).focus();
	// 	}
	// });

	$("#buy-count").empty();
	// 구매수량 매수
	for (var i = 1; i <= 10; i++) {
		$("#buy-count").append("<option value='"+i+"'>"+i+"매</option>");
	}

	/* input에 focus시 하단 fixed 영역 해제 : 190121 추가
    var selector = '.txt-box textarea, .input-box input[type=tel], .input-box input[type=text], .input-box input[type=date], .input-box input[type=number]';
	//textarea, input(tel,text,checkbox,radio 사용)
    $(selector).on('focus', function(){
		$('.bottom-btnbox').addClass('focusin')
	})
	$(selector).on('focusout', function(){
	  $('.bottom-btnbox').removeClass('focusin')
	});
	*/

	//2020-03-18 추가
	btnTitleAdd ();

});

// function 모음
//check box 문구 변경 : 개시일 설정 switch 설정 추가 checkSet() 부분 : 20190411 수정
function checkSet(tx){
	var btntx = tx;
	var $check = $('#wrap').find('.switch .chk1'),
		$check2 = $('#wrap').find('.switch .chk2'),
		$onArea = $(".switchon"),
		$onArea2 = $(".switchon2"),
		$offArea = $(".switchoff"),
		$offArea2 = $(".switchoff2"),
		$empty = $(".switchoff input[type='checkbox'], .switchon input[type='checkbox']"),
		$txBtn = $('#wrap').find(".bottom-btnbox .btn-red");

	$('#wrap .switch input').click(function(){
		if($(this).attr("class") == "chk1") {
			set();
			$empty.prop("checked",false)
		} else {
			set2();
			$empty.prop("checked",false)
		}


	});

	function set(){
		if($check.is(":checked")){
			$check.attr("aria-checked",true)//2020-04-14 추가
			$onArea.show();
			$offArea.hide();
			$(".set-date").show();
			$txBtn.html("휴대폰 인증<br>"+btntx+"하기");
		} else {
			$check.attr("aria-checked",false)//2020-04-14 추가
			$onArea.hide();
			$offArea.show();
			$(".set-date").hide();
			$txBtn.text(''+btntx+'하기');
		}
	}
	set();

	function set2(){
		if($check2.is(":checked")){
			$check2.attr("aria-checked",true)//2020-04-14 추가
			$onArea2.show();
			$offArea2.hide();
		} else {
			$check2.attr("aria-checked",false)//2020-04-14 추가
			$onArea2.hide();
			$offArea2.show();
		}
	}

}

var scrollHeight = 0;//전역변수 초기화
//팝업띄울시 스크롤 고정
function popupOpen() {
	scrollHeight = $(window).scrollTop();
	//$("body").addClass('fixed');
	$('#wrap').css({'position': 'fixed','width':'100%','top':- scrollHeight});
}

//팝업닫을때 스크롤 해제
function popupClose() {
	//$("body").removeClass("fixed");
	$('#wrap').css({'top':0,'position':'relative','width': "auto"});
	$(window).scrollTop(scrollHeight);

}

/* 20190326 추가 : 핸드폰 번호 숫자만 입력 */
function validate() {
    if (event.keyCode >=48 && event.keyCode <= 57 ) {
        return true;
    } else {
        event.returnValue = false;
    }
}

//2020-03-18 추가
function btnTitleAdd () {//웹 접근성 select 에 data-info 속성이 있는 경우 button에 title 추가
	$(".wrap-area select").each(function(){
		console.log($(this).data("info"))
			var selectInfo = $(this).data("info");
		if(! selectInfo== "" ) {
			$(this).next("button").attr("title",selectInfo).prop("title",selectInfo)
		}
	})
}

//2022-06-24 좋아요 기능 
function eventLikeCount (e) {
	var applyArea = $(".user-event-box"),
			applyBtn = applyArea.find(".btn-event-apply"),
			countTarget = applyArea.find(".countTarget"),
			countNum = Number(countTarget.text());

	applyBtn.on("click",function(){
		$(this).toggleClass("on")				
		if($(this).hasClass("on")) countTarget.text(countNum + 1)
		else  countTarget.text(countNum)
	});
}