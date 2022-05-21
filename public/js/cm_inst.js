/************* Hover intent ***************/
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
//(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery);
!function(factory){"use strict";"function"==typeof define&&define.amd?define(["jquery"],factory):"object"==typeof module&&module.exports?module.exports=factory(require("jquery")):jQuery&&!jQuery.fn.hoverIntent&&factory(jQuery)}(function($){"use strict";function track(ev){cX=ev.pageX,cY=ev.pageY}var cX,cY,_cfg={interval:100,sensitivity:6,timeout:0},INSTANCE_COUNT=0,compare=function(ev,$el,s,cfg){if(Math.sqrt((s.pX-cX)*(s.pX-cX)+(s.pY-cY)*(s.pY-cY))<cfg.sensitivity)return $el.off(s.event,track),delete s.timeoutId,s.isActive=!0,ev.pageX=cX,ev.pageY=cY,delete s.pX,delete s.pY,cfg.over.apply($el[0],[ev]);s.pX=cX,s.pY=cY,s.timeoutId=setTimeout(function(){compare(ev,$el,s,cfg)},cfg.interval)};$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var instanceId=INSTANCE_COUNT++,cfg=$.extend({},_cfg);$.isPlainObject(handlerIn)?(cfg=$.extend(cfg,handlerIn),$.isFunction(cfg.out)||(cfg.out=cfg.over)):cfg=$.isFunction(handlerOut)?$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector}):$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut});function handleHover(e){var ev=$.extend({},e),$el=$(this),hoverIntentData=$el.data("hoverIntent");hoverIntentData||$el.data("hoverIntent",hoverIntentData={});var state=hoverIntentData[instanceId];state||(hoverIntentData[instanceId]=state={id:instanceId}),state.timeoutId&&(state.timeoutId=clearTimeout(state.timeoutId));var mousemove=state.event="mousemove.hoverIntent.hoverIntent"+instanceId;if("mouseenter"===e.type){if(state.isActive)return;state.pX=ev.pageX,state.pY=ev.pageY,$el.off(mousemove,track).on(mousemove,track),state.timeoutId=setTimeout(function(){compare(ev,$el,state,cfg)},cfg.interval)}else{if(!state.isActive)return;$el.off(mousemove,track),state.timeoutId=setTimeout(function(){!function(ev,$el,s,out){var data=$el.data("hoverIntent");data&&delete data[s.id],out.apply($el[0],[ev])}(ev,$el,state,cfg.out)},cfg.timeout)}}return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}});
/*****************END HOVER INTENT **************/


$("document").ready(function() {


	/* Browsers won't let BBCode sceditor work on hidden elements - so we hide after load */
	$('.delay_hide_sceditor').hide();


	$(".remove-on-load").remove();


	$("#tabs").tabs();
	$('.taboff').click(function () {
		if ($(this).find('a').attr('href') != '#') {
			top.location.href = $(this).find('a').attr('href');
		}
	});


	/* More / Less
	 var toogleText = jQuery(".more-toggle").html();
	 $(".more-toggle").prev().hide();
	 $(".more-toggle").addClass('closed');

	 $(".more-toggle").click(function(){
	 $(this).prev().slideToggle(100 ,function(){
	 if ($(this).is(':hidden')) {
	 $(this).next().removeClass('open');
	 $(this).next().addClass('closed');
	 $(this).next().html(toogleText);
	 } else {
	 $(this).next().removeClass('closed');
	 $(this).next().addClass('open');
	 $(this).next().html('Less Details');
	 }
	 });
	 });
	 */

	/* expand/collapse members etc / apps.js handles expanding backbone rendered content such as  groups / tests / links using expandAll class */
	$('.expandAll2').click(function (e) {
		e.preventDefault();
		$(".accordion-toggle").removeClass('closed').addClass('open');
		$(".accordion-fold").show();
		/*
		 $(".accordion-toggle").each(function(){
		 $(this).next().slideDown(100 ,function(){
		 $(this).prev().removeClass('closed');
		 $(this).prev().addClass('open');
		 });
		 });
		 return false;
		 */

	});
	$('.collapseAll2').click(function (e) {
		e.preventDefault();
		$(".accordion-toggle").removeClass('open').addClass('closed');
		$(".accordion-fold").hide();
		/*
		 $(".accordion-toggle").each(function(){
		 $(this).next().slideUp(100 ,function(){
		 $(this).prev().removeClass('open');
		 $(this).prev().addClass('closed');
		 });
		 });
		 return false;
		 */

	});

	$('.expandAnswers').click(function (e) {
		e.preventDefault();
		$('[id^="dotog_ans"]').show();
		//$('.open-close-toggle').text('Less');
	});
	$('.collapseAnswers').click(function (e) {
		e.preventDefault();
		$('[id^="dotog_ans"]').hide();
		//$('.open-close-toggle').text('More');
	});

	/* Open close questions to display answer etc
	 $(".open-close-toggle").click(function(){
	 if ($(this).html() == 'More'){
	 //$(this).html('Less')
	 } else {
	 //$(this).html('More')
	 }
	 });
	 */




	$('[id^="submit_"]').click(function (e) {
		var can_submit = true;
		$(this).closest('form').find('.checkEmpty').each(function () {
			$(this).val(trim($(this).val()));
			if ($(this).val() == '') {
				alert('Please fill in required fields.');
				can_submit = false;
			}
		});
		if (can_submit) {
			$(this).after(' <img src="' + webpath_img + 'icon_loading_circleV3.gif" height="16" width="16" class="loadingGif"/>');
			$('.loadingGif').delay(5000).fadeOut('slow');
			$('#do' + this.id).submit();

		}
		return false;
	});

	$(document).on('click', ".checkDelete", function () {
		return confirm('WARNING: Deleting is permanent!\n\nNOTE: Deleting can take a few minutes if a lot of data is to be deleted!\n\nDo not click away from this page, it will refresh once the deleting is completed.');
	});
	$('.checkRemove').click(function () {
		return confirm('Are you sure you want to remove this Question from this Test?');
	});
	$('[name^="rg_id-"]').click(function () {
		$('input[name="rg_check_all_groups"]').prop('checked', false);
	});
	$('[name^="rg_check_all_groups"]').click(function () {
		if ($('[name^="rg_check_all_groups"]').is(":checked")) {
			$('input[name^="rg_id-"]').prop('checked', true);
		} else {
			$('input[name^="rg_id-"]').prop('checked', false);
		}
	});
	$('[name^="nrg_id-"]').click(function () {
		$('input[name="nrg_check_all_groups"]').prop('checked', false);
	});
	$('[name^="nrg_check_all_groups"]').click(function () {
		if ($('[name^="nrg_check_all_groups"]').is(":checked")) {
			$('input[name^="nrg_id-"]').prop('checked', true);
		} else {
			$('input[name^="nrg_id-"]').prop('checked', false);
		}
	});
	$('[name^="nrg_id-"]').click(function () {
		$('input[name="nrg_check_all_groups"]').prop('checked', false);
	});
	$(document).on('click', '#raw_link, #embed_link', function (e) {
	    e.preventDefault();
		if ($(this).attr('id') == 'embed_link'){
		    $('#raw_link_span').removeClass('bold').html('<a href="#" id="raw_link">Link</a>');
            $('#embed_link_span').addClass('bold').html('Embed on your website');
		    $('#raw_link_div').hide();$('#embed_link_div').show();
        } else {
            $('#embed_link_span').removeClass('bold').html('<a href="#" id="embed_link">Embed on your website</a>');
            $('#raw_link_span').addClass('bold').html('Link');
            $('#embed_link_div').hide();$('#raw_link_div').show();
        }
	});

	/* Load cat stats with ajax on test results pages */
	var loaded_cat_stats = false;
	$("#trigger_show_cat_stats_div_rg").click(function () {
		/* Prevent multiple call when already loaded */
		if (loaded_cat_stats) {
			return;
		}
		$.ajax(
			{
				type: "GET",
				url: $(this).data('href'),
				cache: false,
				success: function (data) {
					$('#show_cat_stats_div').html(data);
					loaded_cat_stats = true;
				},
				error: function () {
					$('#show_cat_stats_div').hide();
					alert('Statistics did not load, please try again.');
				}
			});
	});

	var last_dates_checked = false;
	var this_dates_checked = false;
	$("#trigger_show_cat_stats_div_nrg").click(function () {
		/* Prevent multiple call when already loaded */
		this_dates_checked = $('#catstat_start_date').val() + $('#catstat_view_num_days').val();
		if (last_dates_checked == this_dates_checked) {
			/* Don't request exact same stats a second time in a row */
			return;
		}
		last_dates_checked = $('#catstat_start_date').val() + $('#catstat_view_num_days').val();

		$('#loading_cat_stats_div').show();
		$('#show_cat_stats_div').hide();
		$.ajax(
			{
				type: "GET",
				url: $('#show_cat_stats_form_nrg').attr('action'),
				cache: false,
				data: {
					nrg_id: $('#catstat_nrg_id').val(),
					test_id: $('#catstat_test_id').val(),
					start_date: $('#catstat_start_date').val(),
					view_num_days: $('#catstat_view_num_days').val(),
					url_tc: $('#url_tc').val(),
					url_tl: $('#url_tl').val(),
					url_sig: $('#url_sig').val(),
					url_action: $('#url_action').val(),
					url_key: $('#url_key').val()
				},
				success: function (data) {
					$('#loading_cat_stats_div').hide();
					$('#show_cat_stats_div').html(data).show();
				},
				error: function () {
					$('#show_cat_stats_div').hide();
					$('#loading_cat_stats_div').hide();
					alert('Statistics did not load, please try again.');
				}
			});
	});

	/* Assistant warnings */
	$(document).on('click', ".alert_no_permission_feature", function (e) {
		e.preventDefault();
		alert('You do not have permission for this task.\n\nYou can view your permissions from your My account page.\n\nContact the Account owner for requesting permission.');
	});


	// START: Email Student

	/**
	 * Check that checkboxes are selected to display email results
	 * @return bool
	 */
	function invalid_add_to_email_queue() {

		var email_student_checkbox_id_array = ['student_email_resultspage_show_score_points',
			'student_email_resultspage_show_score_percentage',
			'student_email_resultspage_show_test_feedback',
			'student_email_resultspage_show_answers',
			'student_email_resultspage_show_correct_answers',
			'student_email_resultspage_show_incorrect_only',
			'student_email_resultspage_show_category_stats'];

		for (var i = 0; i < email_student_checkbox_id_array.length; i++) {
			if (document.getElementById(email_student_checkbox_id_array[i]).checked) {
				return true;
			}
		}

		return false;
	};


	/* Load email stats with ajax on test results pages */
	$(document).on('click', '#trigger_email_send', function (e) {
		e.preventDefault();

		$.ajax({
			type: "GET",
			url: $(this).data('href'),
			cache: false,
			success: function (data) {
				$('#html_email_send').html(data);
				$("#student_email_resultspage_send_date_datepickerfrom").datepicker({minDate: 'NOW', maxDate: '+1M'});
			},
			error: function () {
				$('#html_email_send').hide();
				alert('Email options did not load, please try again.');
			}
		});
	});

	$(document).on('change', '.email_student_result_checkbox', function () {

		var checked = invalid_add_to_email_queue();

		if (checked) {
			$('#email_student').val('1');

			// Enable the text inputs
			$('#student_email_resultspage_from').attr('disabled', false);
			$('#student_email_resultspage_subject').attr('disabled', false);
			$('#student_email_resultspage_send_date_datepickerfrom').attr('disabled', false);
			$('#student_email_resultspage_add_to_email_queue').attr('disabled', false);
			$('#student_email_resultspage_send_email_details_fields').slideDown();
		} else {
			$('#email_student').val('0');

			// Disable the text inputs. Im not clearing the content just in case the admin did not want to disable test taker emails.
			// The values will not be saved.
			$('#student_email_resultspage_send_email_details_fields').slideUp();
			$('#student_email_resultspage_from').attr('disabled', true);
			$('#student_email_resultspage_subject').attr('disabled', true);
			$('#student_email_resultspage_send_date_datepickerfrom').attr('disabled', true);
			$('#student_email_resultspage_add_to_email_queue').attr('disabled', true);

		}

	});

	$(document).on('change', '#show_answers', function () {
		if ($(this).is(':checked') == false) {
			$('#student_email_resultspage_show_correct_answers, #student_email_resultspage_show_incorrect_only').removeAttr('checked');
		}
	});

	$(document).on('change', '#student_email_resultspage_show_answers', function () {
		if ($(this).is(':checked') == false) {
			$('#student_email_resultspage_show_correct_answers, #student_email_resultspage_show_incorrect_only').removeAttr('checked');
		}
	});

	$(document).on('change', '#student_email_resultspage_show_correct_answers, #student_email_resultspage_show_incorrect_only', function () {
		$('#student_email_resultspage_show_answers').prop("checked", true);
	});

	$(document).on('change', 'input[name="student_email_resultspage_send_type_auto"]', function () {
		if ($(this).val() === 'auto') {
			$('#student_email_resultspage_send_date_section').hide();
		} else {
			$('#student_email_resultspage_send_date_section').slideDown();
		}

	});

	// END: Email Student




	/* Load payment reports with ajax on test results pages */
	var loaded_payment_report_stats = false;
	$("#trigger_show_payment_reports_div").click(function () {
		/* Prevent multiple call when already loaded */
		if (loaded_payment_report_stats) {
			return;
		}
		$.ajax(
			{
				type: "GET",
				url: $(this).data('href'),
				cache: false,
				success: function (data) {
					$('#show_payment_report_stats_div').html(data);
					loaded_payment_report_stats = true;
				},
				error: function () {
					$('#show_payment_report_stats_div').hide();
					alert('Report did not load, please try again.');
				}
			});
	});

	/* Assets */
	// display asset images on assets page
	$("[class^='showAssetImage']").click(function () {
		$('#' + $(this).attr('class') + 'show').html('<img src="' + this.id + '" class="limitwidth" alt=""/>').show();
		return false;
	});

	/* Show question in test */
	$("[id^='sqit-']").click(function () {
		var htmlcontent = '';
		var counter = 0;
		var display_id = this.id;
		var qid = this.id.split('-')[1];//splid this.id for question_id

		$.getJSON(webpath_admin + 'tests/usedin?qid=' + qid, function (data) {

			if (data.lists != undefined) {

				$.each(data.lists, function (list0,list1) {
					counter++;
					// htmlcontent += '<p>' + counter + ') <a href="' + webpath_admin + 'tests/test/?test_id=' + id + '">' + name + '</a></p>';
					htmlcontent += '<p>' + counter + ') <a href="' + webpath_admin + 'tests/test/?test_id=' + list1._id + '">' + JSON.stringify(list1.test_name) + '</a></p>';
				});

			} else if (data.msg == 'notests') {
				htmlcontent = 'No Tests are currently using this Question. <a href="#" class="closeMeLink right close"></a>';

			} else if (data.response == 'error' ) {
				htmlcontent = data.msg;
			} else {

				//show an error
				htmlcontent = '<div class="ajaxerror">Sorry please try again.<a href="#" class="closeMeLink right close"></a></div>';
			}
			if (counter) {
				htmlcontent = '<p>Tests currently using this Question: <a href="#" class="closeMeLink right close"></a></p>' + htmlcontent;
			}

			$('#d' + display_id).html('<div class="showTestsUsedIn closeMeContainer">' + htmlcontent + '</div>');
			$('#d' + display_id).slideDown();

		});
	});


	/* Generate BBCode */
	$(".bbcodeInWrapper").each(function () {
		handlebbcodeInWrapper(this, true);
	});

	/* Tutorial trigger */
	$("#walkthrough").click(function (e) {
		e.preventDefault();
		if (typeof dashboard_tutorial != 'undefined' ){
     		 hopscotch.startTour(dashboard_tutorial);
    	} else {
			window.location = web_root + 'a/?walkthrough=1';
		}
    });








	/* Generic toggle input editing on-off ,[id^="showText_"] */
	$(document).on('click','[id^="editLink_"]', function(e) {

		/* get id to be used throughout */
		var wrapper_id = $(this).closest('[id^="wrapEdit_"]').get(0).id.substring(9);

		/* filter through HTML under this wrapper */
		$('#wrapEdit_' + wrapper_id).find('[id^="editText_"]').each(function (index) {

			current_id = this.id.substring(9);
			/* Hide visible text */
			$('#wrapEdit_' + wrapper_id).find('#showText_' + current_id).hide();

			/* Copy prev visible text to respective input box for editing */
			//$('#wrapEdit_'+wrapper_id).find('#editText_' + current_id).val($('#wrapEdit_'+wrapper_id).find('#showText_' + current_id).text()).show();
			$('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).val(bbCodeArray[current_id]).show();
			$('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).show();
		});
		//$('[class^="misc_'+wrapper_id+'_"]').show();
		$('#wrapEdit_' + wrapper_id).find('[class^="misc_"]').show();
		$('#wrapEdit_' + wrapper_id).find('.ajaxCancelBtn').show();
		$('#wrapEdit_' + wrapper_id).find('.ajaxSubmitBtn').show();
		if ($('[id^="editLink_' + wrapper_id + '"]').attr('class') !== undefined &&
			$('[id^="editLink_' + wrapper_id + '"]').hasClass('doHide')) {//.attr('class').indexOf('doHide', 0) == 0 ){
			$('[id^="editLink_' + wrapper_id + '"]').hide();
		}
		return false;
	});


	/* Show loading gif */
	$(document).on('click','.ajaxSubmitBtn', function(e) {


		var wrapper_id = $(this).closest('[id^="wrapEdit_"]').get(0).id.substring(9);

		$('#wrapEdit_' + wrapper_id).find('[id^="editText_"]').each(function (index) {

			current_id = this.id.substring(9);
			/* Set bbCodeArray[current_id] again so we can re-use this new bbcode if editing again */
			bbCodeArray[current_id] = $('#editText_' + current_id).val();
		});

		//$(this).after('<img src="'+webpath_img+'icon_loading_circleV3.gif" class="loadingGif"/>');
		$('#wrapEdit_' + wrapper_id).find('.ajaxCancelBtn').hide();
		$('#wrapEdit_' + wrapper_id).find('.ajaxSubmitBtn').hide();

		//$(this).hide();

	});
	/* Show loading gif */
	$(document).on('click','.ajaxDeleteBtn', function(e) {

		var wrapper_id = $(this).closest('[id^="wrapDelete_"]').get(0).id.substring(9);


		$('#wrapEdit_' + wrapper_id).find('.ajaxSubmitBtn').hide();
		$(this).after('<img src="' + webpath_img + 'icon_loading_circleV3.gif" class="loadingGif"/>');
		//$(this).hide();

	});

	/* Cancel any text changes without submitting */
	$(document).on('click','.ajaxCancelBtn', function(e) {

		var wrapper_id = $(this).closest('[id^="wrapEdit_"]').get(0).id.substring(9);
		$('#errorDiv_' + wrapper_id).remove();
		$('#wrapEdit_' + wrapper_id).find('[id^="showText_"]').each(function (index) {

			current_id = this.id.substring(9);

			/* Add edited text back to display div and show it */
			$('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).hide();
			/* Restore original text */
			$('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).val(bbCodeArray[current_id]);
			$('#wrapEdit_' + wrapper_id).find('#showText_' + current_id).show();

		});
		//$('[class^="misc_'+wrapper_id+'_"]').hide();
		$('#wrapEdit_' + wrapper_id).find('[class^="misc_"]').hide();
		$('#wrapEdit_' + wrapper_id).find('.ajaxCancelBtn').hide();
		$('#wrapEdit_' + wrapper_id).find('.ajaxSubmitBtn').hide();
		$('[id^="editLink_' + wrapper_id + '"]').show();

	});


	$(document).on('click', '#update-name-email-submit', function(e) {

		e.preventDefault();

		$.ajax({
			type: "POST",
			url: web_root + "a/tests/rpc/updateNonRegGroupNameEmail.rpc.php",
			data: $("#update-name-email").serialize(),
			dataType: "json",
			success: function (data) {
				genericFormResponse(data);
				if (data.response == 'success') {
					if(data.msg != '1') {  // No any change
						$('.show_grade_refresh').show();
					}
					var email = $('#showText_email').html();
					var firstname = $('#showText_firstname').html();
					var lasttname = $('#showText_lastname').html();
					if(email) {
						$('#showText_email').html('<a href="mailto:' + email + '">' + email + '</a><span class="edit-symbol"></span>');
					}else if(lasttname){
						$('#showText_lastname').html(lasttname + '</a><span class="edit-symbol"></span>');
					}else {
						$('#showText_firstname').html(firstname + '</a><span class="edit-symbol"></span>');

					}
				}
			}
		});
	});






	/* Add remove questions from Test */
	/* Add single question to test */
	$("[id^='addq-']").click(function () {

		var test_id = $('input[name="test_id"]').val();
		var qid = this.id.split('-')[1];//splid this.id for question_id
		var dataToBeSent = {test_id: test_id, qid: qid, action: "add"};

		var tmphtml = $('#d' + qid).html();
		$('#d' + qid).html('Adding question...');


		$.post(webpath_admin + 'questions/addQuestionsToTest/'+qid, dataToBeSent, function (data, textStatus) {
			//data contains the JSON object
			//textStatus contains the status: success, error, etc
			if (data.response == 'success') {

				$('#d' + data.qid).closest('div.row').addClass('question_selected');
				$('#num_questions').html(data.num_questions_in_test);
				$('#d' + data.qid).html('Question Added. <a href="' + webpath_admin + 'tests/test/?test_id=' + data.test_id + '">Back to Test.</a>');

			} else {

				$('#d' + qid).html(tmphtml);//add original HTML back on error
				alert('No update was made.\n\nTry refreshing this page if this problem persists.X');
			}
		}, "json").fail(function () {
			alert("No update was made.\n\nTry refreshing this page if this problem persists.");
		});

		return false;
	});
	/* Remove single question from test
	 * From both QB or Edit test page directly
	 */
	$("[id^='removeq-']").click(function () {

		if ($(this).hasClass('edit-test-page')) {
			var page_type = 'edit_test';
		} else {
			var page_type = 'qb';
		}
		var test_id = $('input[name="test_id"]').val();
		var qid = this.id.split('-')[1];//splid this.id for question_id
		var dataToBeSent = {test_id: test_id, qid: qid, action: "remove"};

		var tmphtml = $('#d' + qid).html();
		$('#d' + qid).html('Removing question...');


		$.post(webpath_admin + 'questions/removeQuestionsfromTest/'+qid, dataToBeSent, function (data, textStatus) {
			//data contains the JSON object
			//textStatus contains the status: success, error, etc
			if (data.response == 'success') {

				if (page_type == 'qb') {
					/* question bank page update */
					$('#d' + data.qid).closest('div.row').removeClass('question_selected');
					$('#num_questions').html(data.num_questions_in_test);
					$('#d' + data.qid).html('Question Removed from Test. <a href="' + webpath_admin + 'tests/test/?test_id=' + data.test_id + '">Back to Test.</a>');
				} else {
					/* edit test page */
					$('#d' + data.qid).closest('div.row').addClass('question_selected').html('<p>Question removed from Test.</p>');

					$('#total_questions_count').hide().text(parseInt($('#total_questions_count').text() - 1)).fadeIn();//get value from html page and reduce by one
					$('#num_static_questions').text(data.num_questions_in_test);
					$('#static_points').html('&nbsp');//we don't know so remove points
				}
			} else {

				$('#d' + qid).html(tmphtml);//add original HTML back on error
				alert("No update was made.\n\nTry refreshing this page if this problem persists.");
			}
		}, "json").fail(function () {
			alert("No update was made.\n\nTry refreshing this page if this problem persists.");
		});
		return false;
	});
	/* ENd Add remove questions from Test */


	//delete question
	$("[id^='dq-']").click(function () {
		var qid = this.id.split('-')[1];//splid this.id for question_id
		var thisObj = this;
		if (!confirm('Are you sure you want to permanently delete this Question?')) {
			return false;
		}
		// $.getJSON(webpath_admin + 'tests/qb/manage/deleteQuestion.rpc.php?qid=' + qid, function (data) {
		var posting = $.post(webpath_admin + 'questions/'+qid+'?_method=DELETE', function (data) {			
			if (data.response == "success") {
				$(thisObj).closest('.row').html(data.msg);
				return false;
			} else {
				$('#dsqit-'+qid).html('<div class="ajaxerror editor">'+data.msg+'</div>');
				return false;
			}
		});
		// posting.done(function(data){
		// })
		// posting.fail(function(data){
		// 	alert("posting fail")
		// 	alert(data.response)
		// })
		// posting.always(function(data){
		// 	alert("posting always")
		// })		
		posting.success(function(data){
			// alert("posting success")
		})		
		posting.error(function(data){
			// alert("posting error")
		})
		// posting.complete(function(data){
		// 	alert("posting complete")
		// })		
		// alert("last")
		// window.location.assign("/questions")		
		return false;		
	});	

	//delete email
	$("[id^='de-']").click(function () {
		var email_id = this.id.split('-')[1];//splid this.id for question_id
		var thisObj = this;
		var htmlcontent = '';
		if (!confirm('Are you sure you want to delete this email address?')) {
			return false;
		}
		$('#ade_' + email_id).remove();
		/* del prev messages */
		$.getJSON(webpath_admin + 'myaccount/deleteEmail.rpc.php?email_id=' + email_id, function (data) {


			if (data.group_names != undefined) {

				$.each(data.group_names, function (id, group_name) {
					/* list group names */
					htmlcontent += '<strong>Link:</strong> ' + group_name + '<br/>';
				});
				$('#de_' + email_id).append('<div class="ajaxerror" id="ade_' + email_id + '">' + data.msg + '<br/><br/>' + htmlcontent + '</div>');
			}
			else if (data.response == 'success') {
				$('#de_' + email_id).html(data.msg).addClass('ajaxsuccess');
				return false;
			} else {
				$('#de_' + email_id).append('<div class="ajaxerror" id="ade_' + email_id + '">' + data.msg + '</div>');
				return false;
			}

		});
		return false;

	});

	/* Hover question footer buttons on QB etc */
	$("div.question-footer-hover-trigger div").hover(
		function () {
			$(this).find('div.question-footer-hover').removeClass('opacityon');
		},
		function () {
			$(this).find('div.question-footer-hover').addClass('opacityon');
		}
	);

	/* submit test for assignment on step 1 assign page */
	$('.assignselect').click(function () {
		$(this).closest('form').submit();
	});
	/* step 2 assign page
	$('.assign_right_link').click(function () {
		$('#dotog_assign_left').slideUp();
		$('.assign_left_link').parent().removeClass('selected');
		$('.assign_right_link').parent().addClass('selected');
	});
	$('.assign_left_link').click(function () {
		// $('#dotog_non_reg_existing_groups').slideUp();
		$('#dotog_non_reg_groups').slideUp();
		$('.assign_right_link').parent().removeClass('selected');
		$('.assign_left_link').parent().addClass('selected');
	});*/

	/* Category change */
	$('#cat_select').change(function () {
		$("[class*='sbcid']").hide();
		if ($(this).val() == -1) {
			$("[class*='sbcid']").slideDown();
		} else {
			$("[class*='sbcid" + $(this).val() + "']").slideDown();
		}
	});
	/* Don't allow Parent categories to be selected */
	$(document).on('change', 'select.no_parent_cat_selection', function () {

	    if (($(this).val()).indexOf("pc")>-1) {
				alert('You can only select Sub Categories, not Parent Categories.');
	            $(this).val($.data(this, 'current'));
	            return false;

	    }

	    $.data(this, 'current', $(this).val());
	});






	/* TOP MENU & HoverIntent */
	if ($('.menu-arrow').parent().parent().hasClass('current')) {
		$('.current .menu-arrow').removeClass('menu-arrow-white').addClass('menu-arrow-black');
	}

	$(document).on('click', 'a.closeTable', function (e) {
		e.preventDefault();
		$(this).closest('.table').hide();
	});
	/* Allow hover state in iphones etc */
	$('a.touchcheck').click(function (e) {

		var attr = $(this).attr('data-touchcheck');

		if (typeof attr !== 'undefined' && attr !== false) {
			/* attr was set below - allow click */

		} else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || screen.width <= 480) {
			//http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
			$(this).attr('data-touchcheck', 1);

			return false;
		}

	});
	/* For touch devices, ensure clicks are triggered */
	$(document).on('touchend', '.dropdown ul a', function (e) {
		//e.preventDefault();
		if ($(this).attr('href') != "#") {
			window.location = $(this).attr('href');
		}
	});

	$("#home, #help, #account, #search, #preview-test").hoverIntent(navMouseOver, navMouseOverOut);

	$('#preview-test').on('touchstart', function (event) {
		event.stopPropagation();
		$("a.touchcheck").removeAttr("href");
		$('.preview-test-nav').delay(50000).show();
		$('#' + this.id + ' .menu-arrow').removeClass('menu-arrow-white').addClass('menu-arrow-black');

		$(document).one('touchstart', function (e) {
			if ($('.preview-test-nav').is(":visible") && ($(e.target).closest('div.preview-test-nav').length === 0)) {
				$('.preview-test-nav').hide();
				$('#preview-test .menu-arrow').removeClass('menu-arrow-black').addClass('menu-arrow-white');
			}
		});
	});

	$('#home').on('touchstart', function (event) {
		event.stopPropagation();
		$("a.touchcheck").removeAttr("href");
		$('.level-2').show();

		$(document).one('touchstart', function (e) {
			if ($('.level-2').is(":visible") && ($(e.target).closest('div.level-2').length === 0)) {
				$('.level-2').hide();
			}
		});
	});

	$('#help').on('touchstart', function (event) {
		event.stopPropagation();
		$("a.touchcheck").removeAttr("href");
		$('.help-nav').show();

		$(document).one('touchstart', function (e) {
			if ($('.help-nav').is(":visible") && ($(e.target).closest('div.help-nav').length === 0)) {
				$('.help-nav').hide();
			}
		});
	});

	$('#account').on('touchstart', function (event) {
		event.stopPropagation();
		$("a.touchcheck").removeAttr("href");
		$('.account-nav').show();

		$(document).one('touchstart', function (e) {
			if ($('.account-nav').is(":visible") && ($(e.target).closest('div.account-nav').length === 0)) {
				$('.account-nav').hide();
			}
		});
	});


	$('#search').on('touchstart', function (event) {
		event.stopPropagation();
		$("a.touchcheck").removeAttr("href");
		$('.search-form').show();
		$('.' + this.id + '-nav .search-icon').removeClass('search-icon-white').addClass('search-icon-black');

		$(document).one('touchstart', function (e) {
			if ($('.search-form').is(":visible") && ($(e.target).closest('div.search-form').length === 0)) {
				$('.search-form').hide();
				$('.search-nav .search-icon').removeClass('search-icon-black').addClass('search-icon-white');
			}
		});
	});


	$('.access ul li ul a, #nav-search').click(function () {
		/* TW Clicking backbone nav links/search won't close hover nav - do it here */
		navMouseOverOut();
	});
	$("#search-by, .user-search-field").mouseout(function (e) {
		$('.tipsy').hide();//hide all tooltips at once
		e.stopPropagation();
	});


	$("#home, #account, #help, #preview-test").hover(
		function () {
			$('.' + this.id + ' .menu-arrow').removeClass('menu-arrow-white').addClass('menu-arrow-black');
		},
		function () {
			if (!$('#' + this.id).hasClass('current')) {
				$('.' + this.id + ' .menu-arrow').removeClass('menu-arrow-black').addClass('menu-arrow-white');
			}
		}
	);

	$("#search").hover(
		function () {
			$('.' + this.id + '-nav .search-icon').removeClass('search-icon-white').addClass('search-icon-black');
		},
		function () {
			$('.' + this.id + '-nav .search-icon').removeClass('search-icon-black').addClass('search-icon-white');
		}
	);

	$('#search-by').on('change', function (event) {

		// change form action and input

		if ($(this).val() === 'groups') {
			// display correct fields
			$('#test-name, #link-name, .user-search-field, .user-search-more').hide();
			$('#group-name').show().css('display', 'block');

			$('#searchForm').attr('action', 'groups'); // set so I can see what search type is on submit

		} else if ($(this).val() === 'links') {
			// display correct fields
			$('#test-name, #group-name, .user-search-field, .user-search-more').hide();
			$('#link-name').show().css('display', 'block');

			$('#searchForm').attr('action', 'links'); // set so I can see what search type is on submit

		} else if ($(this).val() === 'users') {

			$('#searchForm').addClass('searchFormUser');
			// display correct fields
			$('#group-name, #link-name, #test-name').hide();
			$('.user-search-field, .user-search-more').show();

			$('#searchForm').attr('action', 'users'); // set so I can see what search type is on submit

		} else {
			// display correct fields
			$('#group-name, #link-name, .user-search-field, .user-search-more').hide();
			$('#test-name').show();

			$('#searchForm').attr('action', 'tests'); // set so I can see what search type is on submit
		}

	});

	$('#searchForm').on('submit', function (event) {
		event.preventDefault();

		var searchType = $('#searchForm').attr('action');

		// submit to correct search
		if (searchType === 'links') {
			window.location.href = webpath_admin + 'tests/#links/' + $('#link-name').val();
		} else if (searchType === 'groups') {
			window.location.href = webpath_admin + 'tests/#groups/' + $('#group-name').val();
		} else if (searchType === 'users') {
			window.location.href = webpath_admin + 'users/search/?year=' + $('#year').val() + '&first=' + $('#first').val() + '&last=' + $('#last').val() + '&email=' + $('#e_mail').val() + '&ip_address=' + $('#ip_address_search').val() + '&regcode=' + $('#reg_code').val() + '&access_code=' + $('#access_code').val() + '&cm_user_id=' + $('#cm_user_id').val() + '&certificate_serial_number=' + $('#certificate_serial_number').val();
		} else {
			window.location.href = webpath_admin + 'tests/#tests/' + $('#test-name').val();
		}
	});
	/* End Top Menu */


	/** START: DOC SELECTOR JAVASCRIPT **/


	/** Shared code **/
	// Make the first letter of string uppercase
	function toTitleCase(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	$(document).on('click','[id^="slidedowngroup"]', function(e) {

		e.preventDefault();
		var group_identifier = this.id.substr(0,14);

		// Slide down the specific area according to the clicked element
		$('[id^="do'+group_identifier+'"]').each(function (){
			if(('do' + e.currentTarget.id) === this.id) {
				if (!$(this.id).is(':visible')) {
					$('#' + this.id).slideDown();
				}
			}else {
				$('#' + this.id).hide();
			}
		});

		// Make the clicked element bold
		$('[id^="'+group_identifier+'"]').each(function (){
			if((e.currentTarget.id) === this.id) {
				$('#' + this.id).addClass('strong');
			}else {
				$('#' + this.id).removeClass('strong');
			}
		});
	});

	$(document).on('click', '#imageTab, #documentTab, #videoTab, #audioTab', function(event) {

		var currentTab = event.currentTarget.id;  // Get current tab id
		var currentType = currentTab.substr(0, currentTab.length - 3);  // Get current medium type from tab id
		var types = ['image', 'document', 'video', 'audio'];

		$("[id^=doslidedowngroup_01_]").hide(); // hide all the pages within this dialogue
		$("#doslidedowngroup_01_files").show(); // show 'From my files' page each time we click any tab

		$("[id^=slidedowngroup_01_]").removeClass('strong');
		$("[id^=slidedowngroup_01_files]").addClass('strong'); // Make 'From my files' bold
		$('input[name="file_type"]').val(currentType);  // set up 'upload file type' which is used to upload file

		$('input[name="max_file_size"]').val(maxSize[currentType]);
		$('input[name="upload_file"], input[name="ref_name"]').val('');


		$('form.uploadAssets').hide();
		$('#previewDocumentLinkDiv').hide();

		for (var i = 0; i < types.length; i++) {

			var tab = '#' + types[i] + 'Tab';
			var instruction = '#' + types[i] + 'Body, #cm' + toTitleCase(types[i]) + 'Instructions, #external' + toTitleCase(types[i]) + 'Instructions, #upload' + toTitleCase(types[i]) + 'Instructions';

			$('#cm' + toTitleCase(types[i]) + 'PreviewDivHolder, #external' + toTitleCase(types[i]) + 'PreviewDivHolder').hide();

			if (currentType === types[i]) {
				$(tab).removeClass('taboff');
				$(tab).addClass('tabon');
				$(instruction).show();
				if($('input[name="' + currentType + '_stage"]').val() == 0){
					$('form.uploadAssets').show();
					$("#success" + toTitleCase(types[i]) + "Div").hide();
				}else {
					$('form.uploadAssets').hide();
					if(currentType != 'document') {
						$("#success" + toTitleCase(types[i]) + "Div").show();
					}else if (currentType == 'document') {
						if($('input[name="document_stage"]').val() == 1){
							$("#success" + toTitleCase(types[i]) + "Div").show();
						} else {
							$("#success" + toTitleCase(types[i]) + "Div").hide();
							$('#previewDocumentLinkDiv').show();
						}
					}
				}
			} else {
				$(tab).removeClass('tabon');
				$(tab).addClass('taboff');
				$(instruction).hide();
				$("#success" + toTitleCase(types[i]) + "Div").hide();
			}

		}

		// If request is from IE8, show warning info.
		if (typeof isMSIE8 !== 'undefined'){
			$('#externalVideoInstructions, #externalAudioInstructions, #cmVideoInstructions, #cmAudioInstructions, #doslidedowngroup_01_soundcloud').html(audio_video_warning);
		}
		(currentType == 'video') ? $('#fromYoutube, #fromVimeo').show() : $('#fromYoutube, #fromVimeo').hide();
		(currentType == 'audio') ? $('#fromSoundcloud').show() : $('#fromSoundcloud').hide();

		return false;
	});



	$(document).on('click', '#cmDocumentConfirm, #externalDocumentConfirm, #cmImageConfirm, #externalImageConfirm, #cmVideoConfirm, ' +
		'#externalVideoConfirm,  #cmAudioConfirm, #externalAudioConfirm, #soundcloudConfirm, #youtubeConfirm, #vimeoConfirm, ' +
		'#cmUploadImageConfirm, #cmUploadVideoConfirm, #cmUploadAudioConfirm, #cmUploadDocumentConfirm', function (event) {
		event.preventDefault();

		var currentButton = event.currentTarget.id;  // Get current button id
		var editor_reference = $('#obj_ref').text(); // #obj_ref stored this ID of element we are working with on main page
		var editor_id = '#' + editor_reference;
		if((editor_id == "#certbgImg") || (editor_id == '#cert_add_custom_image') || (editor_id == '#ImageLogo') || (editor_id == '#ImageBgBody') || (editor_id == '#receiptLogo')) {
			if(currentButton == 'externalImageConfirm'){
				var externalImgSrc = $('#external_image_url').val();
				$("#show_"+editor_reference).html("<img src='" + externalImgSrc + "'>");
				$("#src_"+editor_reference).val(externalImgSrc);

			}else {

				var bbcodeSrc = (currentButton == 'cmUploadImageConfirm') ? $('#uploadedImagePath').val() : $('#cmImagePreview').val();
				var pathSrc = getDocPathForDropDown(bbcodeSrc);

				if (editor_id == '#cert_add_custom_image') {
					/* We are adding new custom image to certificate */
					certificateAddCustomImage("[cmimg]" + bbcodeSrc + "[/cmimg]", pathSrc);

				} else {
					$("#show_" + editor_reference).html(pathSrc ? "<img src='" + pathSrc + "'>" : '').show();
					$("#src_" + editor_reference).val(bbcodeSrc ? "[cmimg]" + bbcodeSrc + "[/cmimg]" : '');

					/* edit certificate background image */
					if (editor_reference == 'certbgImg') {
						updateCertificateView();
					}
				}
			}
			$('#imgUploadDiv').jqmHide();

		}else {
			$(editor_id).data("sceditor").wysiwygEditorInsertHtml($('#' + currentButton.substr(0, currentButton.length - 7)).html());
			$(editor_id).data("sceditor").expandToContent(true);
			$('#fileSelectorDiv').jqmHide();
		}
	});

	$(document).on('click', '#cmDocumentTryAgain, #externalDocumentTryAgain, #cmImageTryAgain, #externalImageTryAgain, ' +
		'#youtubeTryAgain, #vimeoTryAgain, #cmVideoTryAgain, #externalVideoTryAgain, #soundcloudTryAgain, #cmAudioTryAgain, ' +
		'#externalAudioTryAgain', function (event) {
		event.preventDefault();

		var currentTab = event.currentTarget.id;  // Get current tab id
		var currentType = currentTab.substr(0, currentTab.length - 8);

		switch (currentTab){
			case 'soundcloudTryAgain':
				$('#' + currentType + 'Audio').html('');
				$('.' + currentType + 'AudioId, .' + currentType + 'Demo').toggle();
				$().toggle();
				break;
			case 'youtubeTryAgain':
			case 'vimeoTryAgain':
				$('#' + currentType + 'Video').html('');
				$('.' + currentType + 'VideoId, .' + currentType + 'Demo').toggle();
				break;
			default:
				$('#' + currentType + 'PreviewDiv').html('');
				$('#' + currentType + 'Instructions, #' + currentType + 'PreviewDivHolder').toggle();
				break;
		}
	});

	// Go back to 'Edit document title' page
	$(document).on('click', '#cmUploadedDocumentTryAgain', function(event) {
		$('#successDocumentDiv').show();
		$('#previewDocumentLinkDiv').hide();
		$('input[name="document_stage"]').val(1); // record the stage of upload
	});

	/** START Externally hosted Image **/
	$(document).on('click', '#externalImagePreview', function (event) {

		event.preventDefault();

		var external_image_url = $('#external_image_url').val().replace(/\s/g, '');

		if (external_image_url.length < 13 || (external_image_url.indexOf("http://") == -1 && external_image_url.indexOf("https://") == -1)) {
			alert('The image link is not valid. Please check it and try again. \n\nThe link must start with "http://" or "https://". If the image is on your computer you will need to upload it first.');
			return false;
		}

		$('#externalImage').html('<img data-external-image-url="' + external_image_url + '" src="' + external_image_url + '" class="previewImg"/>');

		$('#externalImageInstructions, #externalImagePreviewDivHolder').toggle();
	});


	/** START CMIMG hosted Image **/
	$(document).on('change', '#cmImagePreview', function (event) {

		event.preventDefault();

		var cm_image_url = getDocPathForDropDown($('#cmImagePreview').val());

		var cmImageTemplate = '<img data-cmimg-url="' + $('#cmImagePreview').val() + '" src="' + cm_image_url + '" class="previewImg"/>';
		$('#cmImage').html(cmImageTemplate);

		$('#cmImageInstructions, #cmImagePreviewDivHolder').toggle();
	});

	/** START CM hosted Video **/
	$(document).on('change', '#cmVideoPreview', function (event) {

		event.preventDefault();

		var video_name = $('#cmVideoPreview').val();

		$('#cmVideo').html('<iframe class="black-background" width="242" height="197" src="'+web_root+'videoaudioiframe.php?type=cmvideo&content=' + video_name + '" data-cmvideo-url="' + video_name + '"  frameborder="0" allowfullscreen></iframe>');

		$('#cmVideoInstructions, #cmVideoPreviewDivHolder').toggle();
	});

	/** START external hosted Video **/
	$(document).on('click', '#externalVideoPreview', function (event) {
		event.preventDefault();

		var video_name = $('#external_video_url').val().replace(/\s/g, '');
		if (video_name.indexOf('youtube.com/') > -1 ){
			alert('This link is a Youtube video. Please choose Youtube button and try again');
			return false;
		}
		if (video_name.indexOf('vimeo.com/') > -1 ){
			alert('This link is a Vimeo video. Please choose Vimeo button and try again');
			return false;
		}

		if (video_name.substr(video_name.length - 4) !== '.mp4'){
			alert('This link is not a mp4 video. Please check it and try again');
			return false;
		}

		$('#externalVideo').html('<iframe class="black-background" width="242" height="197" src="'+web_root+'videoaudioiframe.php?type=exvideo&content=' + video_name + '" data-exvideo-url="' + video_name + '"  frameborder="0" allowfullscreen></iframe>');

		$('#externalVideoInstructions, #externalVideoPreviewDivHolder').toggle();
	});
	/** END external hosted Video **/

	/** START Youtube hosted Video **/
	$(document).on('click', '#youtubeTestVideo' ,function(event){
		event.preventDefault();

		var youtube_id = youtubeIdExtract($('.youtubeVideoId #test_video_id').val().replace(/\s/g, ''));
		if (youtube_id.length == 11){
			$('#youtube').html('<iframe width="225" height="185" data-youtube-id="' + youtube_id + '" src="https://www.youtube-nocookie.com/embed/'+youtube_id+'?rel=0&amp;showsearch=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
			$('.youtubeVideoId, .youtubeDemo').toggle();
		}
	});

	/** START Vimeo hosted Video **/
	$(document).on('click', '#vimeoTestVideo',function(event){
		event.preventDefault();

		var vimeo_video_id = vimeoIdExtract($('.vimeoVideoId #test_vimeo_video_id').val().replace(/\s/g, ''));

		if (vimeo_video_id.length){

			$('#vimeo').html('<iframe data-vimeo-url="' + vimeo_video_id + '" src="https://player.vimeo.com/video/' + vimeo_video_id + '" width="225" height="185" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');

			$('.vimeoVideoId, .vimeoDemo').toggle();
		}
	});

	/** START Soundcloud hosted audio **/
	$(document).on('click', '#soundcloudTestAudio',function(event){
		event.preventDefault();

		var soundcloud_url = $('#test_soundcloud_id').val().replace(/\s/g, '');

		if (soundcloud_url.indexOf('soundcloud.com/') == -1){
			alert('This link is not a soundcloud audio. Please check it and try again');
			return false;
		}

		$("#soundcloud").html('<iframe data-soundcloud-url="' + soundcloud_url + '" width="380" height="160" src="https://w.soundcloud.com/player/?visual=true&url=' + soundcloud_url + '&show_artwork=true&auto_play=false&maxheight=160&maxwidth=600"></iframe>');
		$('.soundcloudAudioId, .soundcloudDemo').toggle();
	});

	/** START CM hosted Audio **/
	$(document).on('change', '#cmAudioPreview', function (event) {

		event.preventDefault();
		var audio_name = $('#cmAudioPreview').val();
		$('#cmAudio').html('<iframe width="300" height="30" src="'+web_root+'videoaudioiframe.php?type=cmaudio&content=' + audio_name + '" data-cmaudio-url="' + audio_name + '"  frameborder="0"></iframe>');

		$('#cmAudioInstructions, #cmAudioPreviewDivHolder').toggle();
	});

	/** START CM hosted Audio **/
	$(document).on('click', '#externalAudioPreview', function (event) {

		event.preventDefault();
		var audio_name = $('#external_audio_url').val().replace(/\s/g, '');

		if (audio_name.substr(audio_name.length - 4) !== '.mp3'){
			alert('This link is not a mp3 audio. Please check it and try again');
			return false;
		}

		$('#externalAudio').html('<iframe width="300" height="30" src="'+web_root+'videoaudioiframe.php?type=exaudio&content=' + audio_name + '" data-exaudio-url="' + audio_name + '"  frameborder="0"></iframe>');

		$('#externalAudioInstructions, #externalAudioPreviewDivHolder').toggle();
	});

	/** START Externally hosted Document **/

	$(document).on('click', '#cmUploadDocumentPreview',function(event){

		event.preventDefault();

		var reference = $.trim($('#uploaded_file_reference').val());
		if (reference == ''){
			alert('An error has occurred. Close this pop window, then click the image icon to see if you can find your Document in your uploaded files. \nOtherwise try uploading the file again.');
			return;
		}

		var title = $.trim($('#cm_upload_document_title').val());
		if (title == ''){
			alert('You must add a Link Title');
			return;
		}

		var cm_document_url = getDocPathForDropDown($('#uploaded_file_reference').val());

		$('#cmUploadDocument').html('<a data-cmdoc-url="' + reference + '" href="' + cm_document_url + '" class="popup">' + title + '</a>');

		$('#successDocumentDiv, #previewDocumentLinkDiv').toggle();

		$('input[name="document_stage"]').val(2);
	});

	$(document).on('click', '#externalDocumentPreview',function(event){

		event.preventDefault();
		var external_document_url = $('#external_document_url').val().replace(/\s/g, '');

		if (external_document_url.length < 13 || (external_document_url.indexOf("http://") == -1 && external_document_url.indexOf("https://") == -1)){
			alert('The document link is not valid. Please check it and try again. \n\nThe link must start with "http://" or "https://". If the document is on your computer you will need to upload it first.');
			return false;
		}

		var external_document_title = $.trim($('#external_document_title').val());
		if (external_document_title == ''){
			alert('You must add a Link Title');
			return;
		}

		$('#externalDocument').html('<a data-exdoc-url="' + external_document_url + '" data-external-document-title="' + external_document_title + '" href="' + external_document_url + '" class="popup">' + external_document_title + '</a>');

		$('#externalDocumentInstructions, #externalDocumentPreviewDivHolder').toggle();
	});

	/** START CMDOC UPLOAD hosted Documents **/
	$(document).on('click', '#cmDocumentPreview',function(event){

		var document_url = $('#cm_document_url').val().replace(/\s/g, '');
		if (document_url == ''){
			alert('An error has occurred. Close this pop window, then click the image icon to see if you can find your Document in your uploaded files. \nOtherwise try uploading the file again.');
			return;
		}

		var document_title = $.trim($('#cm_document_title').val());
		if (document_title == ''){
			alert('You must add a Link Title');
			return;
		}

		$('#cmDocument').html('<a data-cmdoc-url="' + document_url + '" href="' + getDocPathForDropDown(document_url) + '" class="popup">' + document_title + '</a>');

		$('#cmDocumentInstructions, #cmDocumentPreviewDivHolder').toggle();
	});

	/** END: DOC SELECTOR JAVASCRIPT **/

	/* Toggle random question options on edit test page */
	$('#tograndomoptionleft').click(function(e) {
		e.preventDefault();
		$('#dotograndomoptionright').slideUp();
		$('#tograndomoptionright').show();
		$('#tograndomoptionleft').hide();
		$('#dotograndomoptionleft').slideDown();
	});
	$('#tograndomoptionright').click(function(e) {
		e.preventDefault();
		$('#dotograndomoptionleft').slideUp();
		$('#tograndomoptionleft').show();
		$('#tograndomoptionright').hide();
		$('#dotograndomoptionright').slideDown();
	});
	/* Remove unused input boxes for accounts with large number of inputs so they are not submitted and cause server limit error */
	$('#remove_empty_random_cat_inputs').click(function() {
		$('.input_number_cats').each(function(){
			if ($(this).val() == ''){
				$(this).parent('div').remove();
			}
		});
	});
	/* Check number if set */
	$('#dotograndomoptionleft').on('submit', function(e){

		if ($('#num_rand_id').val().length == 0) {
			e.preventDefault();
			alert('You must select the Number of Random Questions to select from your chosen Categories.');
		}

	})

	/* Random settings on manage test page */
	$('.randomQuestionsForm').ajaxForm( {
		dataType : 		'json',
		cache: 			false,
		success : 		randomQuestionsResponse,
		beforeSubmit: 	randomQuestionsBeforeSend
	});


	/* BBcode sample pages */
	$(".mcsa_preview_tab_link").click(function () {

		$("#div_preview_mcsa").html('');
		$("#div_preview_mcsa").html( '<div class="qbox"><h4>Question preview</h4></div><p>' + bbCode( replaceLineBreak(document.mcsa_form.question.value) ) + '</p><div class="clearheight30"></div>');

		$("#div_preview_mcsa").show();
		$("#div_mcsa_edit").hide();

		$("#mcsa_preview_tab1").attr('class',"mcsa_edit_tab");
		$("#mcsa_edit_tab1").attr('class',"mcsa_preview_tab");

	});

	$(".mcsa_edit_tab_link").click(function () {

		$("#div_mcsa_edit").show();
		$("#div_preview_mcsa").hide();

		$("#mcsa_preview_tab1").attr('class',"mcsa_preview_tab");
		$("#mcsa_edit_tab1").attr('class',"mcsa_edit_tab");

	});
	//END display preview logged out questions

	/* disable single user access */
	//$('input[type=checkbox][id^="activeid_"]').change(function(){
	$(document).on('change', 'input[type=checkbox][id^="activeid_"]', function() {

		var thisid = this.id;
		var id_array = this.id.split('_');//splid this.id for ids
		var student_id = id_array[1];
		var rg_id = id_array[2];
		var active = 0;
		var text_status = 'Cannot Access Group:';
		if ($(this).is(":checked")){
			active = 1;
			text_status = 'Can Access Group:';
		}
		$(this).after(' <img src="'+webpath_img+'icon_loading_circleV3.gif" height="16" width="16" class="loadingGif"/>');

		$.getJSON( webpath_admin+'users/group/resetGroupPassword.rpc.php', { student_id: student_id, rg_id: rg_id, student_access: active } )
			.done(function( data ) {

				if (data.response == 'success'){
					$('#'+thisid).closest('.row').toggleClass('bginactive');

					$('#activestatus_'+student_id).text(text_status);

				} else {
					/* put checkbox back as it was */
					if ($(this).is(":checked")){
						$(this).prop('checked', false);
					} else {
						$(this).prop('checked', true);
					}
					alert(data.msg);
				}

			})
			.fail(function( jqxhr, textStatus, error ) {
				/* put checkbox back as it was */
				if ($(this).is(":checked")){
					$(this).prop('checked', false);
				} else {
					$(this).prop('checked', true);
				}
				alert('An error has occurred, please try again.');
			})
			.always(function(){
				$(".loadingGif").remove();
			});


	});


	/* Highlight elements on page. Click .highlight_somethingunique > element/s to highlight .dohighlight_somethingunique */
	$('[class*="highlight_"]').click(function(){
		var list = $(this).attr('class').split(' ');
		for(i=0;i<list.length;i++){
			if (list[i].indexOf("highlight_") !== -1){
				var originalbgcolor = $( ".do"+list[i]).css('background-color');
				$( ".do"+list[i] ).css('background-color','#e7fde7').fadeOut(500).fadeIn(2000, function(){
					$(this).css('background-color',originalbgcolor);
				});
			}
		}
	});


	/* Expand LINK embed code on Edit test page groups/links lightbox  */
	$(document).on('click', '.open_embed_links_edit_test_page',function(e){
		e.preventDefault();
		var id = $(this).attr('data-ext_test_id');
		$("#"+id).toggle();
	});

	/* Link to open Symbols light box on add questions page  */
	$(document).on('click', '.open_symbols_lightbox',function(e){
		e.preventDefault();
		showSymbolsLightbox();
	});


});






/**
 *
 */
function showSymbolsLightbox(){
	$('#symbolsDiv').jqmShow();
}


//var isMSIE8 = /*@cc_on!@*/false;
/*
We need to display bbcode boxes (if hidden) for IE8 can use them on submitting
 */
function IEHack_ShowBbcodeBeforeSubmit(){
	if (typeof isMSIE8 !== 'undefined'){

		$('.delay_hide_sceditor').each(function(){

			if ($(this).is(':visible') == false && !$(this).hasClass("isMSIEHACK_rememberMe")){
				$(this).addClass("move_off_screen");
				$(this).show();/* IE 8 cannot focus on hidden elements so we display before submit */
				$(this).addClass("isMSIEHACK_rememberMe");
				//alert('added');
			}
		});
	}
}
/*
 We need to hide BBCODE boxes again (if they were hidden) for IE8 can use them on submitting
 */
function IEHack_HideBbcodeagain(){
	if (typeof isMSIE8 !== 'undefined'){
		$('.delay_hide_sceditor').each(function(){

			if ($(this).hasClass("isMSIEHACK_rememberMe")){

				$(this).hide();/* IE 8 hide again */
				$(this).removeClass("move_off_screen");
				$(this).removeClass("isMSIEHACK_rememberMe");
				//alert('removed');
			}
		});
	}
}



var textarea;
var content;


/**
 * Used to strip bbcode before create paths
 */
var strip_search = new Array(
	/\[cmimg\]([^ \\"\n\r\t<]*?)\[\/cmimg\]/ig
);

var strip_replace = new Array(
	"$1"
);
function stripBBcode(str){
	for(i = 0; i < strip_search.length; i++) {
		str = str.replace(strip_search[i],strip_replace[i]);
	}
	return str;
}



function sqRoot(obj)
{
	textarea = document.getElementById(obj);

	if (document.selection){
		textarea.focus();
		var selected_text_object = document.selection.createRange();
		var selected_text = selected_text_object.text;

	} else {

		var len = textarea.value.length;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;

		var selected_text = textarea.value.substring(start, end);

	}
	var squareroot = prompt('Enter content to place under the Square root line:\n',selected_text);
	var scrollTop = textarea.scrollTop;
	var scrollLeft = textarea.scrollLeft;

	if (squareroot != '' && squareroot != null) {

		if (document.selection)
				{
					textarea.focus();
					var sel = document.selection.createRange();

				if(squareroot==""){
					sel.text = '[sqr]' + sel.text + '[/sqr]';
				} else {
					sel.text = '[sqr]' + squareroot + '[/sqr]';
				}

				}
	   else
		{
			var len = textarea.value.length;
			var start = textarea.selectionStart;
			var end = textarea.selectionEnd;

			var sel = textarea.value.substring(start, end);

			if(squareroot==""){
				var rep = '[sqr]' + sel + '[/sqr]';
			} else{
				var rep = '[sqr]' + squareroot + '[/sqr]';
			}

			textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);


			textarea.scrollTop = scrollTop;
			textarea.scrollLeft = scrollLeft;
		}
	}

}


function doURL(obj)
{
textarea = document.getElementById(obj);
var url = prompt('Enter the URL:\nYou can highlight some text then select the link button to hyperlink text','http://');
var scrollTop = textarea.scrollTop;
var scrollLeft = textarea.scrollLeft;

if (url != '' && url != null) {

	if (document.selection)
			{
				textarea.focus();
				var sel = document.selection.createRange();

			if(sel.text==""){
					sel.text = '[url]'  + url + '[/url]';
					} else {
					sel.text = '[url=' + url + ']' + sel.text + '[/url]';
					}

			}
   else
	{
		var len = textarea.value.length;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;

		var sel = textarea.value.substring(start, end);

		if(sel==""){
				var rep = '[url]' + url + '[/url]';
				} else
				{
				var rep = '[url=' + url + ']' + sel + '[/url]';
				}

		textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);


		textarea.scrollTop = scrollTop;
		textarea.scrollLeft = scrollLeft;
	}
 }
}

function doAddTags(tag1,tag2,obj)
{
textarea = document.getElementById(obj);
	// Code for IE
		if (document.selection)
			{
				textarea.focus();
				var sel = document.selection.createRange();
				//alert(sel.text);
				sel.text = tag1 + sel.text + tag2;
			}
   else
	{  // Code for Mozilla Firefox
		var len = textarea.value.length;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;


		var scrollTop = textarea.scrollTop;
		var scrollLeft = textarea.scrollLeft;


		var sel = textarea.value.substring(start, end);

		var rep = tag1 + sel + tag2;
		textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);

		textarea.scrollTop = scrollTop;
		textarea.scrollLeft = scrollLeft;


	}
}

function doList(tag1,tag2,obj){
textarea = document.getElementById(obj);
// Code for IE
		if (document.selection)
			{
				textarea.focus();
				var sel = document.selection.createRange();
				var list = sel.text.split('\n');

				for(i=0;i<list.length;i++)
				{
				list[i] = '[*]' + list[i];
				}
				//alert(list.join("\n"));
				sel.text = tag1 + '\n' + list.join("\n") + '\n' + tag2;
			} else
			// Code for Firefox
			{

		var len = textarea.value.length;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		var i;

		var scrollTop = textarea.scrollTop;
		var scrollLeft = textarea.scrollLeft;


		var sel = textarea.value.substring(start, end);

		var list = sel.split('\n');

		for(i=0;i<list.length;i++)
		{
		list[i] = '[*]' + list[i];
		}


		var rep = tag1 + '\n' + list.join("\n") + '\n' +tag2;
		textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);

		textarea.scrollTop = scrollTop;
		textarea.scrollLeft = scrollLeft;
 }
}

/*****************************************
* END Javascript Textarea BBCode Markup Editor
******************************************/




















function handlebbcodeInWrapper(bbcodeInWrapper, setBlock){
	/* get id to be used throughout */
	var wrapper_id = $(bbcodeInWrapper).closest('[id^="wrapEdit_"]').get(0).id.substring(9);

	/* filter through HTML under this wrapper */
	$('#wrapEdit_' + wrapper_id).find('[id^="editText_"]').each(function (index) {

		current_id = this.id.substring(9);

		/* Store original text in case cancel btn is used, we can restore original text */
		bbCodeArray[current_id] = $('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).val();

		/* Write to display div for correctly formatted viewing */
		$('#wrapEdit_' + wrapper_id).find('#showText_' + current_id).html(replaceLineBreak(bbCodeArray[current_id]));

		if ($('#wrapEdit_' + wrapper_id).find('#showText_' + current_id).hasClass('show-edit-symbol')) {
			$('#wrapEdit_' + wrapper_id).find('#showText_' + current_id).append('<span class="edit-symbol"></span>');
		}

		/* Copy original text to respective input box for editing */
		$('#wrapEdit_' + wrapper_id).find('#editText_' + current_id).val(bbCodeArray[current_id]);

	});
	//send html to be parsed for bbcode
	$(bbcodeInWrapper).html(bbCode($(bbcodeInWrapper).html()));
	if(setBlock) {
		$(this).css('display', 'block');
	}

}

var bbCodeArray = [];//used to hold original textarea values incase Cancel is hit we can restore.
/*
 ChooseDateTime jquery plugin
 Set the title and choose the date and time.
 */
(function($) {

	$.fn.chooseDateTime = function(options) {
		// Establish our default settings
		var settings = $.extend({
			text: '',
			id: 'date_picker_id',
			note: ''
		}, options);

		this.each( function() {

			var html = settings.text.length > 0 ? '<div><label class="form-field-title not-input" for=' + settings.id + '>' + settings.text + '</label>' : '<div>';
			var note = (settings.note.length > 0) ? '<span class="showTooltipHTML tooltip" title="' + settings.note + '">Tip</span>' : '';

			$(this).append( html +
				'<input type="text" name=' + settings.id +' id= '+ settings.id + ' placeholder="mm/dd/yyyy" value="" size="15" maxlength="10" autocomplete="off">' +
				' <select id="show_' + settings.id + '_h" name="show_'+ settings.id +'_h">' +
					'<option value="12">12</option>' +
					'<option value="1">1</option>' +
					'<option value="2">2</option>' +
					'<option value="3">3</option>' +
					'<option value="4">4</option>' +
					'<option value="5">5</option>' +
					'<option value="6">6</option>' +
					'<option value="7">7</option>' +
					'<option value="8">8</option>' +
					'<option value="9">9</option>' +
					'<option value="10">10</option>' +
					'<option value="11">11</option>' +
				'</select> ' +
				'<select id="show_'+ settings.id +'_m" name="show_' + settings.id + '_m">' +
					'<option value="00">00</option>' +
					'<option value="05">05</option>' +
					'<option value="10">10</option>' +
					'<option value="15">15</option>' +
					'<option value="20">20</option>' +
					'<option value="25">25</option>' +
					'<option value="30">30</option>' +
					'<option value="35">35</option>' +
					'<option value="40">40</option>' +
					'<option value="45">45</option>' +
					'<option value="50">50</option>' +
					'<option value="55">55</option>' +
				'</select> ' +
				'<select id="show_' + settings.id +'_ampm" name="show_' + settings.id + '_ampm">' +
					'<option value="am">am</option>' +
					'<option value="pm">pm</option>' +
				'</select>  ' + note +
			'</div>');
		});
	}


}(jQuery));