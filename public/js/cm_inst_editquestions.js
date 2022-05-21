/**
 * Created by Will on 29/09/2016.
 */
$("document").ready(function() {

	/* define the height for different textarea on question form */
	define_sceditor_textarea_sizes();

	/* Warn about changing question points */
	$(".warn_change_points").click(function () {
		$('#warn_change_points').html( '<div class="alert-box alert-confirmation editor editmode_warning"><p><strong>Important Note</strong></p><p>Changing an existing Questions \'Points value\' will not change existing saved points for Test results that use those Questions.</p><p>This means existing Test results that have their Questions Points value changed will lose integrity because the new Points value, will no longer match the existing saved Points value that was used when the Tests were originally graded.</p><p>Consider duplicating Questions in your Question Bank instead if they have results saved for them at present, or delete existing Test results to start again.</p></div>' );
	});

	$("input.showCorrect").click(function () {
		$("#show_selected_letters").html('<p class="titlename"><strong>Selected correct answer/s:</strong></p>').show();
		var no_selected_answers = '<span class="red">None: Select correct answer/s above.</span>';
		var selected_answers = '';
		$("#questionForm input.showCorrect:checked").each(function() {
			no_selected_answers = '';
			selected_answers += '<strong>'+letters[$(this).val()-1] + ')</strong> ';
		});
		$("#show_selected_letters").append(selected_answers+no_selected_answers);

		countChecked();
	});
	
	$("#roc_1, #roc_0").click(function () {
		/*
		 *  Manually set question type here because this should always 'override' counting how many answers are selected
		 *  To work out if a MCSA or MCMA qtype
		 */
		if ($(this).prop('id') == 'roc_1'){
			$("#qtype").val('mcma');
		} else {
			$("#qtype").val('mcsa');
		}
	});


	$("#roc_1, #roc_0").change(function(){
		if ($("#qtype").val() == 'mcma') {
            manually_changed_to_checkbox = true;
        } else {
			manually_changed_to_checkbox = false;
		}
	});

	if ($("#qtype").val() == 'mcsa' || $("#qtype").val() == 'mcma'){
		// We need to work out if to show/hide checkbox options or not
		countChecked('initialize');
	}

	/* Handle Points view on changing question type - on Add new questions page only when changing question type */
	$('#edit_mc, #edit_tf, #edit_m, #edit_ft, #edit_p, #edit_e').click(function(){
		if ($(this).attr('id') == 'edit_m' && $("#grade_multiple_points_style").val() == 1){
			/* Check if we need to display single point box or Calculate */
			$('#points').hide();
			$('#calculated_points').hide();
			$('.points_recalculate').show();
		} else  {
			$('#points').show();
			$('#calculated_points').hide();
			$('.points_recalculate').hide();
		}
	});

	/** Start Matching Question Type JS **/


	/* matching grading style radio toggle function  */
	$( "#grade_same" ).on({
		click: function() {
			$('.grading_style_advance').hide();
			$("#show_grade_style").show();
			//$("#show_point_available").show();
			//$('#points').prop('disabled', false);
			$('#points').show();
			$('input[name="grading_m"]').val(0);//important
			$('.qt_icon_perQuestion_grey').hide();
			$('.qt_icon_perQuestion_red').show();
			$('.qt_icon_perMatch_grey').show();
			$('.qt_icon_perMatch_red').hide();
			$('.qt_perQuestion_caption').addClass('qt_color_red');
			$('.qt_perMatch_caption').removeClass('qt_color_red');
			$('#set_points_box').hide();
		}, mouseenter: function() {
			$('.qt_icon_perQuestion_grey').hide();
			$('.qt_icon_perQuestion_red').show();
			$('.qt_perQuestion_caption').addClass('qt_color_red');

		}, mouseleave: function() {
			if($('.grading_style_advance').is(':hidden')) {
				$('.qt_icon_perQuestion_grey').hide();
				$('.qt_icon_perQuestion_red').show();
				$('.qt_perQuestion_caption').addClass('qt_color_red');
			}
			if($('.grading_style_advance').is(':visible')) {
				$('.qt_icon_perQuestion_grey').show();
				$('.qt_icon_perQuestion_red').hide();
				$('.qt_perQuestion_caption').removeClass('qt_color_red');
			}
		}
	});

	$( "#grade_different" ).on({
		click: function() {
			$('.grading_style_advance').show();
			$("#show_grade_style").hide();
			//$("#show_point_available").hide();
			//$('#points').prop('disabled', true);
			$('#points').hide();
			$('input[name="grading_m"]').val(1);//important
			$('.qt_icon_perMatch_grey').hide();
			$('.qt_icon_perMatch_red').show();
			$('.qt_icon_perQuestion_grey').show();
			$('.qt_icon_perQuestion_red').hide();
			$('.qt_perMatch_caption').addClass('qt_color_red');
			$('.qt_perQuestion_caption').removeClass('qt_color_red');
			$('#set_points_box').show();

		}, mouseenter: function() {
			$('.qt_icon_perMatch_grey').hide();
			$('.qt_icon_perMatch_red').show();
			$('.qt_perMatch_caption').addClass('qt_color_red');

		}, mouseleave: function() {
			if($('.grading_style_advance').is(':hidden')) {
				$('.qt_icon_perMatch_grey').show();
				$('.qt_icon_perMatch_red').hide();
				$('.qt_perMatch_caption').removeClass('qt_color_red');
			}
			if ($('.grading_style_advance').is(':visible')) {
				$('.qt_icon_perMatch_grey').hide();
				$('.qt_icon_perMatch_red').show();
				$('.qt_perMatch_caption').addClass('qt_color_red');
			}
		}
	});

	/* Trigger a click to set points buttons css classes */
	if ($("input[name='grading_m']").val() == 0){
		$('#grade_same').trigger('click');
	} else {
		$('#grade_different').trigger('click');
	}

	/* Match sure Grading Style is set correctly. */
	checkShowGradingStyle('initialize');


	/* matching type radio toggle function */
	$('[id^="editor_matching_option"]').hide();
	$('[id^="editor_matching_incorrect_option"]').hide();

	$( "#type_simple_text" ).on({
		click: function() {

			$('[id^="editor_matching_option"]').hide();
			$('[id^="editor_matching_incorrect_option"]').hide();
			$('.matching_input').show();

			$('input[name="matching_t"]').val(0);//important
			$('.qt_icon_simpletext_grey').hide();
			$('.qt_icon_simpletext_red').show();
			$('.qt_icon_multimedia_grey').show();
			$('.qt_icon_multimedia_red').hide();
			$('.qt_simpletext_caption').addClass('qt_color_red');
			$('.qt_multimedia_caption').removeClass('qt_color_red');
			// Render each simple box match box by its state array
			if (first_time == 1) {
				recreate_simple_text_dropdown();
			}
			first_time = 1;

		}, mouseenter: function() {
			$('.qt_icon_simpletext_grey').hide();
			$('.qt_icon_simpletext_red').show();
			$('.qt_simpletext_caption').addClass('qt_color_red');

		}, mouseleave: function() {
			if($('[id^="editor_matching_option"]').is(':visible')) {
				$('.qt_icon_simpletext_grey').show();
				$('.qt_icon_simpletext_red').hide();
				$('.qt_simpletext_caption').removeClass('qt_color_red');
			}
		}
	});


	$( "#type_multimedia" ).on({
		click: function() {

			$('.matching_input').hide();
			$('[id^="editor_matching_option"]').show();
			$('[id^="editor_matching_incorrect_option"]').show();
			$('input[name="matching_t"]').val(1);//important
			$('.qt_icon_multimedia_grey').hide();
			$('.qt_icon_multimedia_red').show();
			$('.qt_icon_simpletext_grey').show();
			$('.qt_icon_simpletext_red').hide();
			$('.qt_multimedia_caption').addClass('qt_color_red');
			$('.qt_simpletext_caption').removeClass('qt_color_red');
			$("[id^=matching_input]").hide();

			// Render each multimedia box by its state array
			if (first_time == 1) {
				recreate_multimedia_dropdown();
			}
			first_time = 1;

		}, mouseenter: function() {
			$('.qt_icon_multimedia_grey').hide();
			$('.qt_icon_multimedia_red').show();
			$('.qt_multimedia_caption').addClass('qt_color_red');

		}, mouseleave: function() {
			if($('[id^="editor_matching_option"]').is(':hidden')) {
				$('.qt_icon_multimedia_grey').show();
				$('.qt_icon_multimedia_red').hide();
				$('.qt_multimedia_caption').removeClass('qt_color_red');
			}
			if($('[id^="editor_matching_option"]').is(':visible')) {
				$('.qt_icon_multimedia_grey').hide();
				$('.qt_icon_multimedia_red').show();
				$('.qt_multimedia_caption').addClass('qt_color_red');
			}
		}
	});

	//$("#" + $("input[name='matching_t']:checked").attr('id') ).trigger('click');
	set_matching_type();

	$(document).on('change', "[id^=matching_dropdown_]", function() {

		var row_id = parseInt($(this).attr('id').split('_')[2]);
		beforeSerializeGenericAllForms();

		if ($(this).val() == "blank") { // Type new match
			if($('[name="matching_t"]').val() == "0") {
				state_simple_text_box[row_id] = "blank";
			} else {
				state_multimedia_box[row_id] = "blank";
			}
		} else { // Choose existing match

			var reference_string = '';
			for(var i = row_id + 1; i < 21; i++) {
				if ($("#matching_dropdown_" + i).length > 0) {
					var selected_value = $("#matching_dropdown_" + i).val();
					if ((selected_value != "blank") && (row_id == parseInt(selected_value.split('_')[2]))) {
						if (reference_string.length) {
							reference_string += ', ';
						}
						reference_string += String.fromCharCode(64 + i);
					}
				}
			}
			if (reference_string.length) {
				alert("You cannot reference this Match to another Match at present, because you are referencing this Match from Match "+ reference_string +".");
				$("#matching_dropdown_" + row_id).val("blank");
				return false;
			}
			if ($('[name="matching_t"]').val() == 0) {
				state_simple_text_box[row_id] = $(this).val();
			} else {
				state_multimedia_box[row_id] = $(this).val();
			}
		}
		recreate_dropdown();
	});

	/* show the existed answer option */
	$('[id^="active"]').each(function () {
		var row_id = $(this).attr('id').split('_')[1];
		var selected_id = $(this).attr('id').split('_')[2];
		var id = '"' + 'matching_row_' + selected_id + '"';
		$('.matching_dropdown_' + row_id + ' option[value=' + id + ']').prop('selected', true);
	});

	/* add more matching rows JS effect */

	if (get_existed_matching_rows() == 20) {
		$('#tog_extra_matching').hide();
	}
	
	//Ozum elerem
	// $(document).on('click','#add_more_matching', function(e){
	// 	e.preventDefault();

	// 	$('#loading').show();
	// 	$('#add_more_matching').hide();

	// 	setTimeout(function(){
	// 		var current = $(window).scrollTop();

	// 		if (load_rest_matching_rows()) {
	// 			$('#tog_extra_matching').hide();
	// 		} else {
	// 			$('#loading').hide();
	// 			$('#add_more_matching').show();
	// 		}

	// 		$(window).scrollTop(current);
	// 	}, 10);
	// });

	/** END Matching Question Type JS **/

	$(".preview_question_link").click(function (e) {

		e.preventDefault();
		IEHack_ShowBbcodeBeforeSubmit();

		/* Important - first put text as BBCode back into textareas for checking below before submission */
		beforeSerializeGenericAllForms();
		IEHack_HideBbcodeagain();

		//$('.editQuestionDiv').hide();
		$('#div_preview').removeClass('hide')
		$('.e_formdiv').hide();
		$('.mc_formdiv').hide();
		$('.tf_formdiv').hide();
		$('.ft_formdiv').hide();
		$('.m_formdiv').hide();
		$('.question_type_selector_links').hide();

		/* Questions */
		var preview_html = '<div class="qsholder ">';

		/* question */
		if (active_question_form != 'p' && $('#question').length && $.trim($('#question').val()).length){
			preview_html += bbCode( replaceLineBreak($('#question').val()) );
		}
		/* P question */
		if (active_question_form == 'p' && $('#questionp').length && $.trim($('#questionp').val()).length){
			preview_html += '<h5>Text to be corrected by user</h5><p>' + $('#questionp').val() + '</p>';
		}

		/* Answers */

		/* MC Answers */
		preview_html += '</div><div class="clearheight"></div><div class="dotted"></div>';
		preview_html += '<table class="answholderpreview" cellpadding="0" cellspacing="0">' +
			'<tr class="qs">' +
			'<td><img src="'+webpath_img+'i.gif" width="20" height="1" alt="" /></td>' +
			'<td><img src="'+webpath_img+'i.gif" width="20" height="1" alt="" /></td>' +
			'<td><img src="'+webpath_img+'i.gif" width="30" height="1" alt=""  /></td>' +
			'</tr>';

		switch(active_question_form) {
			case 'mc':
				/* MC - Loop through existing ans fields on the page */
				preview_html += mc_question_preview();
				break;
			case 'tf':
				/* TF - Loop through existing ans fields on the page */
				preview_html += truefalse_question_preview();
				break;
			case 'ft':
				/* FT - Loop through existing ans fields on the page */
				preview_html += freetext_question_preview();
				break;
			case 'p':
				/* P */
				preview_html += p_question_preview();
				break;
			case 'm':
				/* M */
				preview_html += m_question_preview();
				break;
		}

		if (typeof isMSIE8 !== 'undefined'){
			$('#form_div').addClass('move_off_screen');
		} else {
			$('#form_div').hide();
		}

		$('.preview_question_link').hide();
		$('.cancel_link').hide();
		$('.edit_question_link').show();
		$("#div_preview").html(preview_html);

		$("#div_preview").show();
		$('html,body').animate({scrollTop: $('#div_preview').offset().top-20},'slow');

		var noOfImages = $('img.imgw').length;

		// For each dropdown,  if we are using existing match, count the images within class matching_answer_existing_*
		if (active_question_form == 'm') {
			var occurrence = 0;
			for (var i = 2; i < 21; i++) {
				if ($(".matching_answer_existing_" + i).length > 0) {
					var existing_option = trim($(".matching_answer_existing_" + i).html());
					if (existing_option) {
						occurrence += (existing_option.match(/class="imgw"/g) || []).length; // occurrence of images
					}
				}
			}
			noOfImages -= occurrence;
		}

		load_images(noOfImages);
	});


	$(".edit_question_link").click(function(){

		// $('#form_div_'+active_question_form).show();
		$("#div_preview").hide();
		$('.question_type_selector_links').show();
		$('.cancel_link').show();
		$('.preview_question_link').show();
		$('.edit_question_link').hide();

		recreate_dropdown();
		showDiv();

	});

    $("#set_all_points").click(function(e) {

		var p_score = $('#positive_score').val();
		var n_score = $('#negative_score').val();

		if ((!(Number(p_score) > 0)) || isNaN(p_score)) {
			alert('Positive score is not correct'  + '.\n\n' + 'Hint: positive score should be the number and larger than 0.');
			return false;
		}

		if (isNaN(n_score)) {
			alert('Negative score is not correct'  + '.\n\n' + 'Hint: negative score should be the number.');
			return false;
		}

		$('[id^="p_score_"]').each(function(){

			$(this).val(p_score);
		});

		$('[id^="n_score_"]').each(function(){

			$(this).val(Math.abs(n_score));
		});
		$('#negative_score').val(Math.abs(n_score));

		set_all_points = true;
		positive_score = p_score;
		negative_score = n_score;
		$("#calculated_points").hide();
		trigger_recalculate_points();
		return false;
	});

	$("#save_question").click(function (e) {

		e.preventDefault();

		IEHack_ShowBbcodeBeforeSubmit();


		/* Important - first put text as BBCode back into textareas for checking below before submission */
		beforeSerializeGenericAllForms();

		if ($("#qtype").val() != 'p' && $('#question').length && $.trim($('#question').val()).length == 0 ){
			alert('You have not entered a question.');
			IEHack_HideBbcodeagain();
			return false;
		}

		/* MC, TF, FT */
		var validation_result = true;
		switch ($("#qtype").val()) {
			case 'mcsa':
			case 'mcma':
				validation_result = multichoice_question_validation_before_save();
				break;
			case 'tf':
				validation_result = truefalse_question_validation_before_save();
				break;
			case 'ft':
				validation_result = freetext_question_validation_before_save();
				break;
			case 'p':
				validation_result = p_question_validation_before_save();
				break;
			case 'm':
				validation_result = matching_question_validation_before_save();
				break;
		}

		if(!validation_result) {
			return false;
		}

		if ( $('#points').val() == '' || isNaN ( $('#points').val() ) ){
			IEHack_HideBbcodeagain();
			alert('You must use numbers for the points available.');
			return false;

		} else if ( $('#points').val() > 999.99 ){
			IEHack_HideBbcodeagain();
			alert('Points must be between 0 and 1000.');
			return false;

		}

		$(this).after(' <img src="'+webpath_img+'icon_loading_circleV3.gif" class="loadingGif"/>');

		$("#save_question").hide();
		$("#save_question").delay(12000).show('normal');
		$(".loadingGif").delay(12000).hide('normal');
		$('#save_question').text('Try again');

		$('#questionForm').submit();
	});

	$("#edit_mc").click(function() {
		$("#show_point_available").show();
		countChecked();
	});

	$("#edit_m").click(function() {
		if ($("#grade_multiple_points_style").val() == 0){
			$("#show_grade_style").show();
		} else {
			$("#show_grade_style").hide();
		}
		if (typeof selenium != "undefined" && selenium == 1) {
			var ids = ["question", "matching_query_1", "matching_query_2", "matching_query_3", "matching_query_4"];
			for (var i = 0; i < ids.length; i++) {
				addSeleniumId(ids[i]);
			}
		}
	});

	$('.confirm-cancel').click(function(){
		if (confirm('Confirm Cancel\n\nYou are about to lose any edits made on this page.')){
			return true;
		} else {
			disabledGenericSubmitLink = false;
			return false;
		}
	});

	$('#duplicate-feedback').click(function(e){
		e.preventDefault();
		/* Duplicate feedback form correct to incorrect box & resize both boxes to match content */
		if ( $.trim($("#correct_feedback").sceditor('instance').val()).length ) {
			var correct_feedback_dimensions = $('#correct_feedback').sceditor('instance').dimensions();
			$('#correct_feedback').sceditor('instance').dimensions(correct_feedback_dimensions.width, 84);//set min editor height then resize
			$('#wrong_feedback').sceditor('instance').dimensions(correct_feedback_dimensions.width, 84);
			$("#wrong_feedback").sceditor('instance').val( $("#correct_feedback").sceditor('instance').val() );
			$('#correct_feedback').sceditor('instance').expandToContent();
			$('#wrong_feedback').sceditor('instance').expandToContent();

		}

	});




	//need override var
	// $("input.showCorrect").click(countChecked);

	/* show recalculate points button */
	trigger_recalculate_points();

	/* recalculate the points for per match grading style*/
	recalculate_points();

	initialize_state();
});

/**
 * Shuffle array
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

var letters = Array('A','B','C','D','E','F','G','H','I','J');
var corrects = [];
function m_question_preview() {

	var preview_html = '';
	//get queries
	var queries = [];

	//clues
	var total_point = 0;
	var problem_scores = [];
	$('[id^="matching_query"]').each(function() {
		var row_id = this.id.split('_')[2];
		if ($.trim($(this).val()) != '') {
			queries.push($(this).val());

			if ( $('#p_score_' + row_id).val() == '' || isNaN ( $('#p_score_' + row_id).val() ) ) {
				problem_scores.push(row_id);
			} else {
				total_point += Number($('#p_score_' + row_id).val());
			}
		}
	});

	if (problem_scores.length > 0) {
		IEHack_HideBbcodeagain();
		alert('Positive score is not correct for matching row ' + problem_scores.join(',') + '.\n\n' + 'Hint: positive score should be the number and larger than 0.');
		return false;
	}

	//calculate the points
	if ($('input[name="grading_m"]').val() == 1) {
		$("#points").val(total_point);
		//$("#points").val($('#calculated_points').html());
	}

	//simple text answers
	var simple_answers = [];
	$('[id^="matching_input"]').each(function() {
		var row_id = this.id.split('_')[2];

		var current_value = $.trim($(this).val());

		if (Number(row_id) > 1) {
			var tab_id = $('select[name=matching_dropdown_'+ row_id + ']').val();

			if (tab_id == 'blank') { // typed answer

				if (current_value != '') {
					simple_answers.push($(this).val());
					corrects[row_id] = $(this).val();
				}

			} else { // existing answer from drop down list

				var existed_val = $('#matching_input_' + tab_id.split('_')[2]).val();
				if (existed_val != '') {
					corrects[row_id] = existed_val;
				}

			}

		} else {
			if (current_value != '') {
				simple_answers.push($(this).val());
				corrects[row_id] = $(this).val();
			}
		}
	});

	//multimedia answers
	var multimedia_answers = [];
	$('[id^="matching_option"]').each(function() {
		var row_id = this.id.split('_')[2];
		var current_value = $.trim($(this).val());

		if (Number(row_id) > 1) {

			var tab_id = $('select[name=matching_dropdown_'+ row_id + ']').val();

			if (tab_id == 'blank') { // typed answer
				if (current_value != '') {
					multimedia_answers.push($(this).val());
					corrects[row_id] = $(this).val();
				}
			} else {  // existing answer
				var existed_val = $('#matching_option_' + tab_id.split('_')[2]).val();
				if (existed_val != '') {
					corrects[row_id] = existed_val;
				}
			}

		} else {
			if (current_value != '') {
				multimedia_answers.push($(this).val());
				corrects[row_id] = $(this).val();
			}
		}
	});

	var matching_incorrect_answer = ($('input[name="matching_t"]').val() == 0) ? '#matching_incorrect_input_' : '#matching_incorrect_option_';

	//extra dummy answer
	$('[id^="matching_dummy"]').each(function() {
		var id = $(this).attr('id').split('_')[2];
		$(this).val($(matching_incorrect_answer + id).val());
		var current_value = $.trim($(this).val());
		if (current_value != '') {
			simple_answers.push($(this).val());
			multimedia_answers.push($(this).val());
		}
	});

	var match_type = $('input[name="matching_t"]').val();
	// shuffle mode
	var shuffle_mode = $("input[name=shuffle_m]:checked").val();
	switch (shuffle_mode) {
		case "0": // shuffle match
			if (match_type == 0) {
				simple_answers = shuffle(simple_answers);
			} else if (match_type == 1) {
				multimedia_answers = shuffle(multimedia_answers);
			}
			break;
		case "1": // shuffle clue
			queries = shuffle(queries);
			break;
		case "2": // shuffle match and clue
			queries = shuffle(queries);
			if (match_type == 0) {
				simple_answers = shuffle(simple_answers);
			} else if (match_type == 1) {
				multimedia_answers = shuffle(multimedia_answers);
			}
			break;
		default:
			break;
	}
	//simple answer selection dropdown box
	var simple_answer_selection = '<select><option value="0">Choose</option>';
	$.each(simple_answers, function(i, val) {
		simple_answer_selection += '<option value="' + (i + 1) + '">' + val + '</option>';
	});
	simple_answer_selection += '</select>';

	//multimedia answer selection dropdown box
	var multimedia_answer_selection = '<div class="m_button"><button type="button" class="btn btn-white" data-state="Choose" id="preview_clue_1">Choose</button></div>';
	/*
	 var multimedia_answer_selection = '<select name="multimedia_answer_preview"><option value="0">Choose</option>';
	 $.each(multimedia_answers, function(i) {
	 multimedia_answer_selection += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
	 });
	 multimedia_answer_selection += '</select>';
	 */

	//get max matching rows
	var count_of_queries = queries.length;
	var count_of_multimedia_answers = multimedia_answers.length;

	preview_html += '<tr class="qs"><td colspan="3">';

	if ($('input[name="matching_t"]').val() == 0) { // Simple Text
		preview_html += '<table class="mqsholder border mqsholder_table">';
		//generate matching row
		$.each(queries, function(i, val) {
			var query = bbCode(replaceLineBreak(val));
			preview_html += '<tr><td class="bbcode m_cell matching-imgw">' + query +'</td>' +
				'<td class="d_selection m_cell">' + simple_answer_selection + '</td></tr>';
		});
		preview_html += '</table>';
	} else { // Multimedia
		preview_html += '<input type="hidden" id="text" value="Edit"/>' +
						'<div class="manswersDiv editor"><div id="mqsholder_000">' +
						'<table class="mqsholder m_column_left">';

		//generate matching row
		for (var row = 0; row < count_of_queries; row++) {
			preview_html += '<tr class="m_margin">';

			//get queries
			if(queries[row]) {
				preview_html += '<td id="red_bar_000_' + row + '"></td>' +
								'<td id="jms_000_' + row + '">' +
								'<div id="m_title_clue_000' + row + '">' +
								'<div class="m_query_1 bbcode matching-imgw" data-question-type="matching">' + bbCode(replaceLineBreak(queries[row])) + '</div>' +
								'</div></td>';
			}
			preview_html += '<td class="bbcode m_answer_background matching-imgw" id="m_answer_000_'+ row +'">' +
							'<button type="button" class="btn btn-white" id="select_000_'+ row +'">Choose Answer</button>' +
							'</td></tr>';
		}
		preview_html += '</table>';

		preview_html += '<div id="m_column_right_000">' +
						'<div class="add_padding">';
		for (var row = 0; row < count_of_multimedia_answers; row++) {

			preview_html += '<div id="right_content_' + row +' class="m_content">'+
							'<div class="m_cell bbcode matching-imgw" data-question-type="matching">' + bbCode(replaceLineBreak(multimedia_answers[row])) + '</div><div class="m_cell">' +
							'<h4 class="m_h4"><button type="button" data-value="' + row + '" class="btn btn-white" id="match_000_'+ row + '">Select</button></h4>' +
							'</div></div>';
			if(row != (count_of_multimedia_answers - 1)) {
				preview_html += '<hr class="matching_hr">';
			}
		}
		preview_html += '</div></div></div>';

	}
	preview_html += '</td></tr>' +
					'<tr class="qs"><td colspan="3">&nbsp;</td></tr>';

	/*
	 preview_html += '<tr class="qs"><td colspan="3">';
	 $.each(corrects, function(i, val) {
	 if (i>0) {
	 preview_html += '<div><span class="m_empty">' + gif + '</span>&nbsp;&nbsp;' + val + '</div>';
	 }
	 });
	 preview_html += '</td></tr>';
	 */



	preview_html += '</table><div class="clearheight"></div>';

	if ( ($("#correct_feedback").length && $.trim($("#correct_feedback").val()).length) || ($("#wrong_feedback").length && $.trim($("#wrong_feedback").val()).length)){

		preview_html += '<div class="dotted"></div>';
		if ($("#correct_feedback").length && $.trim($("#correct_feedback").val()).length){
			preview_html += '<div class="previewfeedback"><p class="green"><strong>Correct Feedback</strong></p>' + bbCode( replaceLineBreak($("#correct_feedback").val()) ) + '</div>';
		}
		if ($("#wrong_feedback").length && $.trim($("#wrong_feedback").val()).length){
			preview_html += '<div class="previewfeedback"><p class="red"><strong>Incorrect Feedback</strong></p>' + bbCode( replaceLineBreak($("#wrong_feedback").val()) ) + '</div>';
		}
	}


	/* Category */
	preview_html += '<div class="clearheight"></div><div class="alert-box alert-confirmation editor"><strong>Category:</strong> ' + $("#cat_id option:selected").text();
	preview_html += '<div class="clearheight"></div><strong>Points:</strong> ' + $("#points").val() + '<div class="clearheight"></div>';

	return preview_html;
}

/** preview question for different question type **/
function p_question_preview() {

	var preview_html = '';
	if ($('#pans').length && $.trim($('#pans').val()).length){
		preview_html += '<tr class="qs"><td></td><td class="answer" colspan="2"><h5>Correct version for checking users answer against</h5></td></tr>';
		preview_html += '<tr class="qs"><td class="correct_img"><img src="'+webpath_img+'correctv3@3x.png" width="15" height="16" alt="Correct"></td><td class="answer" colspan="2">' + $('#pans').val() + '</td></tr>';
	}
	return preview_html;
}

function freetext_question_preview() {

	var preview_html = '';
	if ( $('#ftans1').length ){
		preview_html += '<tr class="qs"><td></td><td class="number"></td><td class="answer"><h5>Accepted answers</h5></td></tr>';
	}
	$('[id^="ftans"]').each(function(index) {
		num = this.id.substring(5);
		if ( $.trim($(this).val()).length ){
			preview_html += '<tr class="qs"><td class="correct_img"><img src="'+webpath_img+'correctv3@3x.png" width="15" height="16" alt="Correct"></td><td class="number"></td><td class="answer">' + $(this).val() + '</td></tr>';
		}
	});
	return preview_html;
}

function truefalse_question_preview() {

	var preview_html = '';
	var num = 1;
	var label_counter = 0;
	$("input[type=radio][name=correct]").each(function() {

		label_counter++;

		/* See if radio button is checked */
		if ($(this).is(':checked')){
			var gif = '<img src="'+webpath_img+'correctv3@3x.png" width="15" height="16" alt="Correct">';
		} else {
			var gif = '';
		}
		preview_html += '<tr class="qs"><td class="correct_img">'+gif+'</td><td class="number"><input type="radio" id="dqewd_'+label_counter+'" name="hrfiywberf__ignore"/></td><td class="answer"><label for="dqewd_'+label_counter+'">' + $('#tfans'+num).val() + '</label></td></tr>';

		num++;
	});

	preview_html += '<strong>Randomize answers:</strong> ';
	if ($('#ra_1').is(':checked')){
		preview_html += 'No';
	} else {
		preview_html += 'Yes';
	}
	preview_html += '</div><div class="alert-box alert-default editor"><strong>Tip:</strong> You can preview taking your Tests at any time from your Edit Test pages.</div><div class="clearheight"></div>'

	return preview_html;
}

function mc_question_preview() {

	var preview_html = '';
	var label_counter = 0;
	$('[id^="ans"]').each(function() {
		label_counter++;
		if ($("#qtype").val() == 'mcsa'){
			var input_selector = '<input id="dqewd_'+label_counter+'" type="radio" name="hrfiywberf__ignore"/>';
		} else {
			var input_selector = '<input id="dqewd_'+label_counter+'" type="checkbox"/>';
		}
		var prefix_letter = '';
		var prefix_extra_width_class = '';
		var num = this.id.substring(3);
		if (!$("#ra_2").is(':checked')){
			//random - hide A)B)C)
			prefix_letter = ' ' +letters[num-1]+')';
			prefix_extra_width_class = 'preview';
		}
		if ($.trim($(this).val()).length){

			/* See if checkbox is checked */
			var gif = '';
			if ($("input[type=checkbox][id=a"+num+"]").is(':checked')){
				gif = '<img src="'+webpath_img+'correctv3_3x.png" width="15" height="16" alt="Correct">';
			}

			preview_html += '<tr class="qs"><td class="correct_img">'+gif+'</td><td class="number'+prefix_extra_width_class+'">'+input_selector+prefix_letter+'</td><td class="answerpreview"><label for="dqewd_'+label_counter+'">' + bbCode( replaceLineBreak($(this).val()) ) + '</label></td></tr>';
		}
	});

	preview_html += '<strong>Randomize answers:</strong> ';
	preview_html += $('#ra_1').is(':checked') ? 'No' : 'Yes';
	preview_html += '</div><div class="alert-box alert-default editor"><strong>Tip:</strong> You can preview taking your Tests at any time from your Edit Test pages.</div><div class="clearheight"></div>'

	return preview_html;
}
/** END preview question for different question type **/

/** validate question for different question type before saving them **/

var set_all_points = false;
var positive_score = 1;
var negative_score = 0;

var manually_changed_to_checkbox = false;

function p_question_validation_before_save() {

	/* Ans 1 must have values */
	if ( $.trim( $('#questionp').val() ).length == 0){
		IEHack_HideBbcodeagain();
		alert('You must fill in the incorrect version of your sentence.');
		return false;
	}
	if ( $.trim( $('#pans').val() ).length == 0){
		IEHack_HideBbcodeagain();
		alert('You must fill in the correct version of your sentence.');
		return false;
	}

	return true;
}

function multichoice_question_validation_before_save() {

	/* No answers selected as correct */
	if ( $("#questionForm input.showCorrect:checked").length == 0 ){
		IEHack_HideBbcodeagain();
		if($('.edit_question_link:visible').length == 1) {
			/* Switch back to edi view */
			$(".edit_question_link").trigger("click");
		}
		alert('You must select the correct answer.');
		return false;
	}

	/* Do we have a checkbox selected as correct that does not have a correct answer */
	fail = false;
	$("#questionForm input.showCorrect:checked").each(function(index) {
		if ( $.trim( $('#ans'+ $(this).val() ).val() ).length == 0 ){
			fail = letters[$(this).val()-1];
			return false;//jump out of this .each() loop on first find - and continue to alert below
		}
	});
	if (fail != false){
		IEHack_HideBbcodeagain();
		alert('You have selected ' + fail + ') as a correct answer, however, you have not added an answer for it.');
		return false;
	}

	/* Ans 1 and 2 must have values */
	if ( $.trim( $('#ans1').val() ).length == 0 || $.trim( $('#ans2').val() ).length == 0 ){
		IEHack_HideBbcodeagain();
		alert('You must fill in the first two answer boxes.');
		return false;
	}

	/* If a answer is blank yet one after has value give a missing answer error */
	var prev_answer_blank = false;
	var fail = false;
	$('[id^="ans"]').each(function(index) {
		if ( $.trim( $(this).val() ).length > 0 && prev_answer_blank == true){
			fail= letters[index];
			return false;
		}
		if ( $.trim( $(this).val() ).length == 0){
			prev_answer_blank = true;
		}
	});
	if (fail != false){
		IEHack_HideBbcodeagain();
		alert('You have an answer missing before your answer ' + fail + '). Answers must be entered directly after each other.');
		return false;
	}

	return true;
}

function freetext_question_validation_before_save() {

	/* Ans 1 must have values */
	if ( $.trim( $('#ftans1').val() ).length == 0  ){
		IEHack_HideBbcodeagain();
		alert('You must fill in at least the first answer box.');
		return false;
	}


	/* If a answer is blank yet one after has value give a missing answer error */
	var prev_answer_blank = false;
	var fail = false;
	$('[id^="ftans"]').each(function(index) {
		if ( $.trim( $(this).val() ).length > 0 && prev_answer_blank == true){
			fail = true;
			IEHack_HideBbcodeagain();
			return false;
		}
		if ($.trim( $(this).val() ).length == 0){
			prev_answer_blank = true;
		}
	});
	if (fail != false){
		IEHack_HideBbcodeagain();
		alert('You have an answer missing before your last entered answer. Answers must be entered directly after each other.');
		return false;
	}

	return true;
}

function truefalse_question_validation_before_save() {

	/* Ans 1 and 2 must have values */
	if ( $.trim( $('#tfans1').val() ).length == 0 || $.trim( $('#tfans2').val() ).length == 0 ){
		IEHack_HideBbcodeagain();
		alert('You must fill in both answer boxes.');
		return false;
	}
	if ( $("input[name=question\\[tf_correct\\]]").val() != 1 && $("input[name=question\\[tf_correct\\]]").val() != 2){
		IEHack_HideBbcodeagain();
		alert('You must select an answer.');
		return false;
	}

	return true;
}


function matching_question_validation_before_save() {

	var problem_id = [];
	var problem_position_id = [];
	var problem_negative_id = [];
	var total_rows = 0;
	var dummy_answer_empty = true;
	var target_empty_matching_row = '';
	var missed_matching_row = false;
	var missed_matching_row_letter='';


	if ($('input[name="matching_t"]').val() == 0) {
		var matching_typed_answer = '#matching_input_';
		var matching_incorrect_answer = '#matching_incorrect_input_';
	} else {
		var matching_typed_answer = '#matching_option_';
		var matching_incorrect_answer = '#matching_incorrect_option_';
	}

	//matching question
	var question = $('#question').val();

	//matching clue and answers
	var answers = [];

	var point_to_empty_match = [];

	$('[id^="matching_query"]').each(function(){

		$(this).val($.trim($(this).val()));

		var existed_answer_empty = true;
		var text_answer = 2;
		var id = $(this).attr('id').split('_')[2];

		var p_score = $('#p_score_' + id).val();
		var n_score = $('#n_score_' + id).val();

		if(!(Number(p_score) > 0)) {
			problem_position_id.push(id);
		}

		if((n_score === '') || isNaN(n_score)) {
			problem_negative_id.push(id);
		}

		//get the matching answer result
		var answer_result;
		if (Number(id) > 1) { //matching row 2 - 10
//id>name >>>>
			var tab_id = $('select[id=matching_dropdown_'+ id + ']').val();
			if (tab_id == "blank") { // typed answer

				if ($.trim($(matching_typed_answer + id).val()) != '') {
					answer_result = $.trim($(matching_typed_answer + id).val());
					answers.push(answer_result);
				}

			} else  { // drop down answer
				text_answer = 1;
				answer_result = Number(tab_id.split('_')[2]);
				existed_answer_empty = false;
			}

		} else { // matching row 1

			if ($.trim($(matching_typed_answer + id).val()) != '') {
				answer_result = $.trim($(matching_typed_answer + id).val());
				answers.push(answer_result);
			}

		}

		$('#tab_' + id).val(text_answer); //matching answer type (text or existed index)

		var matching_result = '#matching_result_';
		$(matching_result + id).val(answer_result); //matching result (right side)

		//check whether previous existed answer's matching row is empty or not
		if (!existed_answer_empty) {
			if ($.trim($("#matching_result_" + answer_result).val()).length == 0 && $.trim($("#matching_query_" + answer_result).val()).length == 0) {
				point_to_empty_match.push({p:answer_result, c:id});
			}
		}

		//check whether clue (left side) and answer (right side) are both filled
		if ((Number(id) == 1) || (tab_id == 'blank')) {
			var match = ($.trim($(matching_typed_answer+id).val()).length == 0); // first answer OR <ust type text on "match" side
		} else if (tab_id != 'blank') {
			var match = existed_answer_empty;
		}
		if (($.trim($(this).val()).length == 0) ? !match : match) {
			problem_id.push(String.fromCharCode(64 + parseInt(id)));
		} else if ($.trim($(this).val()) != '' && !match) {
			total_rows++;
		}
	});

	//matching incorrect answers
	$('[id^="matching_dummy"]').each(function() {
		var id = $(this).attr('id').split('_')[2];

		$(this).val($(matching_incorrect_answer + id).val());
		//var dummy_answer = $(matching_incorrect_answer + id).val();
		if ($.trim($(this).val()).length != 0) {
			answers.push($.trim($(this).val()));
			dummy_answer_empty = false;
		}
	});


    /**
     * Check if this matching row is empty
     * @param id
     * @returns {boolean}
     */
	function check_row_empty(id) {

		// if this element does not exist, assume it is empty.
        if($(matching_typed_answer + id).length == 0) {
        	return true;
		}

        // Check match first
        var match = true;
        // check first match
        if ((id == 1) && ($.trim($(matching_typed_answer + id).val()).length == 0)) {
            match = false;  // match row is empty
        }
		// check other match except first one
		//id> name>>>>>>>
        if ((id != 1) &&
			($('select[id=matching_dropdown_'+ id + ']').val() === 'blank') &&
			($.trim($(matching_typed_answer + id).val()).length == 0)) {
            match = false; // match row is empty
        }

        // if both match and clue row are empty, return true
        if ((match == false) && ($.trim($("#matching_query_" + id).val()).length == 0)) {
            return true;
        } else {
            return false;
        }
	}

    /**
	 * Check missing row
     */
	$('[id^="matching_query"]').each(function(i) {
		var id = i + 1;

		if (check_row_empty(id)) {
            target_empty_matching_row = id;
        }

        // if current row is empty, check if next row is empty or not
        if (target_empty_matching_row !== '') {
            if (!check_row_empty(id + 1)) {
                missed_matching_row = true;
                missed_matching_row_letter = letters[target_empty_matching_row]
			}
        }
	});

	if (point_to_empty_match.length > 0) {
		for (var i=0;i<point_to_empty_match.length;i++){
			IEHack_HideBbcodeagain();
			alert('You must fill the Clue and Match on matching row ' + point_to_empty_match[i].p + ' or deselect the existed Match on matching row ' + point_to_empty_match[i].c + '.');
			return false;
		}
	}

	/* matching rows cannot be missed */
	if (missed_matching_row) {
		IEHack_HideBbcodeagain();
        alert('You have a matching row missing before your matching row ' + missed_matching_row_letter + '). Matching rows must be entered directly after each other.');
		return false;
	}

	/* question need to be filled */
	if ($.trim(question).length == 0) {
		IEHack_HideBbcodeagain();
		alert('You must fill the question.');
		return false;
	}

	/* both query and answer need to be filled */
	if (problem_id.length > 0) {
		IEHack_HideBbcodeagain();
		alert('You must fill both Clue and Match on matching row ' + problem_id.join(',') + '.');
		return false;
	}

	/* at least two rows or one rows and more than one dummy answer filled before save */
	if (Number(total_rows) == 0 || (Number(total_rows) < 2 && dummy_answer_empty)) {
		IEHack_HideBbcodeagain();
		alert('You must fill at least two Clues and two Matches or one Clue and one Match plus more than one incorrect Matches');
		return false;
	}

	/* matching question must has at least two different answers */
	if (answers.length < 2) {
		IEHack_HideBbcodeagain();
		alert('You must add at least two Clues and Matches');
		return false;
	}

	/* answers cannot be duplicated. in this case, warning users to select existing answers options, this is alternative way to check duplicated answers. */
	var size_of_before_unique_answers = answers.length;
	var unique_answers = $.unique(answers);
	var size_of_after_unique_answers = unique_answers.length;

	if (size_of_before_unique_answers != size_of_after_unique_answers) {
		IEHack_HideBbcodeagain();
		alert('You should not enter duplicated Matches, instead of doing that, try to empty the Match box and select the Match from existing match dropdown box');
		return false;
	}

	if (problem_position_id.length > 0 && problem_negative_id.length == 0) {
		IEHack_HideBbcodeagain();
		alert('Positive score is not correct for matching row ' + problem_position_id.join(',') + '.\n\n' + 'Hint: Positive points should be a number 0 or larger.');
		return false;
	}

	if (problem_position_id.length == 0 && problem_negative_id.length > 0) {
		IEHack_HideBbcodeagain();
		alert('Negative score is not correct for matching row ' + problem_negative_id.join(',') + '.\n\n' + 'Hint: Negative points should be a number 0 or larger.');
		return false;
	}

	if (problem_position_id.length > 0 && problem_negative_id.length > 0) {
		IEHack_HideBbcodeagain();
		alert('Positive score is not correct for matching row ' + problem_position_id.join(',') + ' and negative score is not correct for matching row ' + problem_negative_id.join(',') + '.\n\n' + 'Hint: Positive points should be a number 0 or larger and negative points should be a number 0 or larger.');
		return false;
	}

	return true;
	//uncomment it for form validation test
	//return false;
}
/** END validate question for different question type before saving them **/

/**
 * For questions with multipl points option, we need to add up positive points to show what question can be worth
 */
function recalculate_points() {

	$('.points_recalculate').click(function(e) {

		e.preventDefault();
		IEHack_ShowBbcodeBeforeSubmit();
		/* Important - first put text as BBCode back into textareas for checking below before submission */
		beforeSerializeGenericAllForms();

		var point_available = 0;

		if ($('input[name="matching_t"]').val() == 0) {
			var matching_typed_answer = '#matching_input_';//we are looking at single text inputs
		} else {
			var matching_typed_answer = '#matching_option_';//we are looking at multimedia textareas
		}

		$('[id^="p_score"]').each(function(){
			var id = $(this).attr('id').split('_')[2];

			/* Need to check how many matches we have to add point with
			 * We only check if left Clues have content and add those points, system will bark on save if mates are not filled in
			 */
			var tab_id = $('input[name=grading_m]').val();

			if (tab_id == 0) { // answer tab left
				if (($.trim($('#matching_query_'+id).val()).length != 0) ) {
					point_available += Number($('#p_score_' + id).val());
				}
			} else if (tab_id == 1) { //answer tab right
				var selected_answer = $('#matching_dropdown_'+id).find('option:selected').attr('value');
				if (($.trim($('#matching_query_'+id).val()).length != 0) ) {
					point_available += Number($('#p_score_' + id).val());
				}
			}
		});

		if ((point_available <= 0) || isNaN(point_available)) {
			point_available = 0;
		}

		$('#calculated_points').show();
		$('#calculated_points').html(point_available);
		$(this).hide();
	});

}

function trigger_recalculate_points() {

	if ($('input[name="grading_m"]').val() == 1) {
		$('.points_recalculate').show();
	}

	$('[id^="matching_input"], [id^="p_score"], [id^="existed_answer"], #grade_different, #grade_same, #type_multimedia, #type_simple_text').on('click change', function() {
		$('#calculated_points').hide();
		if (this.id == 'grade_different') {
			$('.points_recalculate').show();
		} else if (this.id == 'grade_same') {
			$('.points_recalculate').hide();
		} else if ($('input[name="grading_m"]').val() == 1) {
			$('.points_recalculate').show();
		}
	});

	$('[id^="matching_query"], [id^="matching_option"]').each(function () {
		if ($(this).sceditor('instance') !== undefined) {// otherwise will crash on mobile safari
            $(this).sceditor('instance').focus(function () {
                if ($('input[name="grading_m"]').val() == 1) {
                    $('#calculated_points').hide();
                    $('.points_recalculate').show();
                }
            });
        }
	});

	$('[id^="matching_dropdown"]').change(function () {
		if ($('input[name="grading_m"]').val() == 1) {
			var selected_matching_dropdown_option = $(this).find('option:selected').attr('value');
			if (selected_matching_dropdown_option && selected_matching_dropdown_option != 'blank') {
				$('#calculated_points').hide();
				$('.points_recalculate').show();
			}
		}
	});
}

function define_sceditor_textarea_sizes() {
	$('#frame_editor_question').css('height', '80px');
	$('[id^="frame_editor_ans"]').css('height', '35px');
	$('[id^="frame_editor_matching_query"]').css('height', '35px');
	$('[id^="frame_editor_matching_option"]').css('height', '35px');
	$('[id^="frame_editor_matching_incorrect_option"]').css('height', '35px');
	$('[id^="frame_editor_correct_feedback"]').css('height', '35px');
	$('[id^="frame_editor_wrong_feedback"]').css('height', '35px');
}

function countChecked(status) {
	/* Show grade style box and swap qtype when more then one multiple choice answer is selected */
	if ( $("input.showCorrect:checked").length > 1 ){
		//MUST BE: MCMA
		$("#qtype").val('mcma');
		//Must be checkbox - hide options
		$("#roc_1").prop('checked', true);
		$("#show_radio_or_checkbox").hide();
		$("#show_grade_style").show();
	} else {
		// CAN BE EITHER: MCSA or MCMA
		// Note we do not by default set this back to Radio buttons using $("#roc_0").prop('checked', true);
		// on either: Loading question in edit mode, or un-checking answers back to a single answer
		// because: loading a MCMA with only one correct answer would default to radio button and change the question type

		if (status === undefined ) {
			//We only drop in here when we do something on the page, not when page initially loads, because PHP sets the correct radio/checkbox 'state'
            if (manually_changed_to_checkbox) {
                if ($("#roc_1").is(':checked')) {
                    $("#qtype").val('mcma');
                } else {
                    $("#qtype").val('mcsa');
                }
            } else {
                $("#roc_0").prop('checked', true);
                $("#qtype").val('mcsa');
            }
        }

		$("#show_radio_or_checkbox").show();

		$("#gs_0").prop('checked', true);
		$("#show_grade_style").hide();
	}
}

function get_existed_matching_rows(){
	return $('#matching_question_box').find('.matching_pairs').length;
}

function load_rest_matching_rows(){
	//show this click button after the first click
	var click_button_hide = false;

	////check matching type
	if ($('input[name="matching_t"]').val() == 1) {
		var matching_type = '#matching_input_';
	} else {
		var matching_type = '#editor_matching_option_';
	}

	//total number of existed matching rows (loaded by php code), usually it is 5
	var count_of_existed_matching_rows = get_existed_matching_rows();

	//get the target loading row, either 10 or 20
	var start_loading_row = count_of_existed_matching_rows + 1;
	if (count_of_existed_matching_rows < 10) {
		var end_loading_row = 10;
	} else {
		var end_loading_row = 20;
		click_button_hide = true;
	}

	//the rest matching rows (loaded by JS code)
	var rest_matching_rows = get_rest_matching_rows(start_loading_row, end_loading_row);

	//append the rest matching rows to the end of existed ones
	$('#matching_question_box').children('.unit_box:eq(' + (start_loading_row - 1) + ')').after(rest_matching_rows);

	recreate_dropdown();
	//run sceditor
	sceditor();

	for (var i = start_loading_row; i <= end_loading_row; i++) {
		$(matching_type + i).hide();
		$('#matching_answer_tabs_' + i).tabs();
		$('#matching_answer_tabs_' + i).tabs( "option", "active", 0 );
	}

	/*/check grading style
	if ($('#grade_multiple_points_style').val() == 0) {
		$('.grading_style_advance').hide();
	} else {
		$('.grading_style_advance').show();
	}*/

	/* show recalculate points button */
	trigger_recalculate_points();

	/* recalculate the points for per match grading style*/
	recalculate_points();

	return click_button_hide;
}

function checkShowGradingStyle(status){

	if ( $("#qtype").val() == 'mcsa' ||  $("#qtype").val() == 'mcma' ){

		countChecked(status);

	} else if ( $("#qtype").val() == 'm'){

		if ($('#grade_multiple_points_style').val() == 1){
			$('.grading_style_advance').show();
		} else {
			$('.grading_style_advance').hide();
		}
	}


}

function get_rest_matching_rows(start_loading_row, end_loading_row){

	var rest_matching_row_array = [];
	for (var i = start_loading_row; i <= end_loading_row; i++) {
		rest_matching_row_array.push(i);
	}

	var rest_matching_rows = '';
	var letter = '';

	$.each(rest_matching_row_array, function(i, key) {
		letter = String.fromCharCode(key + 64);
		rest_matching_rows +='<div class="unit_box unit_box_matching">' +
			'<div class="matching_pairs">' +
			'<div class="matching_row">' +
			//'<div class="matching_col"><h5>Matching ' + key + '</h5></div>' +
			'<div class="matching_col col_left">' +
			'<div>' +
			'<div class="grading_style_advance">' +
			'<span class="matching_plus_symbol">+</span>' +
			'&nbsp;' +
			'<input type="text" name="p_score_'+ key +'" class="m_forminput" size="3" id="p_score_'+ key +'" value="' + positive_score + '"> <i>pts</i>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<span class="matching_minus_symbol">âˆ’</span>' +
			'&nbsp;' +
			'<input type="text" name="n_score_'+ key +'" class="m_forminput" size="3" id="n_score_'+ key +'" value="' + negative_score + '"> <i>pts</i>' +
			'</div></div></div></div>' +
			'<div class="matching_row">' +
			'<div class="matching_col">' +
			'<div class="matching_col_header">Clue ' + letter + '</div>' +
			'<textarea name="matching_query_'+ key +'" rows="3" cols="67" id="matching_query_'+ key +'" class="qclear m_forminput fullBBcodeEditor"></textarea>' +
			'</div><div class="matching_col col_middle"><img class="small_icon" src="/img3/icon-breadcrumb-arrow.png" srcset="/img3/icon-breadcrumb-arrow@3x.png 2x" width="10" height="7"></div>' +
			'<div class="matching_col"><div class="matching_answer_tabs col_margin_left" id="matching_answer_tabs_'+ key +'">' +
			'<div id="new_answer_'+ key +'">Match ' + letter +
			'<span class="matching_header"><select class="qclear matching_dropdown" name="matching_dropdown_' + key + '" id="matching_dropdown_' + key + '"></select>' +
			'</span></div>' +
			'<div class="matching_answer_input_' + key + '">' +
			'<div id="matching_answer_tabs_'+ key +'-1" class="matching_new show"><input type="text" name="matching_input_'+ key +'" id="matching_input_'+ key +'" class="qclear matching_input" value="" maxlength="30">' +
			'<textarea rows="3" cols="49" name="matching_option_'+ key +'" id="matching_option_'+ key +'" class="qclear m_forminput fullBBcodeEditor"></textarea></div>' +
			'<input type="hidden" name="tab_'+ key +'" id="tab_'+ key +'"> <input type="hidden" name="matching_result_'+ key +'" id="matching_result_'+ key +'"></div>' +
			'<div class="bbcode matching_answer_existing_' + key + '"></div>' +
			'</div></div></div></div></div>';
	});

	return rest_matching_rows;
}

var state_simple_text_box = [];
var state_multimedia_box = [];
var first_time = 0;

/**
 * Recreate state list by its type
 */
function initialize_state() {

	if($('[name="matching_t"]').val() == 0) {
		for(var i = 2; i < 21; i++) {
			if ($("#matching_dropdown_" + i).length > 0) {
				state_simple_text_box[i] = $("#matching_dropdown_" + i).val();
			} else {
				state_simple_text_box[i] = "blank";
			}
			state_multimedia_box[i] = "blank";
		}
	} else {
		for(var i = 2; i < 21; i++) {
			if ($("#matching_dropdown_" + i).length > 0) {
				state_multimedia_box[i] = $("#matching_dropdown_" + i).val();
			} else {
				state_multimedia_box[i] = "blank";
			}
			state_simple_text_box[i] = "blank";
		}
	}
}

/**
 * After saving question - reset matching options
 */
function reset_matching_after_save() {
	for (var i = 2; i < 21; i++) {

		state_simple_text_box[i] = "blank";

		state_multimedia_box[i] = "blank";
	}

	if ($('[name="matching_t"]').val() == 0) {
		recreate_simple_text_dropdown();
	} else {
		recreate_multimedia_dropdown();
	}
}

/**
 * Recreate all the simple text matching drop down list
 */
function recreate_simple_text_dropdown() {

	var dropdown_options = '<option value="blank">Type New Match</option>';

	$("[id^=editor_matching_option_]").hide();
	for(var i = 2; i < 21; i++) {
		if ($("#matching_dropdown_" + i).length > 0) {
			if((i == 2) || (state_simple_text_box[i - 1] == 'blank')) {
				dropdown_options += '<option value="matching_row_' + (i - 1) + '">Same as Match ' + String.fromCharCode(64 + i - 1) + '</option>';
			}
			var selected_option_value = "";
			if (state_simple_text_box[i] == 'blank') {
				selected_option_value = "blank";
				//$("#matching_input_" + i).show();
				$(".matching_answer_input_" + i).show(); //element can be hidden when "editing an existing question" (in PHP)
				$(".matching_answer_existing_" + i).html('').removeClass("matching_answer_existing_border_top");
			} else {
				var dropdown_value = state_simple_text_box[i].split('_')[2];
				selected_option_value = "matching_row_" + dropdown_value;
				//$("#matching_input_" + i).hide();
				$(".matching_answer_input_" + i).hide();
				var option_content = $("#matching_input_" + dropdown_value).val();
				if (option_content.length > 0) {
					option_content = trim(bbCode(option_content));
				}
				$(".matching_answer_existing_" + i).html(option_content).addClass("matching_answer_existing_border_top");
			}
			$("#matching_dropdown_" + i).html(dropdown_options).val(selected_option_value);
		}
	}
}

/**
 * Set matching type, style and grading style
 */
function set_matching_type() {
	if ($('[name="matching_t"]').val() == 0) {
		$("#type_simple_text").trigger('click');
	} else {
		$("#type_multimedia").trigger('click');
	}
}

/**
 * Recreate all the multimedia matching drop down list
 */
function recreate_multimedia_dropdown() {

	var dropdown_options = '<option value="blank">Type New Match</option>';

	$("[id^=matching_input_]").hide();
	for(var i = 2; i < 21; i++) {
		if ($("#matching_dropdown_" + i).length > 0) {
			if ((i == 2) || (state_multimedia_box[i - 1] == 'blank')) {
				dropdown_options +='<option value="matching_row_' + (i - 1) + '">Same as Match ' + String.fromCharCode(64 + i - 1) + '</option>';
			}
			var selected_option_value = "";
			if (state_multimedia_box[i] == 'blank') {
				selected_option_value = "blank";
				//$("#editor_matching_option_" + i).show();
				$(".matching_answer_input_" + i).show(); //element can be hidden when "editing an existing question" (in PHP)
				$(".matching_answer_existing_" + i).html('').removeClass("matching_answer_existing_border_top");
			} else {
				var dropdown_value = state_multimedia_box[i].split('_')[2];
				selected_option_value = "matching_row_" + dropdown_value;
				//$("#editor_matching_option_" + i).hide();
				$(".matching_answer_input_" + i).hide();
				var option_content = $("#matching_option_" + dropdown_value).val();
				if (option_content.length > 0) {
					option_content = trim(bbCode(option_content));
				}
				$(".matching_answer_existing_" + i).html(option_content).addClass("matching_answer_existing_border_top");
			}
			$("#matching_dropdown_" + i).html(dropdown_options).val(selected_option_value);
		}
	}
	$(".imgw").css("max-width", "400px").show();
}

/**
 * Recreate all the dropdown list by its type
 */
function recreate_dropdown() {

	if($('[name="matching_t"]').val() == 0) {
		recreate_simple_text_dropdown();
	} else {
		recreate_multimedia_dropdown();
	}
}