//Tipsy, facebook style tooltips for jquery
//version 1.0.0a
//(c) 2008-2010 jason frame [jason@onehackoranother.com]
//released under the MIT license

/* Start Tipsy */
(function($) {

	function maybeCall(thing, ctx) {
		return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
	};

	function Tipsy(element, options) {
		this.$element = $(element);
		this.options = options;
		this.enabled = true;
		this.fixTitle();
	};

 Tipsy.prototype = {
	 show: function() {
		 var title = this.getTitle();
		 if (title && this.enabled) {
			 var $tip = this.tip();

			 $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
			 $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
			 $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

			 var pos = $.extend({}, this.$element.offset(), {
				 width: this.$element[0].offsetWidth,
				 height: this.$element[0].offsetHeight
			 });

			 var actualWidth = $tip[0].offsetWidth,
				 actualHeight = $tip[0].offsetHeight,
				 gravity = maybeCall(this.options.gravity, this.$element[0]);

			 var tp;
			 switch (gravity.charAt(0)) {
				 case 'n':
					 tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
					 break;
				 case 's':
					 tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
					 break;
				 case 'e':
					 tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
					 break;
				 case 'w':
					 tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
					 break;
			 }

			 if (gravity.length == 2) {
				 if (gravity.charAt(1) == 'w') {
					 tp.left = pos.left + pos.width / 2 - 15;
				 } else {
					 tp.left = pos.left + pos.width / 2 - actualWidth + 15;
				 }
			 }

			 $tip.css(tp).addClass('tipsy-' + gravity);
			 $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
			 if (this.options.className) {
				 $tip.addClass(maybeCall(this.options.className, this.$element[0]));
			 }

			 if (this.options.fade) {
				 $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
			 } else {
				 $tip.css({visibility: 'visible', opacity: this.options.opacity});
			 }
		 }
	 },

	 hide: function() {
	 	// TIP: hide all tooltips at once   $('.tipsy').hide();
		 if (this.options.fade) {
			 this.tip().stop().fadeOut(function() { $(this).remove(); });
		 } else {
			 this.tip().remove();
		 }
	 },

	 fixTitle: function() {
		 var $e = this.$element;
		 if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
			 $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
		 }
	 },

	 getTitle: function() {
		 var title, $e = this.$element, o = this.options;
		 this.fixTitle();
		 //var title, o = this.options;
		 if (typeof o.title == 'string') {
			 title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
		 } else if (typeof o.title == 'function') {
			 title = o.title.call($e[0]);
		 }
		 title = ('' + title).replace(/(^\s*|\s*$)/, "");
		 return title || o.fallback;
	 },

	 tip: function() {
		 if (!this.$tip) {
			 this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
		 }
		 return this.$tip;
	 },

	 validate: function() {
		 if (!this.$element[0].parentNode) {
			 this.hide();
			 this.$element = null;
			 this.options = null;
		 }
	 },

	 enable: function() { this.enabled = true; },
	 disable: function() { this.enabled = false; },
	 toggleEnabled: function() { this.enabled = !this.enabled; }
 };

 $.fn.tipsy = function(options) {

	 if (options === true) {
		 return this.data('tipsy');
	 } else if (typeof options == 'string') {
		 var tipsy = this.data('tipsy');
		 if (tipsy) tipsy[options]();
		 return this;
	 }

	 options = $.extend({}, $.fn.tipsy.defaults, options);

	 function get(ele) {
		 var tipsy = $.data(ele, 'tipsy');
		 if (!tipsy) {
			 tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
			 $.data(ele, 'tipsy', tipsy);
		 }
		 return tipsy;
	 }

	 function enter() {
		 var tipsy = get(this);
		 tipsy.hoverState = 'in';
		 if (options.delayIn == 0) {
			 tipsy.show();
		 } else {
			 tipsy.fixTitle();
			 setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
		 }
	 };

	 function leave() {
		 var tipsy = get(this);
		 tipsy.hoverState = 'out';
		 if (options.delayOut == 0) {
			 tipsy.hide();
		 } else {
			 setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
		 }
	 };

	 if (!options.live) this.each(function() { get(this); });

	 /*
	 if (options.trigger != 'manual') {
		 var binder   = options.live ? 'live' : 'bind',
			 eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
			 eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
		 this[binder](eventIn, enter)[binder](eventOut, leave);
	 }
	 */
	 if (options.trigger != 'manual') {
		 var eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
			 eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
		 if (options.live)
			 $(document).on(eventIn, this.selector, enter).on(eventOut, this.selector, leave);
		 else
			 this.bind(eventIn, enter).bind(eventOut, leave);
	 }

	 return this;

 };

 $.fn.tipsy.defaults = {
	 className: null,
	 delayIn: 0,
	 delayOut: 0,
	 fade: 0,
	 fallback: '',
	 gravity: 'n',
	 html: false,
	 live: true,
	 offset: 0,
	 opacity: 1,
	 title: 'title',
	 trigger: 'hover'
 };

 // Overwrite this method to provide options on a per-element basis.
 // For example, you could store the gravity in a 'tipsy-gravity' attribute:
 // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
 // (remember - do not modify 'options' in place!)
 $.fn.tipsy.elementOptions = function(ele, options) {
	 return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
 };

 $.fn.tipsy.autoNS = function() {
	 return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
 };

 $.fn.tipsy.autoWE = function() {
	 return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
 };

 /**
  * yields a closure of the supplied parameters, producing a function that takes
  * no arguments and is suitable for use as an autogravity function like so:
  *
  * @param margin (int) - distance from the viewable region edge that an
  *		element should be before setting its tooltip's gravity to be away
  *		from that edge.
  * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
  *		if there are no viewable region edges effecting the tooltip's
  *		gravity. It will try to vary from this minimally, for example,
  *		if 'sw' is preferred and an element is near the right viewable
  *		region edge, but not the top edge, it will set the gravity for
  *		that element's tooltip to be 'se', preserving the southern
  *		component.
  */
  $.fn.tipsy.autoBounds = function(margin, prefer) {
		return function() {
			var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
				boundTop = $(document).scrollTop() + margin,
				boundLeft = $(document).scrollLeft() + margin,
				$this = $(this);

			if ($this.offset().top < boundTop) dir.ns = 'n';
			if ($this.offset().left < boundLeft) dir.ew = 'w';
			if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
			if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

			return dir.ns + (dir.ew ? dir.ew : '');
		}
	};

})(jQuery);
/* End Tipsy */

//******************  START Jquery Countdown *********//
/**
 * jQuery's Countdown Plugin
 *
 * display a countdown effect at given seconds, check out the following website for further information:
 * http://heartstringz.net/blog/posts/show/jquery-countdown-plugin
 *
 * @author Felix Ding
 * @version 0.2
 * @copyright Copyright(c) 2008. Felix Ding
 * @license http://www.opensource.org/licenses/bsd-license.php The BSD License
 * @date 2008-03-09
 * @lastmodified 2008-04-22 16:48
 */
var countdown_timer_variable;// New cm: Re ajax requests, ensure only one countdown loop is happening, else each requests will start an 'extra' countdown and multiple finish test submissions will happen on timeout

jQuery.fn.countdown = function(options, total_time_limit, timestamp_to_finish) {
	/**
	 * app init
	 */
	if(!options) options = '()';
	if(jQuery(this).length == 0) return false;
	var obj = this;
	var current_timestamp = Math.round(new Date().getTime() / 1000);//CMMOD

	/* break out and execute callback (if any) */
	if(options.seconds < 0 || options.seconds == 'undefined')
	{
		if(options.callback) eval(options.callback);
		return null;
	}

	/* New cm: Execute callback if should have finished by now */
	if 	(current_timestamp > timestamp_to_finish){
		if(options.callback) eval(options.callback);
		return null;
	}

	/* New cm: Check if displayed time is lagging due system resourses etc and update */
	actual_seconds_left = timestamp_to_finish - current_timestamp;
	if ( actual_seconds_left < options.seconds ){
		options.seconds = actual_seconds_left;
	}


	/*
	 * NEW CM: Avoid duplicate timeouts running, so we clear timeout before starting a new one BECAUSE submit answers AJAX requests starting new jquery.fn.countdown setTimeouts
	 * "ctof" MEANS "clear time out function"
	 */
	clearTimeout(countdown_timer_variable);


	/* Start new Recursive countdown */
	countdown_timer_variable = window.setTimeout(
		function() {

			time_percentage_left = Math.floor((100/total_time_limit)*options.seconds);
			time_percentage_left = 100 - time_percentage_left;

			hrs = Math.floor(options.seconds/3600);
			mins_prep = options.seconds - (hrs*3600);
			mins = Math.floor(mins_prep/60);
			secs = mins_prep - (mins*60);


			if (mins < 10){
				mins = '0'+mins;
			}
			if (secs < 10){
				secs = '0'+secs;
			}
			display_time = hrs+':'+mins+':'+secs;

			jQuery(obj).html(String(display_time));
			$('div.show_timer').fadeIn();
			$('div.timeleft').attr('style','width:'+time_percentage_left+'%;');
			--options.seconds;
			jQuery(obj).countdown(options, total_time_limit, timestamp_to_finish);
		}
		, 1000
	);

	/**
	 * return null
	 */
	return this;
}

/*
 * Using obscure names to try stop scriptkiddies working out how to stop test timer - server will reset it on each page requests however, so it don't matter that much
 * "dftiit" MEANS: "don't finish test if I'm true" - Stop potential double submission if two countdown timers are triggered
 * "cdftiit()" MEANS: "check don't finish test if I'm true
 */
var dftiit = false;
function cdftiit() {
	if (dftiit) {
		return true ;
	}
	dftiit = true;
}
/**
 * stop the anonymous setTimeout event
 *
 * @date 2008-04-22
 */
//jQuery.fn.countdown.stop = function() {
//	window.clearTimeout(setTimeout("0")-1);
//};
//************* END Jquery Countdown **************//





/*** JQMODAL *****/
/*
 * jqModal - Minimalist Modaling with jQuery
 *   (http://dev.iceburg.net/jquery/jqModal/)
 *
 * Copyright (c) 2007,2008 Brice Burgess <bhb@iceburg.net>
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Version: 03/01/2009 +r14
 */
$("document").ready(function(){
	$.fn.jqm=function(o){
	var p={
	overlay: 70,
	overlayClass: 'jqmOverlay',
	closeClass: 'jqmClose',
	trigger: '.jqModal',
	ajax: F,
	ajaxText: '',
	target: F,
	modal: F,
	toTop: F,
	onShow: F,
	onHide: F,
	onLoad: F
	};
	return this.each(function(){if(this._jqm)return H[this._jqm].c=$.extend({},H[this._jqm].c,o);s++;this._jqm=s;
	H[s]={c:$.extend(p,$.jqm.params,o),a:F,w:$(this).addClass('jqmID'+s),s:s};
	if(p.trigger)$(this).jqmAddTrigger(p.trigger);
	});};

	$.fn.jqmAddClose=function(e){return hs(this,e,'jqmHide');};
	$.fn.jqmAddTrigger=function(e){return hs(this,e,'jqmShow');};
	$.fn.jqmShow=function(t){return this.each(function(){t=t||window.event;$.jqm.open(this._jqm,t);});};
	$.fn.jqmHide=function(t){return this.each(function(){t=t||window.event;$.jqm.close(this._jqm,t);$('#fileSelectorDiv').html('');$('.clearHtml').html('');});};

	$.jqm = {
	hash:{},
	open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(parseInt(h.w.css('z-index'))),z=(z>0)?z:3000,o=$('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/170});if(h.a)return F;h.t=t;h.a=true;h.w.css('z-index',z);
	 if(c.modal) {if(!A[0])L('bind');A.push(s);}
	 else if(c.overlay > 0)h.w.jqmAddClose(o);
	 else o=F;

	 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):F;

	 if(ie6){$('html,body').css({height:'100%',width:'100%'});if(o){o=o.css({position:'absolute'})[0];for(var y in {Top:1,Left:1})o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");}}

	 if(c.ajax) {var r=c.target||h.w,u=c.ajax,r=(typeof r == 'string')?$(r,h.w):$(r),u=(u.substr(0,1) == '@')?$(t).attr(u.substring(1)):u;
	  r.html(c.ajaxText).load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose($(cc,h.w));e(h);});}
	 else if(cc)h.w.jqmAddClose($(cc,h.w));

	 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);
	 (c.onShow)?c.onShow(h):h.w.show();e(h);return F;
	},
	close:function(s){var h=H[s];if(!h.a)return F;h.a=F;
	 if(A[0]){A.pop();if(!A[0])L('unbind');}
	 if(h.c.toTop&&h.o)$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
	 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return F;
	},
	params:{}};
	//,ie6=( navigator.userAgent.match(/msie/i) && navigator.userAgent.match(/6/) )
	var s=0,H=$.jqm.hash,A=[],ie6=msieversion(6),F=false,
	i=$('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0}),
	e=function(h){if(ie6)if(h.o)h.o.html('<p style="width:100%;height:100%"/>').prepend(i);else if(!$('iframe.jqm',h.w)[0])h.w.prepend(i); f(h);},
	f=function(h){try{$(':input:visible',h.w)[0].focus();}catch(_){}},
	L=function(t){$()[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
	m=function(e){var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);if(r)f(h);return !r;},
	hs=function(w,t,c){return w.each(function(){var s=this._jqm;$(t).each(function() {
	 if(!this[c]){this[c]=[];$(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return F;});}this[c].push(s);});});};
	});
	function msieversion(asking_version){
		//Detect is version http://support.microsoft.com/kb/167820
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf ( "MSIE " );
		if ( msie > 0 ){	  // If Internet Explorer, get version number
			var version = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
			if (version == asking_version){
				return 1;
			} else {
				return 0;
			}
		} else { // If not IE :) return 0
			return 0;
		}
	}
/******* END JQMODAL *******/




/*!
 * jquery.customSelect() - v0.4.1
 * http://adam.co/lab/jquery/customselect/
 * 2013-05-13
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 */
(function(a){a.fn.extend({customSelect:function(c){if(typeof document.body.style.maxHeight==="undefined"){return this}var e={customClass:"customSelect",mapClass:true,mapStyle:true},c=a.extend(e,c),d=c.customClass,f=function(h,k){var g=h.find(":selected"),j=k.children(":first"),i=g.html()||"&nbsp;";j.html(i);if(g.attr("disabled")){k.addClass(b("DisabledOption"))}else{k.removeClass(b("DisabledOption"))}setTimeout(function(){k.removeClass(b("Open"));a(document).off("mouseup."+b("Open"))},60)},b=function(g){return d+g};return this.each(function(){var g=a(this),i=a("<span />").addClass(b("Inner")),h=a("<span />");g.after(h.append(i));h.addClass(d);if(c.mapClass){h.addClass(g.attr("class"))}if(c.mapStyle){h.attr("style",g.attr("style"))}g.addClass("hasCustomSelect").on("update",function(){f(g,h);
var k=parseInt(g.outerWidth(),10)-(parseInt(h.outerWidth(),10)-parseInt(h.width(),10));h.css({display:"inline-block"});var j=h.outerHeight();if(g.attr("disabled")){h.addClass(b("Disabled"))}else{h.removeClass(b("Disabled"))}i.css({width:k,display:"inline-block"});g.css({"-webkit-appearance":"menulist-button",width:h.outerWidth(),position:"absolute",opacity:0,height:j,fontSize:h.css("font-size")})}).on("change",function(){h.addClass(b("Changed"));f(g,h)}).on("keyup",function(j){if(!h.hasClass(b("Open"))){g.blur();g.focus()}else{if(j.which==13||j.which==27){f(g,h)}}}).on("mousedown",function(j){h.removeClass(b("Changed"))}).on("mouseup",function(j){if(!h.hasClass(b("Open"))){if(a("."+b("Open")).not(h).length>0&&typeof InstallTrigger!=="undefined"){g.focus()}else{h.addClass(b("Open"));
j.stopPropagation();a(document).one("mouseup."+b("Open"),function(k){if(k.target!=g.get(0)&&a.inArray(k.target,g.find("*").get())<0){g.blur()}else{f(g,h)}})}}}).focus(function(){h.removeClass(b("Changed")).addClass(b("Focus"))}).blur(function(){h.removeClass(b("Focus")+" "+b("Open"))}).hover(function(){h.addClass(b("Hover"))},function(){h.removeClass(b("Hover"))}).trigger("update")})}})})(jQuery);


$("document").ready(function(){

	if (typeof(use_test_page_ajax) == "undefined"){
		use_test_page_ajax = false;
	}

	/* Generic tog on-off */
	$(document).on('click','[id^="tog_"]', function(e){
		e.preventDefault();
		$('#do' + this.id).slideToggle();
		if ($(this).hasClass('hideme')){
			$(this).hide();
		}

		/* Change text if we set different options like so: <a href="#" id="tog_XXXX" class="showcont" data-open-title="Show" data-close-title="Hide">Show</a> */
		if (typeof($(this).data('open-title')) != 'undefined'){
			if ( $(this).text() == $(this).data('open-title') ){
				$(this).text( $(this).data('close-title') );
			} else {
				$(this).text( $(this).data('open-title') );
			}
		}
	});
	$(document).on('click','[id^="toggroup_"]', function(e) {
		/* groups can have up to 99 groups per page using index eg toggroup_01_unique1, toggroup_01_unique2 - where 01 is group identifier */
		e.preventDefault();
		var group_identifier = this.id.substr(0,11);
		if ( $('#do' + this.id).is(':visible') ){

			$('#do' + this.id).slideUp();
			if ( $(this).hasClass('menu-options-active') ) {
		        $(this).removeClass('menu-options-active');
	        }
			return false;

		}
		$('[id^="do'+group_identifier+'"]').each(function (){/* Close all */
			$(this).hide();
		});
		if ( $('#do' + this.id).is(':visible') ){
			$('#do' + this.id).slideUp();
		} else {
	   		$('#do' + this.id).slideDown();
		}
		if ($(this).hasClass('toggle-active')){
			$(this).parent('.menu-options').children('a.toggle-active').each(function(){
	           $(this).removeClass('menu-options-active');
	        });

        	$(this).addClass('menu-options-active');
        }
	});
	$(document).on('click','[id^="togtab_"]', function(e) {
		/* tabs can have up to 99 tab stes per page using index eg togtab_01_unique1, togtab_01_unique2 - where 01 is group identifier */
		e.preventDefault();
		var group_identifier = this.id.substr(0,11);
		if ( $('#do' + this.id).is(':visible') ){
			return false;
		}
		$('[id^="do'+group_identifier+'"]').each(function (){/* Close all */
			$(this).hide();
		});
		$('[id^="'+group_identifier+'"]').each(function (){/* tab off */
			$(this).parent('li').addClass('taboff').removeClass('tabon');
		});
		$('#do' + this.id).show();
		$('#' + this.id).parent('li').addClass('tabon').removeClass('taboff');
	});
	/* check the extra time input is number or not */
	$(document).on('click','#re_open_test', function() {
		var extra_time_value = $('#extra_time').val();
		if (extra_time_value && isNaN(extra_time_value)) {
			alert('Please enter number to extra time');
			return false;
		}
	});
	/* otog_ id jumps to Anchor and makes sure div is opened */
	$('[id^="otog_"]').click(function() {
		$('#do' + this.id.substring(1)).slideDown();
	});
	$('[id^="htog_"]').mouseenter(function () {
		$('#do' + this.id).slideDown();
		return false;
	}).click(function() {
		$('#do' + this.id).slideToggle();
		return false;
	});
	$('[id^="assigntog_"]').mouseenter(function () {
		$('[id^="doassigntog_"]').hide();
		$('#do' + this.id).show();
	});
	$('[id^="showtog_rg"]').click(function(e) {
		e.preventDefault();
		$('[id^="do'+this.id.substring(4)+'"]').slideDown();
	});
	$('[id^="hidetog_rg"]').click(function(e) {
		e.preventDefault();
		$('[id^="do'+this.id.substring(4)+'"]').slideUp();
	});
	$('[id^="showtog_nrg"]').click(function(e) {
		e.preventDefault();
		$('[id^="do'+this.id.substring(4)+'"]').slideDown();
	});
	$('[id^="hidetog_nrg"]').click(function(e) {
		e.preventDefault();
		$('[id^="do'+this.id.substring(4)+'"]').slideUp();
	});
	$('#togleft').click(function(e) {
		e.preventDefault();
		$('#dotogright').hide();
		$('#dotogleft').slideToggle();
	});
	$('#togright').click(function(e) {
		e.preventDefault();
		$('#dotogleft').hide();
		$('#dotogright').slideToggle();
	});
	$(document).on('click','[id^="togmulti_"]', function(e){
		e.preventDefault();
		$('.do' + this.id).toggle();
	});


	$('.showLoading').click(function() {
		$(this).after(' <img src="'+webpath_img+'icon_loading_circleV3.gif" class="loadingGif"/>');
		if ($(this).hasClass('hidemeAdmin')){
			$(this).hide();
		} else {
			$('.loadingGif').delay(10000).fadeOut('slow');
		}
	});
	$(document).on('click','[class*="no_anchor"]',function(e){
		e.preventDefault();
	});
	$(document).on('click','[class^="anchor_scroll_"]',function(e){
		e.preventDefault();
		/* 1. link is class="anchor_scroll_uniqueName" anchor class must be first if multi classes exist
		 * 2. element to scroll to and open is class="scroll_uniqueName"
		 * 3. Element to open is next() element - not one with scroll_uniqueName class
		 */
		var class_array = $(this).attr('class').split(" ");// Could be more then one class - we need first only
		var this_scroll_class = class_array[0].substring(7);

		if ( $(this).hasClass('open_anchor_element')){
			$('.'+this_scroll_class).show();
		} else {
			$('.'+this_scroll_class).removeClass('closed').addClass('open').next().show();
		}
		$('html,body').animate({scrollTop: $('.'+this_scroll_class).offset().top},'slow');
	});
	/* Trigger to remove a div we are in */
	$(document).on('click',".closeMeLink",function(e){
		e.preventDefault();
		$(this).closest('.closeMeContainer').slideUp();
	});
	$('.close-me').click(function() {
		$(this).closest('[class*="div-close-me"]').slideUp();
		return false;
	});


	//$(".accordion-toggle").next().hide();

	accordionToggleAddClosedClass();

	$(document).on('click', '.accordion-toggle', function() {

		if ($(this).hasClass('closed')) {
			$(this).removeClass('closed').addClass('open').next().slideToggle('fast');
		} else {
			$(this).next().hide();

			$(this).removeClass('open').addClass('closed');
		}

	});

	$(document).on('click', '.accordion-toggle a, .accordion-toggle input', function(e) {
		e.stopPropagation();//stop sub links toggling divs
	});

	// User for accordians in overlays (Assign same settings for example)
	$(document).on('click', '.accordion-toggle-overlay', function() {

		if ($(this).hasClass('closed')) {
			$(this).removeClass('closed').addClass('open').next().show();
		} else {
			$(this).next().hide();

			$(this).removeClass('open').addClass('closed');
		}

	});




	//Quiz stuff
	function hideAllQuizNavigationButtons(){
		/* Hide all nav button so users don't try to click them */
		if( !use_test_page_ajax ) {
			/* Stop browser btn usage warnings - not required for one page ajax app */
			window.onbeforeunload = null;
		}
		/* Instead of below, we don't hide elements, just made opacity 0: This is for one page app functionality */
		//$('body').css('min-height', $('body').height() );//keep scroll bar the same
		//$('.classmarker_content').css('min-height', $('.classmarker_content').height() );//keep page height the same for things like, showing kit loading image on white - not reduced footer


		//LEFT
		var kit_pos_left = ($('#questions_container').width() / 2) -80 + $('#questions_container').offset().left;//80 is loading gif width // must use offset for left

		//TOP fixed option (window height middle screen or classmarker_content)
		if ($(window).height() < $('.classmarker_content').height()){
			/* Window height smaller than content area, set in middle of window */
			var kit_pos_top = $(window).height()/2;
		} else {
			/* Content area height smaller than window itself, set in middle of window */
			var kit_pos_top = $('.classmarker_content').height()/2+$('.classmarker_content').position().top;// must use position for top
		}

		//TOP absolute option (same position as next-prev buttons, don't work for jump back to question buttons at present)
		//next_prev_pos = $('.nextprev').position();
		//kit_pos_top = next_prev_pos.top;

		$('img#icon_loading_kit').css('top', (kit_pos_top) ).css('left', kit_pos_left).fadeIn(2000);
		startTimeoutLoadingError();
		$('#quiz_timer_container, #questions_container, .nextprev, #prev_questions, #display_q_links').animate({opacity:0}, 400, 0);

	}

	function takingTestSinglePageValidation () {

		var stop = false;

		$('div.qsholder').each(function(){
			var questionType = $(this).attr('data-question-type');
			var mustAnswer = $(this).attr('data-must-answer');

			if (stop == true || mustAnswer == '0') {
				return false;
			}

			if (stop == false) {

				//matching dropdown type
				if (questionType == 'md') {
					var dropdownRow = $(this).next('div.manswersDiv').find('tr');
					dropdownRow.each(function(){
						if ($(this).find("td.d_selection").children('select').val() == '0') {
							stop = true;
							return false;
						}
					});
				}

				//matching multimedia type
				if (questionType == 'mm') {
					var clueRow = $(this).siblings('div.manswersDiv').find('input[id^="hidden_clue"]');
					clueRow.each(function(){
						if ($(this).val() == '0') {
							stop = true;
							return false;
						}
					});
				}

				//multiple choice
				if (questionType == 'mcsa') {
					var mcsa_options = $(this).next().next('div.mcanswersDiv').find('[id^="rmc"]');
					var mcsa_stop = true;
					mcsa_options.each(function(){
						if ($(this).is(':checked')) {
							mcsa_stop = false;
							return false;
						}
					});
					stop = mcsa_stop;
				}

				//multiple response
				if (questionType == 'mcma') {
					var mcma_options = $(this).next().next('div.mcanswersDiv').find('[id^="rmmr"]');
					var mcma_stop = true;
					mcma_options.each(function(){
						if ($(this).is(':checked')) {
							mcma_stop = false;
							return false;
						}
					});
					stop = mcma_stop;
				}

				//text
				if (questionType == 'ft' || questionType == 'p' || questionType == 'e') {
					var ft_p_answer = $(this).next().next('div.answersDiv').find('input');
					var e_answer = $(this).next().next('div.answersDiv').find('textarea');

					if (ft_p_answer.val() == '' || e_answer.val() == '') {
						stop = true;
						return false;
					}
				}
			}
		});

		return stop;
	}

	var counter=0;
	can_click_quiz_button = true;// must be global
	var clicked_to_process = false;
	$(document).on('click', 'a#qnext, a#qprev, a#qfinish_confirm, a#qsave_confirm, a#feedback_prev, a#feedback_next, a[id^="qjump_"]', function(){


		/* Stop double clicking when submitting answers etc */
		if ($(this).attr('id') != 'feedback_prev' && $(this).attr('id') != 'feedback_next') {
			if ($(this).hasClass("stopClick")) {
				return false;
			}
			$(this).addClass("stopClick");
		}




		/* check whether the question has been answered or not */
		if ($(this).attr('id') == 'qnext' || $(this).attr('id') == 'qfinish_confirm') {
			var questionsUnfinished = takingTestSinglePageValidation();
			if (questionsUnfinished == true) {
				$(this).removeClass("stopClick");
				alert(message_test_error_unanswered_text);
				//displayWarningMessage();
				clicked_to_process = true;
				return false;
			}
		}

		/****************
		 * If not using one page app:
		 *  1) feedback_prev && feedback_next will use normal <a href="" location
		 *  2) qjump_ will use normal $(document).on('click', 'a[id^="qjump_"]', function (e) {   below
		 *
		 * If using one page app:
		 *  All submittions go via ajax request with ?noheaderfooter variable
		 */
		if( (!use_test_page_ajax) && (($(this).attr('id') == 'feedback_prev') || ($(this).attr('id') == 'feedback_next') || $(this).attr('id').search(/qjump_/i) === 0 ) ) {
			return true;
		}
		// Clear page_type before clicking prev or next
		page_type = '';

		if (can_click_quiz_button == true){
			can_click_quiz_button = false;
			hideAllQuizNavigationButtons();
			if ($(this).attr('id') == 'qnext'){
				$('#control').attr('name', 'next');
			} else if($(this).attr('id') == 'qprev'){
				$('#control').attr('name', 'prev');
			} else if($(this).attr('id') == 'qfinish_confirm'){
				if ( $(this).hasClass('feedback_finish') ){
					$('#control').attr('name', 'feedback_finish');
				} else {
					$('#control').attr('name', 'finish');
				}
			} else if($(this).attr('id') == 'qsave_confirm'){
				$('#control').attr('name', 'save');
			}

			if (use_test_page_ajax // ajax one page app
				&&
				!($(this).attr('id') == 'qfinish_confirm' || $(this).attr('id') == 'qsave_confirm')// not finishing test (where we just do normal submit)
			){
				window.location.hash = "#"+counter++;//add back button history on each click
				if(($(this).attr('id') == 'feedback_prev')){
					destination_url = test_web_root+"?noheaderfooter&gb=1#q";
					send_data = '';
				}else if($(this).attr('id') == 'feedback_next'){
					destination_url = test_web_root+"?noheaderfooter#q";
					send_data = '';
				} else {

					if($(this).attr('id').search(/qjump_/i) === 0) {
						qid = $(this).attr('id').substring(6);
						$('#jump_to_this_id_ref').val(qid);
					}
					if (typeof(uid) == "undefined"){
						uid=0;
					}
					var destination_url = test_web_root+"accept/?noheaderfooter&uid="+uid;
					var send_data = $("#questionform").serialize();

				}

				$.ajax({
					type: "POST",
					url: destination_url,
					data: send_data,
					success: function (html_content) {

						/* If full page is returned (Starts with <!DOCTYPE html>), escape one page app and send to test main page which will redirect to correct location */
						var res = html_content.substr(0, 9);
						if (res.search("<!DOCTYPE") === 0){
							window.onbeforeunload = null;
							window.location.href = test_web_root;
							return;
						}

						clearTimeoutLoadingError();
						$('img#icon_loading_kit').stop(true, true).hide();//Stop potential fadeIn above if page loads fast
						can_click_quiz_button = true;
						$(this).removeClass("stopClick");

						$('html, body').animate({scrollTop: $('#ajax-container').offset().top}, 'slow', function(){
							$("#ajax-container").html(html_content);
							setupDynamicTextAreas();
							convertBBcodetoHtml();
							checkBBcodeImageWidths();
							ajaxRestartTRefresh();
						});
					},
					error: function (jqXHR, textstatus, errorThrown) {
						$('#questions_container').animate({opacity: 0.7}, 10).show();
						$('#showRefreshInstructions').show();
						$('html, body').animate({scrollTop: $('#showRefreshInstructions').offset().top-50}, 'slow');
					}//,
					//timeout: 1000 // sets timeout to 90 seconds - we use startTimeoutLoadingError(); instead
				});
			} else {
				if( $(this).attr('id').search(/qjump_/i) !== 0) {//we submit qjump_ below instead
					window.onbeforeunload = null;
					$('#questionform').submit();
				}
			}
		}
		return false;
	});
	$(document).on('click', 'a#qsave', function() {
		$(this).fadeOut(400, function () {
			$('#'+this.id+'_confirm').fadeIn('slow');
		});
		return false;
	});
	$(document).on('click', 'a#qfinish', function() {
		var questionsUnfinished = takingTestSinglePageValidation();
		if (questionsUnfinished == true) {
			alert(message_test_error_unanswered_text);
			//displayWarningMessage();
			clicked_to_process = true;
			return false;

		} else {
			$(this).fadeOut(400, function () {
				$('#' + this.id + '_confirm').fadeIn('slow');
			});
			return false;
		}
	});
	$(document).on('click', '.fade_content_btn', function(){
		if (can_click_quiz_button == true){
			can_click_quiz_button = false;
			hideAllQuizNavigationButtons();
		}
	});
	//START display preview logged out questions
	// Use event delegation for dynamically created elements, since online test page will load the content by ajax  Allen
	$(document).on('click', 'a#prev_questions', function() {
		$('#prev_questions').fadeOut();
		$.getJSON(test_web_root+'rpc/getPrevQuestions.rpc.php', function(data){

			if (data.response == 'success'){
				var htmlcontent = '<table class="qsholder editor" border="0" cellpadding="0" cellspacing="0">';
				$.each(data.questions, function(ignore, question) {
					htmlcontent += '<tr><td width="40" valign="top"><a href="#" id="qjump_'+question.qid+'" class="';
					if ($.inArray( question.qid, data.answered_questions ) != -1 ){
						htmlcontent += 'jump_to_q';
					} else {
						htmlcontent += 'jump_to_q noanswer';
					}
					htmlcontent += '">'+question.c+'</a></td>';
					htmlcontent += '<td width="10"><img src="'+test_web_root+'../img/i.gif" width="10" height="1" alt=""/></td>';
					htmlcontent += '<td><div class="bbcode">'+bbCode(replaceLineBreak(question.question))+'</div></td></tr>';
					htmlcontent += '<tr><td></td><td></td><td><div class="dotted"></div></td></tr>';
				});
				htmlcontent += '</table>';
			} else {
				var htmlcontent = '<p>';
				htmlcontent += data.msg;
				htmlcontent += '</p>';
				$('#prev_questions').show();

			}
			$('#display_q_links').html(htmlcontent);
			$('#display_q_links').slideDown();
			$('html,body').animate({scrollTop: $('#display_q_links').offset().top-30},'slow');
			$('img.imgw').show();

		});

	});
	if(!use_test_page_ajax) {
		$(document).on('click', 'a[id^="qjump_"]', function (e) {
			e.preventDefault();
			if (can_click_quiz_button == true) {
				can_click_quiz_button = false;
				qid = this.id.substring(6);
				$('#jump_to_this_id_ref').val(qid);
				hideAllQuizNavigationButtons();
				$('#questionform').submit();
			}
		});
	}


	$(document).on('click', '[id^="showbtn"], .removeOnBeforeUnload', function(){
		window.onbeforeunload = null;
	});

	function countEssayWords(str){
		str = $.trim(str);
		if (str == ''){
			return 0;
		} else {
			return str.split(/\s+/).length;
		}
	}
	$(document).on('keyup', 'textarea[id^="e_"]', function(e){
		$('#count'+this.id).html(countEssayWords($('#'+this.id).val()));
	});
	$(document).on('click', 'a[id^="eword_count"]', function(e){
		e.preventDefault();
		essay_textbox_id = this.id.substring(11);
		$('#counte_'+essay_textbox_id).html(countEssayWords( $('textarea#e_'+essay_textbox_id).val() ));
		$('#show_'+this.id).toggleClass("hide").toggleClass("show");
	});
	$(document).on('click', 'a[id^="mcundo"]', function(e){
		e.preventDefault();
		$('[id^="rmc_'+this.id.substring(6)+'_"]').removeAttr('checked');
	});
	$(document).on('click', 'a[id^="mrundo"]', function(e){
		e.preventDefault();
		$('[id^="rmr_'+this.id.substring(6)+'_"]').removeAttr('checked');
	});
	$(document).on('click', 'a[id^="mmrundo"]', function(e){
		e.preventDefault();
		$('[id^="rmmr_'+this.id.substring(7)+'_"]').removeAttr('checked');
	});
	$(document).on('click', 'input[class^="mmr_"]', function(){
		count = $('#c'+this.className).text();
		if ( $('[id^="r'+this.className+'_"]').filter(':checked').length > count ){
			alert('You can only select ' + count + ' or less options.\n\nYou can unselect an option to make changes.');
			$('#'+this.id).removeAttr('checked');
		}
	});

	/* KA */
	$('#ka').each(function(index) {
		startTRefresh(0);
	});

	/* Edit for boxes */
	$('[id^="copyMe_"]').keyup(function(){
		$("#do" + this.id).html($('#' + this.id).val());
	});

	/* Limit chars */
	$(document).on('keyup', '[class*="limitchars"]', function(){
 		limitChars(this.className);
 	});


	$('#student_overall_top').html($('#student_overall').html()).show();







	setupDynamicTextAreas();


	// Help Tooltips
	$('.showTooltip').tipsy({gravity: 'w', fade: true});
	$('.showTooltipEast').tipsy({gravity: 'e', fade: true, html: true});
	$('.showTooltipHTML').tipsy({gravity: 'w', fade: true, html: true});
	$('.showTooltipUnder').tipsy({gravity: 'n', fade: true});


	/* Generic LOADING
	$('.genericSubmitBtn').click( function (){
		$(this).after('<img src="'+webpath_img+'icon_loading_circleV3.gif" class="loadingGif"/>');
		$(this).hide();
	});*/
	/* Generic submit href link */
	//$('.genericSubmitLink').click(function() {
	$(document).on('click', '.genericSubmitLink', function(e){
		e.preventDefault();
		if (disabledGenericSubmitLink == false){

			if ($(this).hasClass('noDisableLink') == false){
				disabledGenericSubmitLink = true;
			}
			replaceWordCharsAllTextBoxes();
			$(this).closest("form").submit();
			if ($(this).attr('class').indexOf('noloadinggif', 0) == -1){
				$(this).after(' <img src="'+webpath_img+'icon_loading_circleV3.gif" class="loadingGif"/>');
				$('.loadingGif').hide(5000);
			}


		}
	});






	/* Check username exists */
	$("#checkUsername").blur(function(e){
		if ($(this).val() != ''){
			userName = $(this).val();
			$("#errDivcheckUsername").remove();
			$(this).siblings(".ErrDiv").remove();
			$(this).after('<p class="ErrDiv nopad" id="errDivcheckUsername"></p>');
			$("#errDivcheckUsername").text("");
			$("#errDivcheckUsername").css("background-color","#fff").hide(250);


			/* set post vars */
			postData = 'username=' + userName;
			if ( $(this).hasClass('checking_assistant_username') ){
				postData += '&checking_assistant_username=1';
				if( $('.edit_assistant_id_class').length ){
					postData += '&assistant_id='+ $('.edit_assistant_id_class').val();
				}
			}
			
			$.ajax(
			{
				type:"POST",
				url:web_root + "register/checkUsername",
				data:{username:userName},
				cache:  false,
				dataType:"json",
				beforeSend: function(x)
				{
					$("#errDivcheckUsername").html("Checking username...");
					$("#errDivcheckUsername").css("background-color","yellow").fadeIn(1000);
				},
				success: function(data)
				{
					if(data.response == 'success')
					{

						$("#errDivcheckUsername").css("background-color","#fff");
						$("#errDivcheckUsername").html(data.msg);
						$("#errDivcheckUsername").css("color","green").fadeIn(1000);
						$(".genericSubmitLink").show();
					}
					else if(data.response == 'response_code_245')
					{

						$("#errDivcheckUsername").css("background-color","#fff");
						$("#errDivcheckUsername").html('');
						$(".check_username_link_wrapper").hide();
					}
					else
					{

						$("#errDivcheckUsername").css("background-color","#fff");
						$("#errDivcheckUsername").html(data.msg);
						$("#errDivcheckUsername").css("color","red").fadeIn(1000);

					}
				}
			});
		}

	});




	/* Make Essay answers with "code" blocks viewable in scrolling div without text wrapping */
	$(document).on('change', 'input[type="checkbox"][class="view_results_pre_answer_text_remove_wraping"]', function(e){
		if ($(this).is(':checked')) {
			$('.pre_answer_text')
				.css('word-wrap', 'break-word')
				.css('overflow-x', 'visible')
				.css('white-space', 'pre-wrap')
				.css('border', 'none')
				.css('padding', 0)
				.css('margin-right', 0)
				.css('box-shadow', 'none');
		} else {
			$('.pre_answer_text')
				.css('word-wrap', 'normal')
				.css('overflow-x', 'auto')
				.css('white-space', 'pre')
				.css('border', '1px solid #d8d7d7')
				.css('padding', '5px')
				.css('margin-right', '10px')
				.css('box-shadow', 'inset 2px 2px 2px');
		}
		return false;
	});



	$('.selectme').click(function() {
		this.select();
	});


	/* check closest for has selected radio/checkbox */
	$('.isCheckboxChecked').click(function (){
		if($(this).closest("form").find('input:checked').length < 2){ // only used in export page, since one input is cheched already.
			alert('Please select a group');
			return false;
		}
	});






	$(document).on('click', '.popup', function(e){
		e.preventDefault();
		window.open( $(this).attr('href') );
	});
	$(document).on('click', '.popupSmall', function(e){
		e.preventDefault();
		window.open( $(this).attr('href'), '', 'width=620,height=550,scrollbars=yes,location=no,resizable=yes,menubar=no,toolbar=no,status=no');
	});
	$(document).on('submit', '.popupForm', function(e){
		e.preventDefault();
		var w = window.open( $(this).attr('action'),'Popup_Window','toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=400,height=300,left = 312,top = 234');
		this.target = 'Popup_Window';
	});


	/* Get rid of MS word chars on submit - No longer using
	$('form').submit(function() {
		replaceWordCharsAllTextBoxes();
		//current_form_id = this.id;//used in case we need to re-submit form on IE aborting :(
	});
	*/

	/* For IE/old browser use placeholder text */
	var placeHolderSupport = ("placeholder" in document.createElement("input"));
	if( !placeHolderSupport ){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
				var input = $(this);
				if (input.val() == '' || input.val() == input.attr('placeholder')) {
					input.addClass('placeholder');
					input.val(input.attr('placeholder'));
				}
			}).blur();
		$('[placeholder]').parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
				}
			})
		});
	}


	/**** START Sort results ****
	 *
	 * Sort differently due data we add to templates, some durations (int) and parsed as (string) see textduation
	 */

	var sortAsc, sortBy; // global to access in compare method
	$(document).on('click', '.sort-trigger', function(e){
		e.preventDefault();

		// toggle sort type.
		if ($(this).attr('data-sort') === 'asc') {
			sortAsc = true;
			$(this).attr('data-sort', 'desc');
		} else {
			sortAsc = false;
			$(this).attr('data-sort', 'asc');
		}

		if ($(this).attr('data-sort-by') === 'percentage_duration') {
			sortBy = 'percentage_duration';
		} else if ($(this).attr('data-sort-by') === 'percentage_textduration') {
			sortBy = 'percentage_textduration';
		} else if ($(this).attr('data-sort-by') === 'percentage') {
			sortBy = 'percentage';
		} else if ($(this).attr('data-sort-by') === 'date'){
			sortBy = 'date';
		} else if ($(this).attr('data-sort-by') === 'duration'){
			sortBy = 'duration';
		} else if ($(this).attr('data-sort-by') === 'textduration'){
			sortBy = 'textduration';
		} else if ($(this).attr('data-sort-by') === 'name'){
			sortBy = 'name';
		} else if ($(this).attr('data-sort-by') === 'attempts'){
			sortBy = 'attempts';
		}

		/*
		 *  pass list items to sort
		 *  We sometimes have up to three tables that can be sorted on a page (viewing students answers page overlay list results + 2 x cat stats)
		 */
		sortResults($(this).closest('div.table').find('.sort-data-set > li'));// ">" find 'direct' children only of this '.table'

	});

	function compare(a,b) {

		if (!sortAsc) {
			var t=a; a=b; b=t; // swap the parms
		}



		if (sortBy == 'percentage_duration' || sortBy == 'percentage_textduration'){

			//if percentage equal, sort by duration
			if ( a.percentage == b.percentage ){
				if ( a.duration > b.duration ) return -1;
				if ( a.duration < b.duration ) return 1;
			}
			if ( a.percentage < b.percentage ) return -1;
			if ( a.percentage > b.percentage ) return 1;

		} else if (sortBy == 'percentage'){

			if ( a.percentage < b.percentage ) return -1;
			if ( a.percentage > b.percentage ) return 1;


		} else if (sortBy == 'date'){

			if ( a.date > b.date ) return -1;
			if ( a.date < b.date ) return 1;

		} else if (sortBy == 'duration' || sortBy == 'textduration'){

			if ( a.duration > b.duration ) return -1;
			if ( a.duration < b.duration ) return 1;

		} else if (sortBy == 'attempts'){

			if ( a.attempts > b.attempts ) return -1;
			if ( a.attempts < b.attempts ) return 1;

		} else if (sortBy == 'name'){

			return a.name.localeCompare(b.name);//Works with non english chars Ãª
			//if ( a.name > b.name ) return -1;
			//if ( a.name < b.name ) return 1;

		}
		return 0;
	}

	function sortResults(listItems) {
		var listItemsObjects = [];
		// loop through each list item to set sorting data
		// Note: Sometimes duration is a tomespamt, or we use text_duration for  00:23:29 format
		listItems.each(function () {
			var listItem = {};

			listItem.elem = $(this);

			if (sortBy == 'percentage_duration'){

				listItem.percentage = 	parseFloat($(this).attr("data-percentage"));
				listItem.duration = 	parseInt($(this).attr("data-duration"));

			} else if (sortBy == 'percentage_textduration'){

				listItem.percentage = 	parseFloat($(this).attr("data-percentage"));
				listItem.duration = 	$(this).attr("data-duration");

			} else if (sortBy == 'percentage'){

				listItem.percentage = 	parseFloat($(this).attr("data-percentage"));

			} else if (sortBy == 'date'){

				listItem.date = 		parseInt($(this).attr("data-date"));

			} else if (sortBy == 'duration'){

				listItem.duration = 	parseInt($(this).attr("data-duration"));

			} else if (sortBy == 'textduration'){

				listItem.duration = 	$(this).attr("data-duration");

			} else if (sortBy == 'attempts'){

				listItem.attempts = 	parseInt($(this).attr("data-attempts"));

			} else if (sortBy == 'name'){
				if ($(this).attr("data-name")) {
                    listItem.name =     $(this).attr("data-name").toLowerCase();
                }
                else {
                    return;
                }
			}

			listItemsObjects.push(listItem);
			//console.log(listItem.percentage);
			//console.log(listItem.duration);
		});

		listItemsObjects.sort(compare);

		// for each item append it to the container. Moves existing list items.
		$.each(listItemsObjects, function(index, item){
			item.elem.appendTo(item.elem.parent());
		});
	}
	/**** END Sort results ****/



	/* Start tour JS */
	$(".navnext").delay(1000).delay(500).fadeOut(500).delay(10).fadeIn(500);
	$(".navnext").click(function(e){
		e.preventDefault();
		show_tour_div++;
		changeTour(show_tour_div);
	});
	$(".navprev").click(function(e){
		e.preventDefault();
		show_tour_div--;
		changeTour(show_tour_div);
	});
	$("ul.slider-pagination li").click(function(e){
		e.preventDefault();
		show_tour_div = $( "ul.slider-pagination li" ).index( $(this) ) ;
		changeTour(show_tour_div);
	});
	var show_tour_div = 0;//Tour JS
	function changeTour(show_tour_div){
		$("#pagecount").text(show_tour_div);
		$("[id^='tourimg_'], [id^='tourtext_']").hide();
		$("#tourimg_"+show_tour_div+", #tourtext_"+show_tour_div).show();
		if (show_tour_div < 10){
			$(".navnext").show();
		} else {
			$(".navnext").hide();
		}
		if (show_tour_div > 0){
			$(".navprev").show();
		} else {
			$(".navprev").hide();
		}
		$('#slider-position-display').text(show_tour_div+1);
		$("ul.slider-pagination li").removeClass('active');
		$("ul.slider-pagination li:eq("+show_tour_div+")").addClass("active");


	}
	/* End tour JS */


	/* Toggle large images widths [PART 1] */
	if (typeof(asset_image_allow_toggle) == "undefined"){
		asset_image_allow_toggle = true; // Default
	}
	if (typeof(asset_image_toggle_max_width) == "undefined"){
		asset_image_toggle_max_width = 500; // If setting this on page html, keep outside of $(document).ready
	}

	/* Required BBCODE and IMGW steps
		1. Convert BBCODE, Which will display images
		2. After images have fully "loaded" in dom ($(window).on("load")) add max width to all (to include hidden ones)
		3. If too wide, reduce then display them
		4. If width OK, just display them
	 */

	convertBBcodetoHtml();//also called in "results overlays"
	checkBBcodeImageWidths();//NOT called in "results overlays", instead we just use min-with in "results overlays JS"

	/*
	 * matching question JS code
	 */

	/* Global variable selected clue id on the left side */
	var selected_clue_id;

	/* Global variable selected clue div on the left side */
	var selectedClue;

	/* Global variable question id */
	var questionId;

	/* Close the floating clue div */
	function closeFloatingClue(floatingClueId, floatingClue) {
		if (floatingClueId) {

			var currentButton = floatingClue.find("#clue_" + floatingClueId);

			if (currentButton.attr('chosen') === '1'){
				currentButton.removeClass('btn-white');
			}

			floatingClue.closest('.mqsholder').find('[id^="match"]').css({display:'none'});
			floatingClue.closest('.m_margin').siblings().css({'opacity' : '1'});

			var enlargeIcon = floatingClue.find('img.remove_on_enlarge');

			floatingClue.removeAttr('style');
			enlargeIcon.css({top: '', left: 45});

			$(window).on("scroll", function () {
				floatingClue.removeAttr('style');
				enlargeIcon.css({top: '', left: 45});
			});

			$(window).unbind('scroll');
		}
	}

	/* scroll to the next clue once the current one selected */
	/*
	function scrollConfirmedClue(confirmedClueId, confirmedClue) {
		var currentClueCount =  confirmedClue.closest('.mqsholder').find('[id^="clue"]').length;
		if (confirmedClueId < currentClueCount) {
			//var nextClueId = Number(confirmedClueId) + 1;
			//var nextClue = confirmedClue.closest('.mqsholder').find("#clue_" + nextClueId).closest('.m_content');

			$('html, body').animate({scrollTop: $(confirmedClue).offset().top + confirmedClue.height()}, 500);
		} else {
			$('html, body').animate({scrollTop: $(confirmedClue).offset().top - 20}, 500);
		}
	}
	*/

	function highlightConfirmedClueMatch(highlightedClueId, highlightedClue) {
		var clueHeader = highlightedClue.find(".m_title").not(".m_button");
		clueHeader.fadeTo('slow', 0.25, function() {
			$(this).css({background: '#E7E7E7'});
		}).fadeTo('slow', 1, function() {
			$(this).css({background: '#F7F7F7'});
		});

		var clueText = highlightedClue.find("#clue_" + highlightedClueId).text().slice(0, -1);
		var matchHeader = highlightedClue.closest('.mqsholder').find("#match_" + clueText).closest('.m_title').not(".m_button");
		matchHeader.fadeTo('slow', 0.25, function() {
			$(this).css({background: '#E7E7E7'});
		}).fadeTo('slow', 1, function() {
			$(this).css({background: '#F7F7F7'});
		});
	}

	function displayMessage(selectedQuestion) {
		var messageHtml = '';
		selectedQuestion.find('[id^="clue"]').each(function() {
			if (($(this).text() === 'Choose') || ($(this).text() === 'X')) {
				var thisClueTopY = parseInt($(this).closest('.m_content').offset().top) - 20;
				var idName = 'miss_' + this.id.split('_')[1] + '_' + thisClueTopY;
				messageHtml += '<button type="button" class="btn btn-white" id="' + idName +'" >' + this.id.split('_')[1] + '</button>&nbsp;';
			}
		});
		if (messageHtml) {
			selectedQuestion.find('.m_message').show();
			selectedQuestion.find('.m_miss').html(messageHtml);
		} else {
			selectedQuestion.find('.m_message').hide();
		}
	}

	function displayWarningMessage() {

		$('.qsholder').each(function() {

			//matching multimedia type
			if ($(this).attr('data-must-answer') && ($(this).attr('data-question-type') == 'mm')) {
				var clueRow = $(this).next('.manswersDiv').find('[id^="hidden_clue"]');
				var missed_clues = [];

				clueRow.each(function () {
					if ($(this).val() == '0') {
						missed_clues.push($(this).attr('id').substr(12));
					}
				});

				if (missed_clues.length > 0) {
					var currentQuestion = $(this).next('.manswersDiv');
					var messageHtml = '';

					$.each(missed_clues, function (i, val) {
						var thisClueTopY = parseInt(currentQuestion.find('#m_title_clue_' + val).closest('.m_margin').offset().top) - 20;
						var idName = 'miss_' + val.split('_')[1] + '_' + thisClueTopY;
						messageHtml += '<button type="button" class="btn btn-white" id="' + idName + '" >' + val.split('_')[1] + '</button>&nbsp;';
					});

					if (messageHtml) {
						currentQuestion.find('.m_message').show();
						currentQuestion.find('.m_miss').html(messageHtml);
					} else {
						currentQuestion.find('.m_message').hide();
					}
				}
			}
		});
	}

	$(document).on('click', '[id^="clue_edit_"]', function() {

		right_slide_in(this.id.toString().substr(10));
	});

	$(document).on('click', '[id^="select_"]', function() {

		right_slide_in(this.id.toString().substr(7));
	});

	$(document).bind( "mouseup touchend", function(e) {

		// while image overlay exists, keep the right column open.
		// Otherwise, close it.
		if ($('.featherlight').length > 0) {
			return;
		}

		var container = $("[id^='m_column_right']");

		if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
		{
			$("#jms_content_1").parent().scrollTop(0);
			container.hide("slide", {direction: "right"}, 250);

			$(".jms").css({'opacity' : '1'});
			$('[id^="m_answer_"]').css({opacity : 1});

			$("[id^=red_bar_]").removeClass("left_bar_color");
		}
	});


	function right_slide_in(index) {

		questionId = index.split('_')[0];
		selected_clue_id = index;
		var overlay_top = $("#jms_" + index).offset().top - $("#mqsholder_" + questionId).offset().top + 6;
		var design_offset = 0;

		$("#jms_content_1").parent().animate({scrollTop: 0}, 0);

		$("#m_column_right_" + questionId).css("top", overlay_top - design_offset).css("max-height",$(window).height() * 0.8).show("slide", {direction :"right"}, 250);
		$(".add_padding").css("max-height",$(window).height() * 0.8).show("slide", {direction :"right"}, 250).css("overflow", "auto");

		$("#red_bar_" + index).addClass("left_bar_color");
		$("#jms_" + index).parent().css('padding-left', "4px");
		$('[id^="m_answer_"]').css({opacity : 0.3});

		$(".jms").css({'opacity' : '0.3'});
		$("#jms_" + index).css({'opacity' : '1'});

	}


	$(document).on('click', '[id^="match_"]', function() {

		if( this.id.split('_')[1] == questionId) {
			$('#clue_edit_' + questionId).show();
			$("#jms_content_1").parent().scrollTop(0);
			$("#m_column_right_" + questionId).hide("slide", {direction: "right"}, 250);
			var jms_button = "<button type='button' class='btn btn-white' id='clue_edit_" + selected_clue_id + "'>" + $('#text').val() + "</button>";
			$("#m_answer_" + selected_clue_id).html($(this).parents('.m_cell').prev().html() + jms_button).removeClass("m_answer_background").css("z-index", 0);
			$("#m_column_right_" + questionId).height($(".m_column_left").height());
			$(".add_padding").height($(".m_column_left").height()).css("overflow", "auto");

			$(".jms").css({'opacity' : '1'});
			$('[id^="m_answer_"]').css({'opacity' : '1'});
			$(this).closest('#mqsholder_' + questionId).find("#hidden_clue_" + selected_clue_id).val($(this).attr("data-value"));
			$("[id^=red_bar_]").removeClass("left_bar_color");
		}
	});


	$(document).on('click', '[id^="miss"]', function () {
		var currentMissTopY = this.id.split('_')[2];
		$('html, body').animate({scrollTop: currentMissTopY}, 500);
	});

	// After enlarging the image and if the natural size of image is bigger than its visual size,
	// click to enlarge it again by adding horizontal/vertical scroll bar.
	// Click again will close the image light box.
	$(document).on('click', '.featherlight-image', function() {

		if (($(this).prop('naturalWidth') > $(this).parent().width()) ||
			($(this).prop('naturalHeight') > $(this).parent().height())) {

			switch ($(this).attr('data-toggle')) {
				case undefined:
				case "0":  // enlarge the image and add horizontal/vertical scroll bar
					var image_width = $(this).css("width");
					var top = $(".featherlight-close").offset().top + "px";
					var left = $(".featherlight-close").offset().left + "px";
					$(this).css("width", "auto").attr('data-toggle', "1").css("cursor", "zoom-out");
					$(this).parent().css("width", image_width).css('overflow', 'scroll');
					// Fix close button
					$(".featherlight-close").css("position", "fixed").css("top", top).css("left", left);
					break;
				case "1":  // close light box
					$(".featherlight-close").click();
					break;
			}
		}

	});

	/* DropDowns put onChangeSubmit on form - not dropdown */
	$('.onChangeSubmit').change(function () {
		if ($(this).val() != 'none') {
			$(this).submit();
		}
	});



	/* START TOGGLE QUESTIONS JS */
	/* IN PAGE LINKS: Toggle question boxes on and off from href click on page */
	$(document).on('click touchend', 'a[class^="view_questions"]', function(e) {
		e.preventDefault();
		/* Remove current highlight from the in-page toggle links. */
		$('div.student_question_filter_links a.qfl_active').removeClass('qfl_active');

		/* Clicking from on page Question toggle links */
		if ($(this).hasClass('view_questions_all')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").fadeIn(); // Use fadeIn so users can see page has changed
		} else
		if ($(this).hasClass('view_questions_correct')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").hide();
			$("div#content div[class='qd']:has(i.qc)").fadeIn();
		} else
		if ($(this).hasClass('view_questions_partially_correct')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").hide();
			$("div#content div[class='qd']:has(i.qpc)").fadeIn();
		} else
		if ($(this).hasClass('view_questions_incorrect')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").hide();
			$("div#content div[class='qd']:has(i.qw)").fadeIn();
		} else
		if ($(this).hasClass('view_questions_require_grading')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").hide();
			$("div#content div[class='qd']:has(i.qrg)").fadeIn();
		} else
		if ($(this).hasClass('view_questions_unanswered')){
			$(this).addClass('qfl_active');
			$("div#content div[class='qd']").hide();
			$("div#content div[class='qd']:has(i.qu)").fadeIn();
		}
	});

	$(document).on('click', '.close-print-result-overlay', function(e){
		$('body').css('background-color', originalBodyBgColor);
		$('#print-content').html('');
		$('.header').show();
		$('#content').show();
		$('#footer').show();
		/* Display all questions again by default */
		$("div#content div[class='qd']").show();
		$("div.student_question_filter_links a.view_questions_all").addClass('qfl_active');
		$('.result-overlay-navigation, .close-result-overlay').show();
		$('html,body').animate({scrollTop: screenPosition.top},'slow');
	});

	/* PRINT BUTTON OPTION 1: Toggle question boxes on and off from print button dropdown and go to Print Mode View */
	$(document).on('click touchend', 'a.setup_print_result_overlay_all_questions', function(e){
		e.preventDefault();

		/* Display all questions */
		$("div#content div[class='qd']").show();

		/* Remove current highlight from the in-page toggle links as printing drop down can change the options. */
		$('div.student_question_filter_links a.qfl_active').removeClass('qfl_active');
		setupPrintResultsOverlay();

	});

	/* PRINT BUTTON OPTION 2: Toggle question boxes on and off from print button dropdown and go to Print Mode View */
	$(document).on('click touchend', 'a.setup_print_result_overlay_selected_questions', function(e){
		e.preventDefault();

		/* Hide all questions */
		$("div#content div[class='qd']").hide();

		/* Remove current highlight from the in-page toggle links as printing drop down can change the options. */
		$('div.student_question_filter_links a.qfl_active').removeClass('qfl_active');


		$.each([ 'qc', 'qpc', 'qw', 'qrg', 'qu' ], function( index, value ) {
			if ($('div.student_question_filter_links input#po'+value).is(':checked')) {
				$('div#content div[class="qd"]:has(i.'+value+')').show();
			}
		});
		setupPrintResultsOverlay();

	});
	/* END TOGGLE QUESTIONS JS */


});

function accordionToggleAddClosedClass(){
	$(".accordion-toggle").addClass('closed');
}

/* Make textarea boxes enlarge as users type */
function setupDynamicTextAreas(){
	$(document).on('keyup', 'textarea', function(){ sz(this); } );
	//$(document).on('focus', 'textarea', function(){ sz(this); } );
	//$('textarea').not('[className*="noResize"]').keyup(function(){ sz(this); } );
	//$('textarea').not('[className*="noResize"]').focus(function(){ sz(this); } );
}


/* Convert BBCode on page to HTML
 * NEEDS to be in function as it's called from "result-overlay" functionality
 * */
function convertBBcodetoHtml(){
	$(".bbcode").each(function (e) {
		$(this).html(bbCode( $(this).html() ) );
	});
}


/* Toggle large images widths [PART 2] Reduce large images and add a toggle bigger icon over image
 * Note: We need to check each image is loaded and ALL are loaded before firing
 */
function checkBBcodeImageWidths(){

	load_images($('img.imgw').length);
}

function load_images(noOfImages) {

	var noOfImagesLoaded = 0;

	/* Replace broken images so all images load and (noOfImages === noOfImagesLoaded) can become true below */
	$('img.imgw').on('error', function (){
		$(this).prop('src', 'https://www.classmarker.com/img3/i.gif');
	});

	$('img.imgw').on('load', function(){

		noOfImagesLoaded++;
		if(noOfImages && noOfImages === noOfImagesLoaded) {
			$('img.imgw').each(function () {

				var coefficient = 0.58;
				if (typeof page_type != 'undefined') {
					switch (page_type) {
						case 'test_results_nonreg':
						case 'feedback_reg':
							coefficient = 0.36;
							break;
						case 'manage_test':
							coefficient = 0.46;
							break;
						case 'qb':
							coefficient = 0.46;
							break;
						case 'qb_manage':
							coefficient = 0.58;
							break;
					}
				}
				var matching_img_max_width = $(this).parent().hasClass("matching-imgw") ? asset_image_toggle_max_width * coefficient: asset_image_toggle_max_width;
				$(this).css('max-width', matching_img_max_width).css("display", "inline-block").show();

				if ((typeof page_type == 'undefined') || (page_type !== 'papertesting' && page_type !== 'shared_single_test')) { // In print page, disable the feature of enlarging images.
					if ($(this).prop('naturalWidth') > matching_img_max_width) {
						$(this).css("cursor", "zoom-in").wrap("<a data-featherlight='image' href=" + $(this).attr('src') + "></a>");
					}
				}
			});
		}
	});
}


var disabledGenericSubmitLink = false;
//var current_form_id =null;



/* Check if we are in an iFrame for lunching paypal popup */
function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}
/* Check opener window exists */
function openerExists(){
	if (window.opener && window.opener.open && !window.opener.closed){
		return true;
	} else {
		return false;
	}
}





/***************************************************
 * START Keep session alive - Must receive emprty JSON {} or JSON error message
 ****************************************************/
var timeout_session_holder;
function startTRefresh(cm_count) {
	if (typeof use_keep_alive == 'undefined'){
		return;
	}
	var timeout_in_seconds = 480000;
	if (cm_count > 0 ){//start after first timeout
		$.getJSON(ka_path + '&' + Math.floor(Math.random() * timeout_in_seconds), function (json) {//480000
			try {
				if (json.hasOwnProperty('warn_logged_out_msg')) {
					alert(json.warn_logged_out_msg);
				}
			} catch(err) {}
		});
	}
	cm_count++;
	if (cm_count < 45 ){//45 = 6 hrs
		timeout_session_holder = setTimeout('startTRefresh(' + cm_count + ')',timeout_in_seconds);//8mins 480000
	}
}
/* startTRefresh is called on page load, ajaxRestartTRefresh only called after a AJAX request and no page reload
 * so we want to restart counter for each new question loaded */
function ajaxRestartTRefresh() {
	clearTimeout(timeout_session_holder);
	startTRefresh(0);
}
/***************************************************
 * END Keep session alive
 ***************************************************/



/***************************************************
 * START show loading error message
 ****************************************************/
var timeout_loading_error_holder;
function startTimeoutLoadingError() {
	/* Display refresh this page message if page takes longer then 90second to load */
	timeout_loading_error_holder = setTimeout('displayTimeoutLoadingError()',90000);//90 seconds
}
function displayTimeoutLoadingError(){
	window.onbeforeunload = null;
	$('img#icon_loading_kit').hide();
	$('#questions_container').animate({opacity: 0.7}, 10).show();
	$('#showRefreshInstructions').show();
	$('html, body').animate({scrollTop: $('#showRefreshInstructions').offset().top-50}, 'slow');
}
function clearTimeoutLoadingError() {
	clearTimeout(timeout_loading_error_holder);
}
/***************************************************
 * END show loading error message
 ****************************************************/


function bbCode(str){

	if( str.indexOf("[") == -1) {
		return str;
	}

	var result = XBBCODE.process({
		text: str,
		removeMisalignedTags: false,
		addInLineBreaks: false
	});
	//console.log("Errors: " + result.error);
	//console.dir(result.errorQueue);
	//console.log(result.html);// the HTML form of your BBCode
	return result.html;

}

/**
 * User to create paths for files from BBCode, including doc, image, video, audio
*/
var asset_ref_dir = new Array(
		/(0\/)/,
		/(1\/)/,
		/(2\/)/
		);
var asset_actual_dir = new Array(
	'https://0cm.classmarker.com/',//'https://s3.amazonaws.com/0cm.classmarker.com/' /img/doc/pdf/files
    'https://1cm.classmarker.com/',//'https://s3.amazonaws.com/1cm.classmarker.com/' //video
    'https://2cm.classmarker.com/' //'https://s3.amazonaws.com/2cm.classmarker.com/' //audio
);
/**
 * Used in docSelector when adding image to questions or certs, themes etc
 **/

function getDocPathForDropDown(str){

	for(i = 0; i < asset_ref_dir.length; i++) {
		str = str.replace(asset_ref_dir[i],asset_actual_dir[i]);
	}

	return str;
}

/**
 * Question Filter Links
 * Some links are shows by default, other only if applicable
 * Default shown: All questions, Correct, Incorrect
 * Maybe shown: Partial incorrect, Requires Grading
 *
 * NOTE: Print mode duplicates questions etc, so there are double question on page,
 *  so we must reference "div#content div[class='qd']" to get accurate counts
 */
function displayQuestionToggleFilterLinks(){

	/* Print option links will be existing in overlay, from previous results, if we are clicking 'Next person' for example
		so we need to reset(hide) them first
	 */
	$('div.student_question_filter_links ul li span.print_options').not(".print_all_questions").not(".print_selected_questions").parent().hide();


	$.each([ 'qc', 'qpc', 'qw', 'qrg', 'qu' ], function( index, value ) {

		/* NOTE: We filter under "div#content" so Print view doesn't interfere with the count */
		this_length = $("div#content div[class='qd']:has(i."+value+")").length;

		if (this_length) {
			$('div.student_question_filter_links span.q_' + value + '_count').text(
				this_length
			);
			/* Some Filter links are hidden by default because they are normally not required */
			$('div.student_question_filter_links span.q_' + value + '_element').show();

			/* Only display Print options that have questions*/
			$('div.student_question_filter_links ul li span.print_options input#po'+value).parent().parent().show();

		}

	});

	/* Turn on Essay question toggle option */
	if ($("div#content div.qd .qytpe_essay").length){
		$('.essay-question-wrap-text-toggle').show();
	}

}


function scoreTamperTracker(){

	/* All possible IDs - some my not be on page */
	var tmp_track_array = ["percentagespan", "pointsscoredspan", "pointsavailablespan", "resultsdiv_duration_tt", "resultsdiv_datestarted_tt", "resultsdiv_datefinished_tt"];

	/* IDs On Page - only track what is originally displayed on page */
	var track_array = [];
	for (i = 0; i < tmp_track_array.length; i++) {
		if ($('#'+tmp_track_array[i]).length == 1) {
			track_array.push(tmp_track_array[i]);
		}
	}

	var original_variables = [];
	for (i = 0; i < track_array.length; i++) {
		original_variables.push($('#'+track_array[i]).text());
	}


	function doTamperCheck(track_changes_count){

		var track_data_changed = false;
		var track_data='RG__';
		var score_change=false;

		for (i = 0; i < track_array.length; i++) {

			if ($('#'+track_array[i]).length == 0){
				/* user may remove a node */
				track_data += 'REMOVED_'+track_array[i];
				continue;
			}

			tmp_current_value = $('#'+track_array[i]).text();
			if (original_variables[i] !== tmp_current_value) {

				if (doTamperPing(track_array[i], original_variables[i], tmp_current_value)){
					track_data += 'pingtamper__';
					score_change = true;
				}

				track_data_changed = true;
				track_data += track_array[i].toUpperCase()+'_WAS_' + original_variables[i].replace(/ /g,"_") + '_NOW_' + tmp_current_value.replace(/ /g,"_")+'_END';
				original_variables[i] = tmp_current_value;
			}

		}

		if (track_data_changed) {
			//console.log(track_data);
			track_changes_count++;
			$.ajax({
				type: "GET",
				url: web_root + 'test/tracker/?TRACKER='+track_data,
				dataType: "text",
				success : function(data) {
					if (score_change){
						window.location.replace(web_root + 'test/tracker/?TRACKER=trackcomplete');
					}
				}
			});

		}

		if (track_changes_count < 30) {
			setTimeout(function(){
				doTamperCheck(track_changes_count);
			}, 5000);
		}

	}

	doTamperCheck(0);

	function doTamperPing(id, original_value, current_value){

		if (id == 'percentagespan' || id == 'pointsscoredspan' || id == 'pointsavailablespan'){

			if (original_value.replace(/\,/g,'.') != current_value.replace(/\,/g,'.')){// change comma to point is ok
				// value has changed
				return true;
			}

		}


		return false;// don't ignore, track this.

	}

}
$( document ).ready(function() {
	if (typeof score_tracker != "undefined") {
		setTimeout(scoreTamperTracker, 2000);
	}
});


/*****
 * KEEP if (!Array.prototype.filter) below
 * If IE8/7/6 does not support the array "filter" function (which we use in BackBone to transform server sent json to client JS format)
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
 */
if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fun /*, thisp */)
	{
		"use strict";
		if (this == null)
			throw new TypeError();
		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in t)
			{
				var val = t[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, t))
					res.push(val);
			}
		}
		return res;
	};
}

function sz(t) {

	a = t.value.split('\n');
	b=1;
	for (x=0;x < a.length; x++) {
	 if (a[x].length >= t.cols) b+= Math.floor(a[x].length/t.cols);
	 }
	b+= a.length;
	//if (b > t.rows) t.rows = b;
	t.rows = b;

}
function nl2br(myString){
	var regX = /\\n/g;
	var replaceString = '<br>';
	return myString.replace(regX, replaceString);
}

function replaceWordChars(text) {
	/* Was using for replacing characters in free text answering boxes - done on grading now */

	text = text.replace(/â€œ/g, '"');
	text = text.replace(/â€/g, '"');
	text = text.replace(/â€˜/g, "'");
	text = text.replace(/â€™/g, "'");
	text = text.replace(/â€›/g, "'");
	//text = text.replace(/Â´/g, "'");//Acute accent - leave otherwise
	return text;
}

function escapeHtml(str) {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function replaceWordCharsAllTextBoxes() {
	return;// No longer using
	/*
	$("textarea").each(function(){
		$(this).val(replaceWordChars($(this).val()));
	});
	$('input:text').each(function(){
		$(this).val(replaceWordChars($(this).val()));
	});
	*/
}

function trim(str){
	return str.replace(/^\s*/, "").replace(/\s*$/, "").replace(/||||/,"");
}
function checkHttpLink(str){
	if ((str != '' && str != undefined) && (!str.toLowerCase().indexOf('https://')==0 &&	!str.toLowerCase().indexOf('http://')==0 ) ){
		return false;
	} else {
		return true;
	}
}

function limitChars(className)
{
	/* Expecting className format to be: limitchars_uniqueName_20 - the underscores 'are key' to this working, see split below
	 * Where:-
	 * limitchars: is mandatory to fire this event
	 * uniqueName: identifies your element and matches the related 'info' div
	 * 20: character limit
	 *
	 * Matching info div format should be: uniqueName_info
	 */
	//First get limitchars class name incase multiple classnames are being used in this class

	var classes = className.split(' ');

	for(var i=0; i<classes.length; i++){
		if (classes[i].search(/limitchars_/i)  != -1){
			className = classes[i];
		}
	}

	var identifier = className.split('_')[1];// get uniqueName part of class
	var limit = className.split('_')[2];// get char limit
	var text = $('.'+className).val();
	var textlength = text.length;
	if(textlength > 100){
		/* We can hide counters until they have types 100 chars: EG extrenal testing custom info boxes */
		$('.' + identifier + '_info').show();
	}
	if(textlength > limit)
	{
		//$('.' + identifier + '_info').html('You cannot write more then '+limit+' characters!');
		$('.'+className).val(text.substr(0,limit));
		return false;
	}
	else
	{
		//$('.' + identifier + '_info').html('Limit '+ (limit - textlength) +' characters.');
		$('.' + identifier + '_info').html(limit - textlength);
		return true;
	}
}

function replaceLineBreak(str){

	if (str.length)	{
		str = str.replace( /\</g, '&lt;' );
		str = str.replace( /\>/g, '&gt;' );
		return str.replace( /\r?\n/g, '<br />' );
	} else {
		return str;
	}

}
function checkEmail(email){
	if ( $.trim( $('#'+email).val() ).length < 5 || $('#'+email).val().indexOf('@') == -1  || $('#'+email).val().indexOf('.') == -1){
		return false;
	} else {
		return true;
	}
}
function jqCheckAll( id, name ){
	if ($('#'+id).is(':checked') ){
		$("input[name^=" + name + "][type='checkbox']").prop('checked', true);
	} else {
		$("input[name^=" + name + "][type='checkbox']").prop('checked', false);
	}
}

function navMouseOver() {
	$('#' + this.id + ' ul').css('display','block');
}

function navMouseOverOut() {
	$('#' + this.id + ' ul').css('display','none');
}



//Are we 6789 : which yt code to display - only called if showing a yt video.
function useIframe(){
	if (navigator.appVersion.indexOf("MSIE 9.") == -1 && navigator.appVersion.indexOf("MSIE 8.") == -1 && navigator.appVersion.indexOf("MSIE 7.") == -1 && navigator.appVersion.indexOf("MSIE 6.") == -1){
		return false;
	}
	return true;
}