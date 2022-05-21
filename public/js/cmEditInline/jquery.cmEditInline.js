/*
 * cmEditInline - Edit single or multiple form elements inline
 * Version 1.0 - 
 *
 * Instructions:
 *  1. <form must have a unique ID (id can be anything)
 *  2. $('.cmEditInline-edit-link-XXXXX').cmEditInline();
 *      Edit link must start with class 'cmEditInline-edit-link' (add dashed extensions for extra usages on single page)
 *  3. Make sure edit & cancel links and all divs are inside the FORM tags
 *  4. Cancel link class always equals exactly: '.cmEditInline-cancel-link'
 *  4. Repeated Forms can be used with same .cmEditInline-edit-link-XXXXX
 *
 *
 * Flow:
 * 1. Click Edit Button
 * 2. turn hidden inoputs to their displayed versions (textarea, select, text etc)
 * 3. On submit, post data to server
 * 5. If OK
 *    > Turn back into hidden elements with updated data, show success
 * 6. If Not OK
 *    > Turn back into hidden elements with old data, show error
 */

$("document").ready(function() {

  (function ($) {
    // todo submit fail  reset select and textareas
    $.fn.cmEditInline = function (options) {
      var settings = $.extend({
            method: 'post',
            url: '',
            async: false,
            ajax_error_msg: 'It looks like something went wrong! Please refresh this page and try again.',
            id: 0,
            cancel: false, // when cancelling changes with cancel btn
            display_ajax_result_success_class:  'cmEditInline-success',
            display_ajax_result_error_class:    'cmEditInline-error',
            display_ajax_result:                'cmEditInline-display-result',
            submit_btn_class:                   'btn btn-results'
          },
          options);





      return jQuery(this).click(function (event) {
        event.preventDefault();

        setId(this);

        $(this).hide(); // Hide link we just clicked
        displayFormElements();

        $('.'+settings.display_ajax_result).html('').removeClass(settings.display_ajax_result_error_class + ' ' + settings.display_ajax_result_error_class).hide();
        $('form#'+settings.id).find('.cmEditInline-cancel-link').show();

        $('form#'+settings.id).find('*').each(function () {
          if ($(this).data('it')) {
            switchToFormTypes(this);
          }
        });


        bindSwitchBackButton();
        bindCancelButton();
      });


      function displayFormElements(){
        $('form#' + settings.id).find('[data-display-form-elements]').show();
        $('form#' + settings.id).find('[data-display-nonform-elements]').hide();
      }
      function setId(el){
        settings.id = $(el).closest('form').attr('id');
      }

      /*********************************************************************
       *
       * SWITCH DIVS TO INPUT FORMS
       *
       *********************************************************************/

      /* Check Input Type */
      function switchToFormTypes(el) {

        if ($(el).data('it') == 'text') {
          switchToInputText(el);
        } else if ($(el).data('it') == 'textarea') {
          switchToTextarea(el);
        } else if ($(el).data('it') == 'hidden') {
          switchToInputHidden(el);
        } else if ($(el).data('it') == 'select') {
          switchToInputSelect(el);
        } else if ($(el).data('it') == 'submit') {
          switchToInputSubmit(el);
        } else if ($(el).data('it') == 'submitLink') {
          switchToLinkSubmit(el);
        }

      }


      function switchToInputText(el) {

        //var html = '<input type="text" ' + setInputName(el) + ' ' + setInputValue(el) + ' ' + setCharLimit(el) + ' ' + getDataValues(el) + ' ' + getClassValues(el) + ' />';
        var html = document.createElement("INPUT");
        html.setAttribute("type", "text");
        //html.setAttribute("value", $(el).data('value'));
        setInputName (el, html);
        setInputValue(el, html);
        setCharLimit (el, html);
        getDataValues(el, html);
        getClassValues(el, html);
        //'<input type="text" ' + setInputName(el) + ' ' + setInputValue(el) + ' ' + setCharLimit(el) + ' ' + getDataValues(el) + ' ' + getClassValues(el) + ' />';
        $(el).replaceWith(html);

      }

      function switchToTextarea(el) {

        var html = document.createElement("TEXTAREA");
        html.cols = 30; //todo allow these to be set dynamically from div data-cols="30"
        html.cols = 4;
        setInputName     (el, html);
        setTextAreaValue (el, html);    //todo  do we need $(el).data('value').replace('<br>', '\n')  ????
        getDataValues    (el, html);
        getClassValues   (el, html);
        //var html = '<textarea cols="30" rows="4"  ' + setInputName(el) + ' ' + getDataValues(el) + ' ' + getClassValues(el) + '>' + $(el).data('value').replace('<br>', '\n') + '</textarea>';
        $(el).replaceWith(html);

      }

      function switchToInputHidden(el) {

        var html = document.createElement("INPUT");
        html.setAttribute("type", "hidden");
        setInputName   (el, html);
        setInputValue  (el, html);
        getDataValues  (el, html);
        getClassValues (el, html);
        //var html = '<input type="hidden" ' + setInputName(el) + ' ' + setInputValue(el) + ' ' + getDataValues(el) + ' ' + getClassValues(el) + ' />';
        $(el).replaceWith(html);

      }

      function switchToInputSelect(el) {

        //console.log(options.dropdowns_array[$(el).data('select-options-name')]);
        var selected_option = $(el).data('selected-option');

        var select_options = settings.dropdowns_array[$(el).data('select-options-name')];

        var html = document.createElement("SELECT");
        setInputName   (el, html);
        getClassValues (el, html);
        getDataValues  (el, html);

        for (var option_index in select_options) {

          var option_element = document.createElement("option");

          option_element.setAttribute("value", option_index);

          if (selected_option == option_index) {
            option_element.setAttribute("selected", "selected");
          }

          option_element.innerHTML = select_options[option_index];

          html.appendChild(option_element);

        }

        $(el).replaceWith(html);

      }

      function switchToLinkSubmit(el) {

        var html = document.createElement("A");

        html.href ='#';
        html.text = $(el).data('value');
        html.setAttribute("class",   settings.submit_btn_class); // use setting value, not data-class values
        html.setAttribute("id",     'triggerback-' + settings.id);
        getDataValues  (el, html);

        //var html = '<a href="#" id="triggerback-' + settings.id + '" type="submit" ' + setInputName(el) + ' class="btn btn-results" ' + getDataValues(el) + ' ' + getClassValues(el) + '>' + $(el).data('value') + '</a>';
        $(el).replaceWith(html);

      }

      function switchToInputSubmit(el){
        // not written yet
      }

      function bindSwitchBackButton(){
        /* Bind cancel button to switch back */
        $('#triggerback-' + settings.id).bind("click", function (event) {

          event.preventDefault();

          setId(this);

          submitAndSwitchBackFromFormTypes();

        });

      }

      function bindCancelButton(){
        /* Bind cancel button to switch back */
        $('.cmEditInline-cancel-link').bind("click", function () {

          setId(this);

          cancelBackFromInputType();

        });

      }

      function cancelBackFromInputType(){
        settings.cancel = true;

        triggerSwitchBackFromFormTypes();

        settings.cancel = false;
      }









      /*********************************************************************
       *
       * SWITCH INPUTS BACK TO DIVS
       *
       *********************************************************************/
      function submitAndSwitchBackFromFormTypes(){

        submitData();


      }


      function triggerSwitchBackFromFormTypes() {

        $('form#'+settings.id).find('[class*="cmEditInline-edit-link"]').show();
        $('form#'+settings.id).find('.cmEditInline-cancel-link').hide();
        hideFormElements(this);

        $('form#'+settings.id).find('input, textarea, select').each(function () {// look for inputs, textarea, select etc
          if ($(this).data('it')) {
            switchBackFromInputType(this);
          }
        });
      }

      function hideFormElements(){
        $('form#' + settings.id).find('[data-display-form-elements]').hide();
        $('form#' + settings.id).find('[data-display-nonform-elements]').show();
      }

      function switchBackFromInputType(el) {
        if ($(el).data('it') == 'text') {
          switchBackFromInputText(el);
        } else if ($(el).data('it') == 'textarea') {
          switchBackFromInputTextarea(el);
        } else if ($(el).data('it') == 'hidden') {
          switchBackFromInputHidden(el);
        } else if ($(el).data('it') == 'select') {
          switchBackFromInputSelect(el);
        } else if ($(el).data('it') == 'submit') {
          switchBackFromInputSubmit(el);
        }
      }

      function switchBackFromInputText(el) {

        var html = document.createElement("DIV");


        if (settings.cancel){
          var value = $(el).attr('data-value'); // set back to original on cancel
        } else {
          var value = $(el).val(); // set to updated value
        }


        getDataValues(el, html);
        getClassValues(el, html);
        html.setAttribute('data-value', value);

        var textnode = document.createTextNode( value );
        html.appendChild(textnode);
        //var html = $('<div ' + getDataValues(el) + ' class="' + $(el).attr('class') + '">' + replaceAngleBrackets(value) + '</div>');

        $(el).replaceWith(html);

      }



      function switchBackFromInputTextarea(el) {

        var html = document.createElement("DIV");
        getDataValues(el, html);
        getClassValues(el, html);
        html.innerHTML = replaceAngleBrackets($(el).val()).replace(/(?:\r\n|\r|\n)/g, '<br>' );
        //html.appendChild(textnode);
        html.setAttribute('data-value', $(el).val());
        //var html = $('<div ' + getDataValues(el, html) + ' class="' + $(el).attr('class') + '">' + replaceAngleBrackets($(el).val()).replace(/(?:\r\n|\r|\n)/g, '<br>') + '</div>');
        // Update selected option
       // html.attr('data-value', $(el).val());
        $(el).replaceWith(html);

      }



      function switchBackFromInputHidden(el) {
        var html = document.createElement("DIV");
        getDataValues(el, html);
        getClassValues(el, html);
        $(el).replaceWith(html);
        //$(el).replaceWith('<div ' + getDataValues(el) + ' class="' + $(el).attr('class') + '"></div>');

      }



      function switchBackFromInputSelect(el) {

        var html = document.createElement("DIV");
        //alert(options.dropdowns_array[$(el).data('selectOptionsName')]);
        var selected_text = $(el).children("option:selected").text();

        // Update selected option
        if (settings.cancel){
          var selected_option = $(el).attr('data-selected-option');
        } else {
          var selected_option = $(el).children("option:selected").val();
        }


        /* Important: Keep these two lines in order so we can override value */
        getDataValues(el, html);
        html.setAttribute('data-selected-option', selected_option);


        getClassValues(el, html);


        if (!$(el).data('hide')){
          var textnode = document.createTextNode( selected_text );
          html.appendChild(textnode);
        }

        $(el).replaceWith(html);

      }



      function switchBackFromInputSubmit(el) {//not tested

        var html = document.createElement("DIV");
        getDataValues(el, html);
        $(el).replaceWith(html);

      }



      function replaceAngleBrackets(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }



      /* Add all data-xxx tags and value on element for future use (we ned to put them back to divs later) */
      function getDataValues(el, html) {

        $.each(el.attributes, function (i, attrib) {
          if (attrib.name.indexOf('data-') >= 0) {
            html.setAttribute(attrib.name, attrib.value);
          }

        });

      }










      /*********************************************************************
       *
       * GENERIC FUNCTIONS
       *
       *********************************************************************/

      function getClassValues(el, html) {
        if (!$(el).attr('class')) {
          return '';
        }
        html.setAttribute("class", $(el).attr('class'));
      }

      function setInputName(el, html) {
        if (!$(el).data('name')) {
          return;
        }
        html.setAttribute("name", $(el).data('name'));
      }

      function setInputValue(el, html) {
        if (!$(el).data('value')) {
          return;
        }
        html.setAttribute("value", $(el).data('value'));
      }

      function setTextAreaValue(el, html) {
        if (!$(el).data('value')) {
          return;
        }
        var textnode = document.createTextNode( $(el).data('value') ); //to investigate .replace('<br />', '\n')
        html.appendChild(textnode);
      }

      function setCharLimit(el, html){
        if (!$(el).data('char-limit')) {
          return;
        }

        html.setAttribute("maxlength", $(el).data('char-limit'));

        //return ' maxlength="' + $(el).data('char-limit') + '" ';
      }


      /*********************************************************************
       *
       * SUBMIT DATA
       *
       *********************************************************************/
      function submitData() {

        var dataVar = $('form#' + settings.id).serialize();
        $.ajax(
            {
              method: settings.method,
              url: settings.url,
              data: dataVar,
              dataType: "json"
            }).done(function (data) {

                if (data.response == 'success') {

                  $('form#' + settings.id).find('.' + settings.display_ajax_result).html(data.msg).removeClass(settings.display_ajax_result_error_class).addClass(settings.display_ajax_result_success_class).show();
                  triggerSwitchBackFromFormTypes();

                } else {

                  $('form#' + settings.id).find('.' + settings.display_ajax_result).html(data.msg).removeClass(settings.display_ajax_result_success_class).addClass(settings.display_ajax_result_error_class).show();
                  cancelBackFromInputType();

                }

              }).fail(function () {

                $('form#' + settings.id).find('.' + settings.display_ajax_result).html(settings.ajax_error_msg).removeClass(settings.display_ajax_result_success_class).addClass(settings.display_ajax_result_error_class).show();
                cancelBackFromInputType();

            });
      }
    };
  }(jQuery));


});

/*
  ID
  OTHER INPUT ELEMENTS
  URL
  ACTION POST

  data-it: input type
  data-visibility="h" hide show
  data-class="ad this class to imput"
  data-title="htmlspecialchars(inpt title)"



*/
