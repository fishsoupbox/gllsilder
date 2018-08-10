//english literal translation is good ^^
$.fn.gllSilder = function(option){
	//set current function object
	const FS = $.fn.gllSilder;
	//set control object
	const container = $(this);
	const containParent = container.parent();
	//start postion for customer to set
	//start page of the clone is not included
	//end page of the clone is not included
	//all pages of the clone is not included
	//all pages
	//every page width
	//page father width
	var sIndex, startPage, endPage, page, allPage, pgWidth, ctWidth, Interval, maxPage, minPage, clrTime, beforeTime=0;
	const fs = $.extend({
		runSpeed: 600,
		beginPage: 0,
		scrollSpeed: 6000,
		color: ['#333', '#666', '#999', '#ccc']
	}, option);

	var constant = {
		section: 'page',
		arrowWarp: 'arrow',
		arrowLeft: 'arrowL',
		arrowRight: 'arrowR'
	}

	//tools methods
	FS.setStartPosition=function(a){
		sIndex = !!a ? a : 0;
		if(!a) return
		clearScroll();
	}

	if(container.length){
		page = container.find('section');

		startPage = page.eq(0), endPage = page.eq(page.length-1);
		startPage.clone().appendTo(container), endPage.clone().prependTo(container);

		allPage = container.find('section');
		init();
	}

	function init(){
		FSinit();
		createScrollArrow();
		setParameter();
		bindevent();
		scrollAnimate();
	}

	function FSinit(){
		FS.setStartPosition();
	}

	function setParameter(){
		page.each(function(index, os){
			$(this).addClass(constant.section+index);
		})
		pgWidth = window.innerWidth, ctWidth = pgWidth*allPage.length;
		console.log(pgWidth);
		container.css({'width': ctWidth, 'left': -pgWidth*sIndex});
		allPage.css({'width': pgWidth, 'background': fs.color[parseInt(Math.random()*fs.color.length)]});
		arrow.css({'width': pgWidth, 'margin-top': container.innerHeight()/2});
		maxPage = allPage.length-1, minPage = 0;
	}

	function bindevent(){
		$(document).on('resize', resizeload);
		arrowL.on('click', removeLeft);
		arrowR.on('click', removeRight);
	}

	function resizeload(){
		setParameter();
		scrollAnimate();
	}

	function removeLeft(){
		(getTimes())&&(sIndex -= 1, clearScroll()) 
	}

	function removeRight(){
		(getTimes())&&(sIndex += 1, clearScroll())
	}

	var arrow, arrowL, arrowR;
	function createScrollArrow(){
		arrow = createDealObj(constant.arrowWarp);
		arrowL = createDealObj(constant.arrowLeft).appendTo(arrow);
		arrowR = createDealObj(constant.arrowRight).appendTo(arrow);
		containParent.append(arrow);
	}

	function createDealObj(className){
		return $('<div>').addClass(className);
	}

	function clearScroll(){
		clearInterval(Interval);
		scrollFunc();
		setTimeout(function(){scrollAnimate();}, fs.runSpeed);
	}
	function scrollAnimate(){
		Interval = setInterval(function(){
			sIndex+=1;
			scrollFunc();
		}, fs.scrollSpeed + fs.runSpeed);
	}
	function scrollFunc(){
		if(sIndex>maxPage-1){
			sIndex = minPage;
			container.css('left', -pgWidth*sIndex);
			sIndex += 1;
		}else if(sIndex<minPage+1) {
			sIndex = maxPage;
			container.css('left', -pgWidth*sIndex);
			sIndex -= 1;
		}
		container.animate({'left': (-pgWidth*sIndex)}, fs.runSpeed);
	}

	function getTimes(){
		var date = (new Date()).getTime();
		clrTime = date - beforeTime;
		if(clrTime > fs.runSpeed){
			beforeTime = date;
			return true;
		}
		return false;
	}
}
