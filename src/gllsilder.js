/*
 * gllSilder 1.0.0
 * https://github.com/tonypay/gllsilder
 *
 * for open source use
 */
$.fn.gllSilder = function(containerSelector, option){
	const win = $(window);
	//set current function object
	const FS = $.fn.gllSilder;
	//set control object
	const container = $(this);

	const ACTIVE = 'active';
	const ACTIVE_SEL = '.'+ACTIVE;

	//slide inlay layer
	const SLIDE = 'slide';
	const SLIDE_SEL = '.'+SLIDE;

	//slide every page
	const PAGE = 'page';
	const PAGE_SEL = '.'+PAGE;
	const PAGE_ACTIVE = ACTIVE;
	const PAGE_SEL_ACTIVE = ACTIVE_SEL;

	//slide arrow
	const ARROW = 'arrow';
	const ARROW_SEL = '.'+ARROW;
	const ARROW_LESS = 'arrowPrev';
	const ARROW_LESS_SEL = '.'+ARROW_LESS;
	const ARROW_NEXT = 'arrowNext';
	const ARROW_NEXT_SEL = '.'+ARROW_NEXT;

	//slide nav
	const NAV = 'slidenav';
	const NAV_SEL = '.'+NAV;
	const NAV_WAIT = 'waitClick';
	const NAV_WAIT_SEL = '.'+NAV_WAIT;
	const NAV_ITEM = 'navItem';
	const NAV_ITEM_SEL = '.'+NAV_ITEM;
	const NAV_ACTIVE = ACTIVE;
	const NAV_ACTIVE_SEL = ACTIVE_SEL;

	var options = {
		//create slide delay
		scrollDelay: 6000,
		//create slide speed
		scrollSpeed: 600,
		//set slide seamless scrolling
		disordered: true,
		//create slide autoScroll control
		autoScroll: true,
		//create slide arrow control
		slideArrow: true,
		//create slide navigation control
		navigation: true,
		navigationInteractive: false,
		//create slide color control
		setBackgroundColorInteractive: false,
		setBackgroundColor: "#ccc",

		keyboardScrolling: true
	};

	if(container){
		var defaults = {
			slideCurrent: 0,
			minRandomNumber: 0,
			maxRandomNumber: 1,
			directionDefault: 'add'
		}

		var delayTimerControl = 0;
		var properWidth = 0;
		var slideTimeout = null;

		init();
	}

	function init(){
		setParameter();

		slideAutoScroll();

		bindEvents();
	}

	function setParameter(){
		options = $.extend(options, option);

		//var slideInlay = container.find(SLIDE_SEL);
		var section = container.find(PAGE_SEL);
		var elementMoveNavigation;

		if(!section.length){
			section = container.children();
			section.addClass(PAGE);
		}
		section.each(function(index){
			$(this).addClass(PAGE+"-"+index);
		})

		changeBackgroundColor(section.length);

		newDomWrapInner(container, SLIDE);
		
		if(section.length){
			styleSlide(section, section.length);
		}
	}

	function styleSlide(section, numSlides){
		properWidth = window.innerWidth;

		container.css({
			'width': properWidth,
			'background-color': options.setBackgroundColor
		});

		container.find(SLIDE_SEL).css({
			'height': '100%',
			'width': properWidth * numSlides,
			'left': 0
		});

		section.css({
			'width': properWidth
		});

		section.filter(":first-child").addClass(PAGE_ACTIVE);

		section.each(function(index){
			$(this).css({ })
		})

		if(options.navigation){
			createSlideArrow(container);
		}

		if(options.slideArrow){
			createSlideNav(container, numSlides);
		}

		container.find(NAV_ITEM_SEL).eq(defaults.slideCurrent).addClass(NAV_ACTIVE);
	}

	function createSlideArrow(slideMode){
		var arrowless = createSlideDom('<div></div>').addClass(ARROW +" "+ ARROW_LESS);
		var arrownext = createSlideDom('<div></div>').addClass(ARROW +" "+ ARROW_NEXT);

		arrowless.appendTo(slideMode);
		arrownext.appendTo(slideMode);
	}

	function createSlideNav(slideMode, numSlides){
		var slideNav = createSlideDom('<div></div>').addClass(NAV);
		for (var i = 0; i < numSlides; i++) {
			createSlideDom('<div></div>').addClass(NAV_ITEM).appendTo(slideNav);
		}
		slideNav.appendTo(slideMode);
	}

	function changeBackgroundColor(numSlides){
		if(!options.setBackgroundColorInteractive){
			options.setBackgroundColor = setRandomRGB();
		}
	}

	function seamlessHandle(){
		if(options.disordered){

			if(1){

			}
			cloneBeginPage = section.first();
			cloneEndPage = section.last();
			cloneBeginPage.clone().appendTo(SLIDE_SEL);
			cloneEndPage.clone().prependTo(SLIDE_SEL);

		}
	}
	//bind slide timer

	function onceBindTimeout(){
		var section = container.find(PAGE_SEL);
		var direct = defaults.directionDefault;

		defaults.slideCurrent = section.filter(PAGE_SEL_ACTIVE).index();

		slideTimeout = setTimeout(function(){
			onceMove(section, direct);
		}, options.scrollDelay);
	}

	function slideAutoScroll(direct){
		if(options.autoScroll){
			onceBindTimeout();
		}
	}

	function onceMove(element, direct){
		clearTimeout(slideTimeout);
		if(typeof(direct) == "string"){
			if(direct == "add"){
				nextMove(element);
			}
			if(direct == "less"){
				prevMove(element);
			}
		}else{
			designMove(element, direct);
		}
		moveTo(replaceTimeout);
	}

	function moveTo(callback){
		var elementMoveFloor = $(SLIDE_SEL);
		elementMoveFloor.stop().animate({
			'left': - defaults.slideCurrent * properWidth
		}, options.scrollSpeed);
		
		callback();
	}

	function replaceTimeout(){
		var section = container.find(PAGE_SEL);
		var nav = container.find(NAV_ITEM_SEL);
		section.filter(PAGE_SEL_ACTIVE).removeClass(PAGE_ACTIVE);
		section.eq(defaults.slideCurrent).addClass(PAGE_ACTIVE);

		nav.filter(NAV_ACTIVE_SEL).removeClass(NAV_ACTIVE);
		nav.eq(defaults.slideCurrent).addClass(NAV_ACTIVE);
		onceBindTimeout();
	};

	function prevMove(element){
		defaults.slideCurrent -= 1;
		defaults.slideCurrent = defaults.slideCurrent < 0 ? element.length - 1 : defaults.slideCurrent;
		return;
	}

	function nextMove(element){
		defaults.slideCurrent += 1;
		defaults.slideCurrent = defaults.slideCurrent > element.length - 1 ? 0 : defaults.slideCurrent;
		return;
	}

	function designMove(element, direct){
		defaults.slideCurrent = direct;
		defaults.slideCurrent = defaults.slideCurrent < 0 ? element.length - 1 : defaults.slideCurrent;
		return;
	}

	function bindEvents(){

		$(window).on('resize', resizeEvents);

		$(document).on('mouseover', mouseEnterEvents);
		$(document).on('mouseout', mouseOutEvents);

		$(document).on('keydown', keydownEvents);
		$(document).on('keyup', keyupEvents);

		$(document).on("click", delegatedEvents);
	}

	function resizeEvents(e){
		
		e.preventDefault();
	}

	function mouseEnterEvents(e){
		var target = e.target;
		if(inCloudDelegated(target, '#'+container.attr('id'))){
			$(ARROW_SEL).css('display','block');
		}
	}

	function mouseOutEvents(e){
		var target = e.target;
		if(inCloudDelegated(target, '#'+container.attr('id'))){
			$(ARROW_SEL).css('display','none');
		}
	}

	function keydownEvents(e){
		if(options.keyboardScrolling){
			var direct;
			switch(e.keyCode){
				case 37:
				direct = "less";
				break;
				case 39:
				direct = "add";
				break;
				default:
				return;
			}
			onceMove(container.find(PAGE_SEL), direct);
		}
	}
	
	function keyupEvents(e){ 
		e.preventDefault();
	}

	function delegatedEvents(e){
		var target = e.target;

		if(inCloudDelegated(target, ARROW_SEL)){
			slideArrowHandler.call(target, e);
		}
		if(inCloudDelegated(target, NAV_ITEM_SEL)){
			slideNavItemHandler.call(target, e);
		}
		e.preventDefault();
	}

	function slideArrowHandler(e){
		var self = this, direct;

		if(hasClass(self, ARROW_LESS)) {
			direct = "less";
		}
		if(hasClass(self, ARROW_NEXT)) {
			direct = "add";
		}

		onceMove(container.find(PAGE_SEL), direct);
	}

	function slideNavItemHandler(e){
		var self = this;
		var list = container.find(NAV_ITEM_SEL);
		onceMove(container.find(PAGE_SEL), gIndex(list, self));
	}

	//功能函数
	function inCloudDelegated(el, curr){
		if(el && el.nodeType == 1){
			if(el.matches(curr)){
				return el;
			}
			return inCloudDelegated(el.parentNode, curr);
		}
		return 0;
	}

	function hasClass(el, className){
		if(el == null) {
			return false
		}
		if(el.classList){
			el.classList.contains(className);
		}
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}

	function gIndex(arr, dist){
		var length = arr.length;
		for (var i = 0; i < length; i++) {
			if(arr[i] == dist){
				return i;
			}
		}
	}

	function createSlideDom(domS){
		var divE = $(domS);
		return divE;
	}
	function newDomWrapInner(element, classNames){
		var docElement = createSlideDom('<div></div>').addClass(classNames);
		element.wrapInner(docElement);
	}

	function setRandomRGB(){
		var r = Math.round(setRandom(255));
		var g = Math.round(setRandom(255));
		var b = Math.round(setRandom(255));
		var a = Math.floor(setRandom(90, 10)) / 100;
		return 'rgba('+r+','+g+','+b+','+a+')';
	}

	function setRandom(min, max){
		if(arguments.length){
			if(arguments.length == 1){
				max = min || defaults.maxRandomNumber;
				min = defaults.minRandomNumber;
			}
		}else {
			min = defaults.minRandomNumber;
			max = defaults.minRandomNumber;
		}
		var random = Math.random() * (max - min) + min;
		return random;
	}

	var clrTime, beforeTime;
	function getTimes(){
		var date = (new Date()).getTime();
		clrTime = date - beforeTime;
		if(clrTime > options.runSpeed){
			beforeTime = date;
			return true;
		}
		return false;
	}
}
