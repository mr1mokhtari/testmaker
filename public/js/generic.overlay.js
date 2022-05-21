/* Result OverLay JS
*
* THIS SCRIPT DOES NOT LOAD IN OR WORK FOR IE6 and below
*
* */

var indexArray = [];	    // holds incremental index for each result on page that can be loaded into layover

var urlArray = [];		    // holds url required for getting results - NOTE: This can be manipulated from assign settings page if we need to change a URL
var currentIndex = '';			    // holds current index we are looking at
var currentKey;					    // holds current key of current user id for reference purposes in all arrays above
var preventDoubleClick = false;	    // async: false stops javascript running (show loading gif) so we use custom solution here to stop multiple requests
var currentScreenTop = 0;		    // used to scroll user back to where they were when they clicked to open overlay

var userNameArray = [];    // holds users actual name as shown between a tags
var scrollToArray = [];	// holds position to scroll to lay div - just above clicked name
var deletedArray = [];	    // holds ref to results we have deleted so we hide then in nex/prev links
var originalBodyBgColor = '';	    // for resetting BG color of results table back to normal
var screenPosition ='';			    // for scroll to last position after print close




$(document).ready(function () {


	/*****
	 * IMPORTANT: These next two functions must stay in this order
	 *
	 * If making check check results, search page, settings certficiate/theme overlays and Edit Ip Block overlay
	 * triggerGenericArrayIndexCounts();
	 * triggerGenericArray();
	 */
	triggerGenericArrayIndexCounts();
	triggerGenericArray();



	/***********************************
	 * START GENERIC OVERLAY - certs/theme/accesslists
	 **************************************/
	// An incremental index is stored in data-index attr in a.trigger-results



	$(document).on('click', 'a.trigger-generic-array', function(e){
		
		e.preventDefault();

		/* this prevents double click and clicking another name whilst one is currently loading */
		if ( preventDoubleClick ){
			return;
		}

		preventDoubleClick = true;

		currentScreenTop = $(document).scrollTop();
		$('.generic-overlay').css('top', currentScreenTop-80);


		/* Current user id */
		currentIndex = $(this).attr('data-index');
		//currentKey = indexArray.indexOf(currentIndex);
		currentKey = $.inArray(currentIndex, indexArray);
		
		if (currentKey == -1){

			alert(currentKey + ' Error code: [AJAX results 1] Something went wrong. Please refresh this page to try again.');
			return;
		}



		/* Don't animate overlay if already displayed
		if ($('.result-overlay').css('display') !== 'block') {
			resizeContent();
			$('.result-overlay').animate({width: 'toggle'});
		}*/



		$.ajax(
			{
				type:"GET",
				url: urlArray[currentKey],
				cache: false,
				async: true,//keep as true - see preventDoubleClick above var for why.
				beforeSend: function(x)
				{

					$('.generic-overlay-content').html('<div class="col-span-4">&nbsp;</div><div class="col-span-4"><img src="'+webpath_img+'icon_loading_circle_results.gif" class="loadingGif results-loading-gif"/></div><div class="clear"></div>');
					//$('html,body').animate({scrollTop: scrollToArray[currentKey]-40},'slow');

					//$('html,body').animate( screenTop,'slow');

					$('.generic-overlay').show();

				},
				success: function(html)
				{
					$('.generic-overlay-content').html(html);
				},
				error: function (){
					alert('Error code: [AJAX results 2] Something went wrong. Please refresh this page to try again.');
				},
				complete: function(){
					preventDoubleClick = false;
				}
			});

	});


	//Close overlay
	$(document).on('click', '.close-generic-overlay', function(e){
		e.preventDefault();

		$('.generic-overlay').hide();
		$('html,body').animate({scrollTop: currentScreenTop},'slow');

		if ( $(this).hasClass('refreshThemesTrigger') ) {

			refreshThemes(urlArray);
		}

		if ( $(this).hasClass('refreshAccessListTrigger') ) {

			refreshAccessLists(urlArray);
		}

		if ( $(this).hasClass('refreshCertificateTrigger') ) {

			refreshCertificates(urlArray);
		}

		if ( $(this).hasClass('refreshWebhooksTrigger') ) {

			refreshWebhooks(urlArray);
		}



	});

	/*************************************
	 * END GENERIC OVERLAY
	 **************************************/













	/*************************************
	 * START RESULTS OVERLAY
	 **************************************/

		// Place indexes from html into an array for overlay navigation next/previous
		// An incremental index is stored in data-index attr in a.trigger-results
	// $('a.trigger-results-array').each(function() {
	// 	indexArray.push($(this).attr('data-index'));
	// 	userNameArray.push($(this).html());
	// 	urlArray.push($(this).attr('href')+'&show_layover=1');
	// 	scrollToArray.push($(this).closest('div.row').offset().top);
	// });


	$(document).on('click', 'a.trigger-results-array,a.trigger-results', function(e){
		e.preventDefault();

		/* preventDoubleClick: This prevents double click and clicking another name whilst one is currently loading */
		if ( preventDoubleClick ){
			return;
		}

		preventDoubleClick = true;


		$('a.trigger-results-array').css('text-decoration', 'underline');
		$('.overlay-bg-darken-trigger div.row').removeClass('highlight-user-row-on-layover');

		$(".overlay-bg-darken-trigger a[data-index='"+$(this).attr('data-index')+"']").closest('div.row').addClass('highlight-user-row-on-layover');


		if (currentIndex ==  $(this).attr('data-index')){
			/* Don't AJAX request again if trying to open result that is already open
			 *  This case includes overlay being currently open (not closed - see below)
			 *
			 *  If it's closed we call server again in case of any change
			 *  */

			if ($('.result-overlay').css('display') != 'none') {//overlay if open and showing requested result
				preventDoubleClick = false;
				//$('.result-overlay').show();
			//	$('.overlay-bg-darken-trigger').addClass('darken-table-bg-on-layover');
				//$('.result-overlay').css('top', scrollToArray[currentKey]-180 );
				//$('html,body').animate({scrollTop: scrollToArray[currentKey]-40},'slow');

				return;
			}
		}

		/* Current user id */
		currentIndex = $(this).attr('data-index');
		//currentKey = indexArray.indexOf(currentIndex);
		currentKey = $.inArray(currentIndex, indexArray);


		if (currentKey == -1){

			alert('Error code: [AJAX results 1] Something went wrong. Please refresh this page to try again.');
			return;
		}



		/* dont animate overlay if already displayed
		 if ($('.result-overlay').css('display') !== 'block') {
		 resizeContent();
		 $('.result-overlay').animate({width: 'toggle'});
		 }*/



		setNextUserLink();
		setPreviousUserLink();

		$.ajax(
			{
				type:"GET",
				url: urlArray[currentKey],
				cache: false,
				async: true,//keep as true - see preventDoubleClick above var for why.
				beforeSend: function(x)
				{
					$('#footer').hide();
					$('.overlay-bg-darken-trigger').addClass('darken-table-bg-on-layover');
					$('.result-overlay-navigation').hide();
					$('.result-overlay-content').html('<div class="col-span-4">&nbsp;</div><div class="col-span-4"><img src="'+webpath_img+'icon_loading_circle_results.gif" class="loadingGif results-loading-gif"/></div><div class="clear"></div>');
					$('html,body').animate({scrollTop: scrollToArray[currentKey]-40},'slow');
					$('.result-overlay').css('top', scrollToArray[currentKey]-180 );
					$('.result-overlay').show();

				},
				success: function(html)
				{
					$('.result-overlay-content').html(html);
					convertBBcodetoHtml();
					checkBBcodeImageWidths();
					$('.result-overlay-navigation').show();
					$(".imgw").css("max-width",'600px').show();
				},
				error: function (){
					alert('Error code: [AJAX results 2] Something went wrong. Please refresh this page to try again.');
				},
				complete: function(){
					preventDoubleClick = false;
				}
			});




	});


	//Close overlay
	$(document).on('click', '.close-result-overlay', function(e){
		e.preventDefault();
		closeOverlay();
	});


	/* Delete single results from overlay screen */
	$(document).on('click',"#delete_single_result",function(event){
		event.preventDefault();
		if (!confirm('WARNING: Deleting is permanent!')){
			return;
		}

		$.ajax(
			{
				type: "POST",
				url: webpath_admin+"results/delete/",
				data: $("#delete_single_result_form").serialize(),
				cache: false,
				dataType: 'json',
				async: 		true,//keep as true - see preventDoubleClick above var for why.
				beforeSend: function(data){
					$('[id^="msgDiv"]').html('').hide();
				},
				success: 		function(data)
				{
					if(data.response == 'success') {


						$('.result-overlay-content').html(data.msg);
						$('html,body').animate({scrollTop: $('.result-overlay').offset().top},'slow');

						/* After delete: Replace row on page and re-create array */
						$('a.trigger-results-array').each(function() {
							if ( $(this).attr('data-index') == currentIndex ){
								$(this).closest('div.row').html('<div class="alert-box">'+userNameArray[currentKey]+ ': Result deleted.</div>');
								deletedArray.push(currentKey);
								closeOverlay();
							}
						});

					} else if (data.response == 'error'){


						$('#msgDivErrorDelete').attr("class", "ajaxerror").html(data.msg).fadeIn('slow');



					} else {

						alert('Error code: [AJAX Delete 1] Something went wrong. Please refresh this page to try again.');
					}

				},
				error: function (){
					alert('Error code: [AJAX Delete 2] Something went wrong. Please refresh this page to try again.');
				},
				complete: function(){
					preventDoubleClick = false;
				}
			});
		return false;
	});






	/*************************************
	 * END RESULTS OVERLAY
	 **************************************/

});


function triggerGenericArray(){
	// An incremental index is stored in data-index attr in a.trigger-results

	$('a.trigger-generic-array').each(function() {
		var tmpKey = $(this).attr('data-index');
		indexArray[tmpKey] = $(this).attr('data-index');

		
		userNameArray[tmpKey] = $(this).html();
		if ( $(this).attr('href').indexOf("?") == -1 ) {
			urlArray[tmpKey] = $(this).attr('href')+'?show_layover=1';
		} else {
			urlArray[tmpKey] = $(this).attr('href')+'&show_layover=1';
		}
		scrollToArray[tmpKey] = $(this).offset().top;

	});
}

function triggerGenericArrayIndexCounts(){

	indexArray = [];
    userNameArray = [];
    urlArray = [];
    scrollToArray = [];
    $('a.trigger-results-array').each(function () {

	    indexArray.push($(this).attr('data-index'));
	    userNameArray.push($(this).html());
	    urlArray.push($(this).attr('href') + '&show_layover=1');
	    scrollToArray.push($(this).closest('div.row').offset().top);
    });
}

/*************************************
 * START GENERIC OVERLAY FUNCTIONS
 **************************************/

/* Refresh theme dropdown to reload new theme or changed theme names */
function refreshThemes(urlArray){//pass in for global scope */

	$('#reloadThemesMsg').show();
	$('#theme_dropdown_holder').load(webpath_admin+'tests/themes/manage/updateTheme.rpc.php?refresh_theme_list=1', function(response, status, xhr) {
		if (status == "error") {
			$("#reloadThemesMsg").html('Looks like something has gone wrong. Please refresh this page to start again.');
		} else {
			$('#reloadThemesMsg').hide();
			/* reselect theme we were just working on
			 * When creating new theme, the preview window updates $('input[name="theme_id"]').val() with theme_id
			 * */
			$('#theme').val($('input[name="theme_id"]').val());

			urlArray[$('#edit_theme_link').attr('data-index')] = webpath_admin+'tests/themes/manage/?theme_id='+$('#theme').val()+'&show_layover';

			/* Don't show edit link if we didn't create theme - and we are on classmarker selected theme - applicable only when no custom themes exists*/
			if ( $('#theme').val() != 0 ){
				$('#edit_theme_link').show();
			}
		}
	});

}

/* Refresh access_list dropdown to reload new access_list or changed access_list names */
function refreshAccessLists(urlArray){//pass in for global scope */

	$('#reloadAccessListsMsg').show();
	$('#access_list_dropdown_holder').load(webpath_admin+'users/accesslists/manage/updateAccessList.rpc.php?refresh_access_list=1', function(response, status, xhr) {
		if (status == "error") {
			$("#reloadAccessListsMsg").html('Looks like something has gone wrong. Please refresh this page to start again.');
		} else {

			$('#reloadAccessListsMsg').hide();
			/* reselect access_list we were just working on
			 * ???When creating new them, the preview window updates $('input[name="theme_id"]').val() with theme_id
			 * */
			$('#access_list').val($('input[name="al_id"]').val());
			urlArray[$('#edit_access_list_link').attr('data-index')] = webpath_admin+'users/accesslists/manage/?al_id='+$('#access_list').val()+'&show_layover';

			/* Don't show edit link if we didn't create one - applicable only when no access lists exists */
			if ( $('#access_list').val() != 0 ){
				$('#edit_access_list_link').show();
			} else {
				$('#edit_access_list_link').hide();
			}
		}
	});

}

/* Refresh certificates dropdown to reload new certificate or changed certificates names */
function refreshCertificates(urlArray){//pass in for global scope */

	$('#reloadCertificatesMsg').show();
	$('#certificate_dropdown_holder').load(webpath_admin+'tests/certificates/manage/updateCertificate.rpc.php?refresh_certificate_list=1', function(response, status, xhr) {
		if (status == "error") {
			$("#reloadCertificatesMsg").html('Looks like something has gone wrong. Please refresh this page to start again.');
		} else {

			$('#reloadCertificatesMsg').hide();
			/* reselect certificate_list we were just working on
			 * ???When creating new them, the preview window updates $('input[name="theme_id"]').val() with theme_id
			 * */
			$('#certificate').val($('input[name="certificate_id"]').val());
			urlArray[$('#edit_certificate_link').attr('data-index')] = webpath_admin+'tests/certificates/manage/?certificate_id='+$('#certificate').val()+'&show_layover';

			/* Don't show edit link if we didn't create one  - applicable only when no certificates exists */
			if ( $('#certificate').val() != 0 ){
				$('#edit_certificate_link').show();
			} else {
				$('#edit_certificate_link').hide();
			}
		}
	});

}


/* Refresh Webhooks dropdown to reload new webhook or changed webhook names */
function refreshWebhooks(urlArray){//pass in for global scope */

	$('#reloadWebhooksMsg').show();
	$('#webhook_dropdown_holder').load(webpath_admin+'myaccount/webhooks/edit/updateWebhook.rpc.php?refresh_webhook_list=1', function(response, status, xhr) {
		if (status == "error") {
			$("#reloadWebhooksMsg").html('Looks like something has gone wrong. Please refresh this page to start again.');
		} else {

			$('#reloadWebhooksMsg').hide();
			/* reselect webhook_list we were just working on
			 * ???When creating new webhook, the preview window updates $('input[name="webhook_id"]').val() with webhook_id
			 * */

			 $('#webhook').val($('input[name="webhook_id"]').val());
			urlArray[$('#edit_webhook_link').attr('data-index')] = webpath_admin+'myaccount/webhooks/edit/?webhook_id='+$('#webhook').val()+'&show_layover';

			/* Don't show edit link if we didn't create one  - applicable only when no webhooks exists */
			if ( $('#webhook').val() != 0 ){
				$('#edit_webhook_link').show();
			} else {
				$('#edit_webhook_link').hide();
			}
		}
	});

}

/*************************************
 * END GENERIC OVERLAY FUNCTIONS
 **************************************/



/* Print functionality
 * save body html then replace with layover only - then reverse to go back
 */
//$('a.setup-print-result-overlay').click(function(e) {
function setupPrintResultsOverlay(){

	$('.result-overlay-navigation, .close-result-overlay').hide();
	var closePrintHtml = '<div class="print-btns noprint"><a href="javascript:print();" class="btn btn-white"><i class="fa fa-print" aria-hidden="true"></i>&nbsp;&nbsp;Print</a></a>&nbsp;&nbsp;&nbsp;<a href="#" class="close-print-result-overlay btn btn-create">Back</a></div>';

	originalBodyBgColor = $('body').css('background-color');
	screenPosition = $('.result-overlay').position();
	$('body').css('background-color', '#fff');
	//$('body').html( $('.result-overlay').html() ).css('background-color', '#fff');
	$('#content').after('<div id="print-content">'+$('.result-overlay').html()+'</div>');
	$('.header').hide();
	$('#content').hide();
	$('#footer').hide();
	$('#print-content').prepend( '<div class="print-classmarker-header"><h4>&nbsp;</h4></div>' );
	$('#print-content').prepend( closePrintHtml );
	$('html,body').animate({scrollTop: 0},'slow');

};


/*************************************
 * START RESULTS OVERLAY FUNCTIONS
 **************************************/

function setNextUserLink() {

	var nextUserKey = currentKey+1;
	var checkDeleted = true;

	/* Check we have not deleted this result - if so don't show it's next link */
	while (checkDeleted){

		if ($.inArray(nextUserKey, deletedArray) != -1){//this key is deleted
			nextUserKey++;//console.log('+next');
		} else {
			checkDeleted = false;
		}
	}

	// if next don't exists don't show
	if (indexArray[nextUserKey] !== undefined) {
		// display next link and set attr data-index
		$('.result-overlay-user-next').html('<a href="#" class="trigger-results next-result" data-index="'+indexArray[nextUserKey]+'">'+userNameArray[nextUserKey]+'&nbsp;&nbsp;&gt;&gt;</a>');
	} else {
		// hide next link and set attr data-index to empty
		$('.result-overlay-user-next').html('&nbsp;');
	}
}

function setPreviousUserLink() {

	var prevUserKey = currentKey-1;
	var checkDeleted = true;

	/* Check we have not deleted this result - if so don't show it's next link */
	while (checkDeleted){

		if ($.inArray(prevUserKey, deletedArray) != -1){//this key is deleted
			prevUserKey--;//console.log('-prev');
		} else {
			checkDeleted = false;
		}
	}

	// if prev don't exists don't show
	if (indexArray[prevUserKey] !== undefined) {
		// display previous link and set attr data-index
		$('.result-overlay-user-previous').html('<a href="#" class="trigger-results next-result" data-index="'+indexArray[prevUserKey]+'">&lt;&lt;&nbsp;&nbsp;'+userNameArray[prevUserKey]+'</a>');

	} else {
		// hide previous link and set attr data-index to empty
		$('.result-overlay-user-previous').html('&nbsp;');

	}
}

function closeOverlay(){
	$('.overlay-bg-darken-trigger').removeClass('darken-table-bg-on-layover');
	$('.overlay-bg-darken-trigger div.row').removeClass('highlight-user-row-on-layover');
	$('.result-overlay').hide();
	$('#footer').show();
}


/*************************************
 * END RESULTS OVERLAY FUNCTIONS
 **************************************/