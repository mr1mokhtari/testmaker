$(document).ready(function () {
	sceditor();
});

// By default '.sceditor-group' are all loaded on page visible
// This var must sit here to be global
var sceditor_group_divs_are_closed = false;

function sceditor () {
	$.sceditorBBCodePlugin.bbcode.remove('horizontalrule')
		.remove('quote')
		.remove('youtube')//we use [yt]
		.remove('right')
		.remove('left')
		.remove('center')
		.remove('justify');
	//.remove('font')


	/* These must be global for use in separate functions below */
	var fonts   = 'Arial Black,Comic Sans MS,Courier,Courier New,Georgia,Impact,Helvetica,Open Sans,Times New Roman,Trebuchet MS,Verdana,Droid Arabic Kufi,Noto Sans Japanese,Noto Sans Simplified Chinese,Noto Sans Traditional Chinese,Noto Sans Korean'.split(',');
	var bbcode_fonts   = 'ArialBlack,ComicSansMS,Courier,CourierNew,Georgia,Impact,Helvetica,OpenSans,TimesNewRoman,TrebuchetMS,Verdana,DroidArabicKufi,NotoSansJapanese,NotoSansSC,NotoSansTC,NotoSansKR'.split(',');

	$.sceditor.command.set(
		"keyboard",
		{
			exec: function() {

				/* Toggle all other button groups, except this keyboard */
				if (sceditor_group_divs_are_closed) {
					sceditor_group_divs_are_closed = false;
                    $('.sceditor-group:not(:has(a.sceditor-button-keyboard))').show();
                } else {
					sceditor_group_divs_are_closed = true;
					$('.sceditor-group:not(:has(a.sceditor-button-keyboard))').hide();
				}

				//$('.sceditor-group').hide();
				//$('.sceditor-group:has(a.sceditor-button-keyboard)').animate({width: '50px'}, 1, function(){
				//	$(this).show("slide", { direction: "left" }, 1000);
				//});

			},
			tooltip:"Toggle Editor Options"
		}
	);

	$.sceditor.command.set(
		"square",
		{
			exec: function() {

				// this.selectedHtml

				var squareroot = prompt('Enter value to place under the Square root line:\n', '');

				var editor_value = $('#' + this.id + ' iframe').contents().find('body').html();

				if (squareroot === null || squareroot.length === 0){
					//alert('Must enter a value');
				} else {
					this.wysiwygEditorInsertHtml('<span class="square" data-square-value="' +  squareroot + '" >âˆš<span class="sqr">&nbsp;' + squareroot + '</span></span>&nbsp;');
				}
			},
			tooltip:"Square Root"
		}
	);

	$.sceditor.command.set(
		"color",
		{
			_dropDown: function(editor, caller, callback) {
				var i, x, color, colors,
					content      = $("<div />"),
				// IE is slow at string concation so use an array
					html         = [],
					cmd          = $.sceditor.command.get('color');

				// CM Custom colour setup
				html.push('<div class="sceditor-color-row">');

				html.push('<p class="sceditor-color-heading-select">Select Color</p>');

				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: black" data-color="#000000"></a>');

				html.push('</div>');

				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: red" data-color="#FF0000"></a>');

				html.push('</div>');

				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: Cornflowerblue" data-color="#6495ED"></a>');

				html.push('</div>');


				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: blue" data-color="#0000FF"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: green" data-color="#008000"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: navy" data-color="#000080"></a>');

				html.push('</div>');

				html.push('</div><div class="sceditor-color-row">');

				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: purple" data-color="#800080"></a>');

				html.push('</div>');

				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: maroon" data-color="#800000"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: teal" data-color="#008080"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: deeppink" data-color="#FF1493"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: orangered" data-color="#FF4500"></a>');

				html.push('</div>');
				html.push('<div class="sceditor-color-column">');

				html.push('<a href="#" class="sceditor-color-option" style="background-color: grey" data-color="#808080"></a>');

				html.push('</div>');

				html.push('<div class="sceditor-color-code">');

				html.push('<p class="sceditor-color-heading-code">Color Code</p><p class="sceditor-color-example">Example: #0033FF</p><input type="text" class="color-text"/><span class="btn color-check-button" onclick="colorText();">Check color</span>');

				html.push('<div class="show-color hide"><a href="#" class="sceditor-color-option sceditor-color-option-custom" style="background-color: black" data-color="#000000"></a></div><p class="color-click hide">Click color to use<p>');

				html.push('</div>');

				html.push('</div>');

				cmd._htmlCache = html.join('');

				content.append(cmd._htmlCache)
					.find('a')
					.click(function (e) {
						callback($(this).attr('data-color'));
						editor.closeDropDown(true);
						e.preventDefault();
					});

				editor.createDropDown(caller, "color-picker", content);
			},
			exec: function (caller) {
				var editor = this;

				$.sceditor.command.get('color')._dropDown(
					editor,
					caller,
					function(color) {
						editor.execCommand("forecolor", color);
					}
				);
			},
			tooltip: "Font Color"
		}
	);

	$.sceditor.command.set(
		"yt",
		{
			exec: function() {

				$('#fileSelectorDiv').jqmShow();

				$('#obj_ref').text( this.opts.id.replace('editor_','') );

				$('#test_vimeo_video_id').val('');
				$('#vimeoVideo').html('');
				$('.vimeoVideoId').show();
				$('.vimeoDemo').hide();

				$('#test_video_id').val('');
				$('#youtubeVideo').html('');
				$('.youtubeVideoId').show();
				$('.youtubeDemo').hide();


			},
			tooltip: "Insert Image, Document, Audio or Video"
		}
	);


	$.sceditor.command.set(
		"font", {
			_dropDown: function(editor, caller, callback) {
				var	content   = $("<div />"),
					fontIdx = 0,
					html         = [],
					/** @private */
					clickFunc = function (e) {
						callback($(this).data('font'));
						editor.closeDropDown(true);
						e.preventDefault();
					};


				/* Trent - Original code - overriding font options
					for (; fontIdx < fonts.length; fontIdx++) {
						content.append(
							_tmpl('fontOpt', {
								font: fonts[fontIdx]
							}, true).click(clickFunc)
						);
					}
				*/


				for (; fontIdx < fonts.length; fontIdx++) {
					//  data-font: replace spaces in font names with nothing to create the classes we use EG: bbcodeFontComicSansMS
					html.push('<a class="sceditor-font-option" data-font="'+bbcode_fonts[fontIdx]+'" href="#" unselectable="on"><font face="'+fonts[fontIdx]+'" unselectable="on">'+fonts[fontIdx]+'</font></a>');
				}


				content.append(html.join(''))
					.find('a')
					.click(function (e) {
						callback($(this).find('font').attr('face'));
						editor.closeDropDown(true);
						e.preventDefault();
					});


				editor.createDropDown(caller, 'font-picker', content);
			},
			exec: function (caller) {
				var editor = this;

				$.sceditor.command.get('font')._dropDown(
					editor,
					caller,
					function(fontName) {
						editor.execCommand('fontname', fontName);
					}
				);
			},
			tooltip: "Font Name"
		}
	);






	$.sceditor.command.set(
		"size", {
			_dropDown: function(editor, caller, callback) {
				var	content   = $("<div />"),
					html         = [],
					/** @private */
					clickFunc = function (e) {
						callback($(this).data('size'));
						editor.closeDropDown(true);
						e.preventDefault();
					};


				/* Trent - Original code - we want to limit size however and disallow small font for usability
				 for (var i=1; i<= 7; i++)
				 content.append(_tmpl('sizeOpt', {size: i}, true).click(clickFunc));
				 */
				html.push('<a class="sceditor-fontsize-option" data-size="1" href="#" unselectable="on"><font size="1" unselectable="on">Small</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="2" href="#" unselectable="on"><font size="2" unselectable="on">Normal</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="3" href="#" unselectable="on"><font size="3" unselectable="on">Large</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="4" href="#" unselectable="on"><font size="4" unselectable="on">Largest</font></a>');


				content.append(html.join(''))
					.find('a')
					.click(function (e) {
						callback($(this).attr('data-size'));
						editor.closeDropDown(true);
						e.preventDefault();
					});


				editor.createDropDown(caller, "fontsize-picker", content);
			},
			exec: function (caller) {
				var editor = this;

				$.sceditor.command.get('size')._dropDown(
					editor,
					caller,
					function(fontSize) {
						editor.execCommand("fontsize", fontSize);
					}
				);
			},
			tooltip: "Font Size"
		}
	);

	$.sceditor.command.set(
		"certificatesize", {
			_dropDown: function(editor, caller, callback) {
				//console.log(caller);
				var	content   = $("<div />"),
					html         = [],
					/** @private */
					clickFunc = function (e) {
						callback($(this).data('certificatesize'));
						editor.closeDropDown(true);
						e.preventDefault();
					};


				/* Trent - Original code - we want to limit size however and disallow small font for usability
				 for (var i=1; i<= 7; i++)
				 content.append(_tmpl('sizeOpt', {size: i}, true).click(clickFunc));
				 */
				html.push('<a class="sceditor-fontsize-option" data-size="1" href="#" unselectable="on"><font size="1" unselectable="on">Size 1</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="2" href="#" unselectable="on"><font size="2" unselectable="on">Size 2</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="3" href="#" unselectable="on"><font size="3" unselectable="on">Size 3</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="4" href="#" unselectable="on"><font size="4" unselectable="on">Size 4</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="5" href="#" unselectable="on"><font size="5" unselectable="on">Size 5</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="6" href="#" unselectable="on"><font size="6" unselectable="on">Size 6</font></a>');
				html.push('<a class="sceditor-fontsize-option" data-size="7" href="#" unselectable="on"><font size="7" unselectable="on">Size 7</font></a>');


				content.append(html.join(''))
					.find('a')
					.click(function (e) {
						callback($(this).attr('data-size'));
						editor.closeDropDown(true);
						e.preventDefault();
					});


				editor.createDropDown(caller, "fontsize-picker", content);
			},
			exec: function (caller) {
				var editor = this;

				$.sceditor.command.get('certificatesize')._dropDown(
					editor,
					caller,
					function(fontSize) {
						editor.execCommand("fontsize", fontSize);
					}
				);
			},
			tooltip: "Font Size"
		}
	);






	$.sceditor.command.set(
		"pastetext", {
			exec: function (caller) {


				var	val,
					editor  = this,
					content = $('<div><label for="txt">Paste your text inside the following box: <a class=\"why-paste\" href=\"javascript: alert(\'This is to stop incompatible text formatting being added from another application which can interfere with the final look of your text.\')\">Why?</a></label> ' +
						'<textarea cols="20" rows="2" id="txt"></textarea></div>' +
						'<div><input type="button" class="button" value="Insert" /></div>');



				content.find('.button').click(function (e) {
					val = content.find('#txt').val();

					if(val)
						editor.wysiwygEditorInsertText(val);

					editor.closeDropDown(true);
					e.preventDefault();
				});

				editor.createDropDown(caller, 'pastetext', content);
			},
			tooltip: 'Paste Text'
		}
	);

	$.sceditor.command.set(

		"symbols",
		{
			exec: function() {
				showSymbolsLightbox();

				$('#obj_ref').text( this.opts.id.replace('editor_','') );

			},
			tooltip: "Insert symbols"
		}
	);


	$.sceditor.command.set(

		"table", {
			exec: function (caller) {
				var	editor  = this,
					content = $('<div><label for="rows">Rows:</label><input type="text" id="rows" value="2" /></div>' +
						'<div><label for="cols">Cols:</label><input type="text" id="cols" value="2" /></div>' +
						'<div><input type="button" class="button" value="Insert" /></div>');



				content.find('.button').click(function (e) {
					var	rows = content.find('#rows').val() - 0,
						cols = content.find('#cols').val() - 0,
						html = '<table class="bbcodeTable">';

					if(rows < 1 || cols < 1)
						return;

					for (var row=0; row < rows; row++) {
						html += '<tr>';

						for (var col=0; col < cols; col++)
							html += '<td>' + ($.sceditor.ie ? '' : '<br />') + '</td>';

						html += '</tr>';
					}

					html += '</table>';

					editor.wysiwygEditorInsertHtml(html);
					editor.closeDropDown(true);
					e.preventDefault();
				});

				editor.createDropDown(caller, 'inserttable', content);
			},
			tooltip: 'Insert a table'
		}
	);
	// END_COMMAND



	/* CUSTOM BBCODES */



	$.sceditor.plugins.bbcode.bbcode.set(
		"yt",
		{
			allowsEmpty: true,
			tags: {
				iframe: {
					'data-youtube-id': null
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) {
				if(!(element.attr('data-youtube-id')))
					return content;

				return '[yt]' + element.attr('data-youtube-id') + '[/yt]';
			},
			html: '<iframe width="225" height="185" src="https://www.youtube-nocookie.com/embed/{0}?wmode=opaque&amp;rel=0&amp;showsearch=0&amp;showinfo=0' +
			'" data-youtube-id="{0}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
		}
	);


	$.sceditor.plugins.bbcode.bbcode.set(
		"vimeo",
		{
			allowsEmpty: true,
			tags: {
				iframe: {//html
					'data-vimeo-url': null
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) {
				if(!(element.attr('data-vimeo-url')))
					return content;

				return '[vimeo]' + element.attr('data-vimeo-url') + '[/vimeo]';
			},
			html: '<iframe data-vimeo-url="{0}" src="https://player.vimeo.com/video/{0}" width="225" height="185" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
		}
	);



	// Uploaded video
	$.sceditor.plugins.bbcode.bbcode.set(
		"cmvideo",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				iframe:{
					'data-cmvideo-url': null//value we want from this attribute
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) { //extracting from sceditor-container iframe (html)
				// error check on img html to make sure it should not be bbcode [img] instead of [cmimg]

				if(!(element.attr('data-cmvideo-url')))
					return content;

				return '[cmvideo]' + element.attr('data-cmvideo-url') + '[/cmvideo]';
			},

			html: function(token, attrs, content) {//bbcode to html
				return  '<iframe class="black-background" width="242" height="197" src="'+web_root+'videoaudioiframe.php?type=cmvideo&content=' + content + '" data-cmvideo-url="' + content + '"  frameborder="0" allowfullscreen></iframe>';
			}
		}
	);

	// External video
	$.sceditor.plugins.bbcode.bbcode.set(
		"exvideo",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				iframe: {//html tags we are searching
					'data-exvideo-url': null//value we want from this attribute
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) { //extracting from sceditor-container iframe (html)
				// error check on img html to make sure it should not be bbcode [img] instead of [cmimg]

				if(!(element.attr('data-exvideo-url')))
					return content;

				return '[exvideo]' + element.attr('data-exvideo-url') + '[/exvideo]';
			},

			html: function(token, attrs, content) {//bbcode to html
				return  '<iframe class="black-background" width="242" height="197" src="'+web_root+'videoaudioiframe.php?type=exvideo&content=' + content + '" data-exvideo-url="' + content + '"  frameborder="0" allowfullscreen></iframe>';
			}
		}
	);

	// cm audio
	$.sceditor.plugins.bbcode.bbcode.set(
		"cmaudio",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				iframe: {//html tags we are searching
					'data-cmaudio-url': null//value we want from this attribute
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) { //extracting from sceditor-container iframe (html)

				if(!(element.attr('data-cmaudio-url')))
					return content;

				return '[cmaudio]' + element.attr('data-cmaudio-url') + '[/cmaudio]';
			},

			html: function(token, attrs, content) {//bbcode to html
				return  '<iframe width="300" height="30" src="'+web_root+'videoaudioiframe.php?type=cmaudio&content=' + content + '" data-cmaudio-url="' + content + '"  frameborder="0"></iframe>';
			}
		}
	);

	// external audio
	$.sceditor.plugins.bbcode.bbcode.set(
		"exaudio",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				iframe: {//html tags we are searching
					'data-exaudio-url': null//value we want from this attribute
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) { //extracting from sceditor-container iframe (html)

				if(!(element.attr('data-exaudio-url')))
					return content;

				return '[exaudio]' + element.attr('data-exaudio-url') + '[/exaudio]';
			},

			html: function(token, attrs, content) {//bbcode to html
				return  '<iframe width="300" height="30" src="'+web_root+'videoaudioiframe.php?type=exaudio&content=' + content + '" data-exaudio-url="' + content + '"  frameborder="0"></iframe>';
			}
		}
	);

	// soundcloud audio
	$.sceditor.plugins.bbcode.bbcode.set(
		"soundcloud",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				iframe: {//html tags we are searching
					'data-soundcloud-url': null//value we want from this attribute
				}
			},
			isInline: true,
			isHtmlInline: true,
			format: function(element, content) { //extracting from sceditor-container iframe (html)

				if(!(element.attr('data-soundcloud-url')))
					return content;

				return '[soundcloud]' + element.attr('data-soundcloud-url') + '[/soundcloud]';
			},

			html: function(token, attrs, content) {//bbcode to html
				return '<iframe data-soundcloud-url="' + content + '" width="380" height="160" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url='+content+'&show_artwork=true&auto_play=false&maxheight=160&maxwidth=380"></iframe>';
			}
		}
	);
	/* CM external image */
	$.sceditor.plugins.bbcode.bbcode.set(
		"img",
		{//bbcode tag reference
			allowsEmpty: true,
			tags: {
				img: {//HTML tag reference
					src: null
				}
			},
			quoteType: $.sceditor.BBCodeParser.QuoteType.never,
			format: function(element, content) {
				var	attribs = '',
					style = function(name) {
						return element.style ? element.style[name] : null;
					};

				// check if this is an emoticon image
				if(typeof element.attr('data-sceditor-emoticon') !== "undefined")
					return content;


				// only add width and height if one is specified
				/*if(element.attr('width') || element.attr('height') || style('width') || style('height'))
				 attribs = "=" + $(element).width() + "x" + $(element).height();
				 */

				//Is this a CMIMG or a EXTERNALLY HOSTED image
				if(typeof element.attr('data-cmimg-url') !== "undefined"){
					return content;
					//return '[cmimg]' + element.attr('data-cmimg-url') + '[/cmimg]';
				} else {
					return '[img' + attribs + ']' + element.attr('src') + '[/img]';
				}
			},
			html: function(token, attrs, content) {
				var	parts,
					attribs = '';

				// handle [img width=340 height=240]url[/img]
				if(typeof attrs.width !== "undefined")
					attribs += ' width="' + attrs.width + '"';
				if(typeof attrs.height !== "undefined")
					attribs += ' height="' + attrs.height + '"';

				// handle [img=340x240]url[/img]
				if(typeof attrs.defaultattr !== "undefined") {
					parts = attrs.defaultattr.split(/x/i);

					attribs = ' width="' + parts[0] + '"' +
						' height="' + (parts.length === 2 ? parts[1] : parts[0]) + '"';
				}


				return '<img' + attribs + ' src="' + content + '" class="previewImg"/>';
			}
		}
	);


	/* CMIMG uploaded image
	 *  CMIMG only user to return cmimg html
	 * */
	$.sceditor.plugins.bbcode.bbcode.set(
		"cmimg",
		{//bbcode reference
			allowsEmpty: true,
			tags: {
				img: {//html tags we are searching
					'data-cmimg-url': null//value we want from this attribute
				}
			},


			format: function(element, content) { //extracting from sceditor-container iframe (html)
				// error check on img html to make sure it should not be bbcode [img] instead of [cmimg]

				if(!(element.attr('data-cmimg-url')))
					return content;

				return '[cmimg]' + element.attr('data-cmimg-url') + '[/cmimg]';
			},

			html: function(token, attrs, content) {//bbcode to html

				return '<img data-cmimg-url="'+ content +'" src="' + getDocPathForDropDown(content) + '" class="previewImg"/>';
			}
			//without function method html: '<img src="{0}" data-cmimg-url="{0}"  class="previewImg"/>'//bbcode to HTML template for sceditor-container
		}
	);

	/* URL will return both external link and cmdoc a bbcode tag + eternal link a html tag */
	$.sceditor.plugins.bbcode.bbcode.set(
		"url",
		{
			allowsEmpty: true,
			tags: {
				a: {
					href: null
				}
			},
			quoteType: $.sceditor.BBCodeParser.QuoteType.never,
			format: function(element, content) {
				var url = element.attr('href');

				/* ignore cmdoc URLs here */
				if(element.attr('data-cmdoc-url'))
					return;

				// make sure this link is not an e-mail, if it is return e-mail BBCode
				//if(url.substr(0, 7) === 'mailto:')
				//return '[email="' + url.substr(7) + '"]' + content + '[/email]';



				return '[url=' + decodeURI(url) + ']' + content + '[/url]';



			},
			html: function(token, attrs, content) {

				if(typeof attrs.defaultattr === "undefined" || attrs.defaultattr.length === 0)
					attrs.defaultattr = content;

				return '<a href="' + encodeURI(attrs.defaultattr) + '" class="popup">' + content + '</a>';
			}
		}
	);


	/* Class Marker doc - will return cmdoc a html tag */
	$.sceditor.plugins.bbcode.bbcode.set(
		"cmdoc", {
			allowsEmpty: true,
			tags: {
				a: {
					'data-cmdoc-url': null
				}
			},
			quoteType: $.sceditor.BBCodeParser.QuoteType.never,
			format: function(element, content) {
				var url = element.attr('href');

				if(!element.attr('data-cmdoc-url'))
					return;


				return '[cmdoc="' + element.attr('data-cmdoc-url') + '"]' + $.trim(element.text()) + '[/cmdoc]';//chrome was adding in space one element.text() so trim required.
			},
			html: function(token, attrs, content) {//bbcode to html

				//console.log(attrs.defaultattr);

				return '<a data-cmdoc-url="'+ attrs.defaultattr +'" href="' + attrs.defaultattr + '" class="popup">'+content+'</a>';
			}

			/*html: function(token, attrs, content) {
			 if(typeof attrs.defaultattr === "undefined" || attrs.defaultattr.length === 0)
			 attrs.defaultattr = content;

			 return '<a data-cmdoc-url="' + attrs.defaultattr + '" href="' + encodeURI(attrs.defaultattr) + '">' + content + '</a>';
			 }*/
		}
	);


	$.sceditor.plugins.bbcode.bbcode.set(
		"sqr", {
			allowsEmpty: true,
			tags: {
				span: {
					'data-square-value': null
				}
			},
			format: function(element, content) {

				if(!(element.attr('data-square-value')))
					return content;

				return '[sqr]' + element.attr('data-square-value') + '[/sqr]';
			},

			html: '<span class="square" data-square-value="{0}" >âˆš<span class="sqr">&nbsp;{0}</span></span>&nbsp;'
		}
	);








	$.sceditor.plugins.bbcode.bbcode.set(
		"font", {
			tags: {
				font: {
					face: null
				}
			},
			styles: {
				"font-family": null
			},
			format: function(element, content) {

				/* On Saving sceditor new text, we:
				 1. grab actual html font name from attf('face')
				 2. Check it is valid, and set default if not
				 3. Get bbcode font name from bbcode_fonts and put in bbcode tag
				 4. cm xbbcode parse add 'bbcodeFont' in front 'bbcode_fonts name' in which because the css class name
				 Eg: <font face=Comic Sans MS>Text</font>
				 To: [font=ComicSansMS]Text[/font]
				  */

				var	fontface = element.attr('face');
				/* Hack because Google chrome was making Serif and Sans-serif be lower case and not match a font in the BBCode array */
				if (fontface == 'serif'){
					fontface = 'Serif';
				} else if (fontface == 'sans-serif'){
					fontface = 'Sans-serif';
				}

				if (fonts.indexOf(fontface) === -1) {
					fontface = 'Times New Roman';
				}

				return '[font=' + bbcode_fonts[fonts.indexOf(fontface)] + ']' + content + '[/font]';
			},
			html: function(token, attrs, content) {
				/* POPULATE EDITOR WITH FORMATTED HTML
				Create HTML to put "INTO" sceditor when we edit text */
				//return '<font face="' + attrs.defaultattr + '">' + content + '</font>';//old

				/*
				 Eg: [font=ComicSansMS]Text[/font]  Grap attribute and put applicable font into <font> tag below
				 To: <font face=Comic Sans MS>Text</font>
				 */

				return '<font face="' + fonts[bbcode_fonts.indexOf(attrs.defaultattr)] + '" data-face="' + fonts[bbcode_fonts.indexOf(attrs.defaultattr)] + '">' + content + '</font>';
			}
		}
	);






	$.sceditor.plugins.bbcode.bbcode.set(
		"size", {
			tags: {
				font: {
					size: null
				}
			},
			styles: {
				"font-size": null
			},
			format: function(element, content) {
				var	fontSize = element.attr('size'),
					size     = 2;

				if(!fontSize)
					fontSize = element.css('fontSize');

				// Most browsers return px value but IE returns 1-7
				if(fontSize.indexOf("px") > -1) {
					// convert size to an int
					fontSize = fontSize.replace("px", "") - 0;

					if(fontSize > 12)
						size = 2;
					if(fontSize > 15)
						size = 3;
					if(fontSize > 17)
						size = 4;
					if(fontSize > 23)
						size = 5;
					if(fontSize > 31)
						size = 6;
					if(fontSize > 47)
						size = 7;
				} else
					size = fontSize;

				if(fontSize > 7){
					size=7;/* Trent limit max size */
				}
				if(fontSize < 1){
					size=1;/* Trent limit min size */
				}

				if (fontSize == 2){
					return content; /* Trent: 2 is normal font size - no need to tag it */
				}


				return '[size=' + size + ']' + content + '[/size]';
			},
			html: function(token, attrs, content) {

				return '<font size="' + attrs.defaultattr + '">' + content + '</font>';
			}
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(
		"color", {
			tags: {
				font: {
					color: null
				}
			},
			styles: {
				color: null
			},
			quoteType: $.sceditor.BBCodeParser.QuoteType.never,
			format: function($element, content) {
				var	color,
					element = $element[0];

				if(element.nodeName.toLowerCase() !== 'font' || !(color = $element.attr('color')))
					color = element.style.color || $element.css('color');

				if (color == '#000000' || color == '#000' || color == 'black' || color == 'rgb(0, 0, 0)')
					return content;//Trent we don't need color "black" in bbcode it is default no need to tag it


				return '[color=' + $.sceditor.plugins.bbcode.normaliseColour(color) + ']' + content + '[/color]';
			},
			html: function(token, attrs, content) {
				return '<font color="' + $.sceditor.plugins.bbcode.normaliseColour(attrs.defaultattr) + '">' + content + '</font>';
			}
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(
		"ul", {
			tags: {
				ul: null
			},
			breakStart: false, // Trent set to false to remove line break after fist [ul] CM
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			breakBefore: false, // Trent Add to remove line break on BBCode conversion
			isInline: false,
			skipLastLineBreak: true,
			format: "[ul]{0}[/ul]",
			html: '<ul>{0}</ul>'
		}
	);
	$.sceditor.plugins.bbcode.bbcode.set(
		"ol", {
			tags: {
				ol: null
			},
			breakStart: false, // Trent set to false to remove line break after fist [ul] CM
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			breakBefore: false, // Trent Add to remove line break on BBCode conversion
			isInline: false,
			skipLastLineBreak: true,
			format: "[ol]{0}[/ol]",
			html: '<ol>{0}</ol>'
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(
		"li", {
			tags: {
				li: null
			},
			breakStart: false, // Trent set to false to remove line break after fist [ul] CM
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			breakBefore: false, // Trent Add to remove line break on BBCode conversion
			isInline: false,
			closedBy: ['/ul', '/ol', '/list', '*', 'li'],
			format: "[li]{0}[/li]",
			html: '<li>{0}</li>'
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(
		"table", {
			tags: {
				table: null
			},
			isInline: false,
			isHtmlInline: true,
			skipLastLineBreak: false,
			format: "[table]{0}[/table]",
			html: '<table class="bbcodeTable">{0}</table>'// Trent added bbcodeTable
		}
	);


	$.sceditor.plugins.bbcode.bbcode.set(
		"tr", {
			tags: {
				tr: null
			},
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			isInline: false,
			skipLastLineBreak: true,
			format: "[tr]{0}[/tr]",
			html: '<tr>{0}</tr>'
		}
	);
	$.sceditor.plugins.bbcode.bbcode.set(
		"th", {
			tags: {
				th: null
			},
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			allowsEmpty: true,
			isInline: false,
			format: "[th]{0}[/th]",
			html: '<th>{0}</th>'
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(
		"td", {
			tags: {
				td: null
			},
			breakAfter: false, // Trent Add to remove line break on BBCode conversion
			allowsEmpty: true,
			isInline: false,
			format: "[td]{0}[/td]",
			html: '<td>{0}</td>'
		}
	);

	$.sceditor.plugins.bbcode.bbcode.set(// Trent Add to remove HR tags, incase someone users browser option to add RTL tags
		"hr", {
			tags: {
				td: null
			},
			breakAfter: false,
				allowsEmpty: true,
				isInline: false,
				format: "{0}",
				html: '{0}'
		}
	);


	$.sceditor.plugins.bbcode.bbcode.set(// Trent Add to remove LTR tags, incase someone users browser option to add LTR tags which are not required, also sceditor adds them in anyway if using the text direction bbcode buttons
		"ltr", {
			tags: {
				td: null
			},
			breakAfter: false,
				allowsEmpty: true,
				isInline: false,
				format: "{0}",
				html: '{0}'
		}
	);


	// Getting the character count is duplicated. I have done this so there are no changes to the original code. Matt.
	var show_over_char_alert = 0;
	$.sceditor.plugins.charlimit = function() {
		var base = this;

		// signalReady happens after the sceditor has been created.
		base.signalReady = function(e) {

			// Get current typed value with BBCode
			var value = $('#' + this.opts.id.replace('editor_','')).data('sceditor').val();

			// Removing BBCode tags
			var text = value.replace(/\[\/?(?:b|i|u|s|sub|sup|left|right|center|justify|font|ul|li|ol|table|tr|td|hr|email|quote|yt|vimeo|rtl|ltr|url|quote|code|img|color|size|certificatesize|sqr|cmdoc|cmimg)*?.*?\]/img, '');

			// Length of characters with BBCode removed
			var numOfCharacters = text.length;


			// if this.opts.characterLimit is not set use default value of 150
			if (isNaN(this.opts.characterLimit)) {
				this.opts.characterLimit = 150;
			}

			// Calculate remaining characters. Will return negative value if user has gone over character count.
			var remainingCharacters = this.opts.characterLimit - numOfCharacters;

			// Create SCEditor character count HTML
			var editorCountId = this.opts.id + '_count';

			// Creating new character count div for sceditor. Show text as red if a negative value.
			if (remainingCharacters > 0) {
				//<div class="sceditorCharacterCount"><p>Character Limit <span>0</span>/{characterLimit}<p></div>
				//$('#' + this.opts.id + ' .sceditorCharacterCount span').html(remainingCharacters);
				$('#' + this.opts.id).append('<div class="sceditorCharacterCount"><p>Character Limit <span>'+remainingCharacters+'</span>/'+this.opts.characterLimit+'<p></div>');

				//$('#' + this.opts.id).append('<div id="' + editorCountId + '" class="count"><p>Character Limit <span>' + remainingCharacters + ' </span><p></div>');
			} else {


				$('#' + this.opts.id).append('<div class="sceditorCharacterCount"><p>Character Limit <span class="red">'+remainingCharacters+'</span>/'+this.opts.characterLimit+'<p></div>');

				//$('#' + this.opts.id + ' .sceditorCharacterCount span').html(remainingCharacters);
				//$('#' + this.opts.id).append('<div id="' + editorCountId + '" class="count"><p>Character Limit <span style="color:red;">' + remainingCharacters + ' </span><p></div>');
			}
		},

			base.signalKeyupEvent = function(e) {
				$('#' + this.opts.id.replace('editor_','')).data('sceditor').updateOriginal();
			},

			// base.signalKeyupEvent breaks with IE.
			base.signalKeydownEvent = function(e) {

				// Get current typed value with BBCode
				var value = $('#' + this.opts.id.replace('editor_','')).data('sceditor').val();

				// Removing BBCode tags
				var text = value.replace(/\[\/?(?:b|i|u|s|sub|sup|left|right|center|justify|font|ul|li|ol|table|tr|td|hr|email|quote|yt|vimeo|rtl|ltr|url|quote|code|img|color|size|certificatesize|sqr)*?.*?\]/img, '');

				// Length of characters with BBCode removed
				var numOfCharacters = text.length;

				// if this.opts.characterLimit is not set use default value of 150
				if (isNaN(this.opts.characterLimit)) {
					this.opts.characterLimit = 150;
				}
				//alert(numOfCharacters + ' characterLimit ' + this.opts.characterLimit);
				// Calculate remaining characters. Will return negative value if user has gone over character count.
				var remainingCharacters = (this.opts.characterLimit - numOfCharacters) -1;

				var editorCountId = this.opts.id + '_count';

				// Update character count div for sceditor. Show text as red if a negative value.
				if (remainingCharacters > 0) {

					$('#' + this.opts.id + ' .sceditorCharacterCount p span').html(remainingCharacters);
					$('#' + this.opts.id + ' .sceditorCharacterCount span').removeClass('red bold');
					//$('#' + editorCountId).html('<p>Character Limit <span>' + remainingCharacters + '</span><p>');

				} else {

					if (show_over_char_alert==0){
						alert('You have exceeded the allowed character limit.\n\nYour text will be truncated to ' + this.opts.characterLimit + ' characters when saved.');
						show_over_char_alert = 1;
					}

					$('#' + this.opts.id + ' .sceditorCharacterCount span').html(remainingCharacters);
					$('#' + this.opts.id + ' .sceditorCharacterCount span').addClass('red bold');
					// $('#' + editorCountId).html('<p>Character Limit <span style="color:red;">' + remainingCharacters + '</span><p>');
				}
				//$('#' + this.opts.id.replace('editor_','')).data('sceditor').updateOriginal();

			}

	};


	/*
	 $.sceditor.plugins.charlimit = function() {
	 var base = this;
	 var ctrlDown = false;
	 var ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;

	 base.signalReady = function (e){
	 characterCount(this, this.opts.characterLimit, e);
	 },
	 base.signalKeyupEvent = function(e) {
	 if (e.keyCode == ctrlKey || e.keyCode == cmdKey ) ctrlDown = false;
	 characterCount(this, this.opts.characterLimit, e);
	 },

	 base.signalKeydownEvent = function(e) {

	 if (e.keyCode == ctrlKey || e.keyCode == cmdKey ) ctrlDown = true;

	 if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return true;

	 characterCount(this, (this.opts.characterLimit - 1), e);
	 },

	 characterCount = function(editor, max, e) {


	 var ignoreMe;
	 if (typeof e != 'undefined'){

	 / * Array shift delete etc * /
	 //var notAlphaNumericKey = $.inArray(e.keyCode,[13,16,17,18,19,20,27,35,36,37,38,39,40,91,93,224]);
	 var notAlphaNumericKey = $.inArray(e.keyCode,[13,16,18,19,20,27,35,36,37,38,39,40,91,93,224]);

	 / * Stop typing here if not in allowed keys * /
	 if(notAlphaNumericKey === 1) return;

	 } else {
	 ignoreMe = true;
	 }
	 var text = editor.getWysiwygEditorValueCharacterCount();

	 if (!ignoreMe){
	 var input = String.fromCharCode(e.keyCode);

	 if(/[a-zA-Z0-9-_ ]/.test(input) && text.length > (max)) {
	 e.preventDefault();
	 e.stopPropagation();
	 }
	 }

	 $('#' + editor.getId() + ' .sceditorCharacterCount span').html(text.length);
	 }
	 };
	 */


	//http://www.sceditor.com/documentation/#options
	//$(editor_id).data("sceditor").wysiwygEditorInsertHtml({HTML}); // inserts HTML
	//$(editor_id).data("sceditor").expandToContent(true); // Expands editor

	$('textarea.fullBBcodeEditor').attr('rows', 3);
	$('textarea.fullBBcodeEditor').each(function(){
		var displayCountValue = false;
		var characterLimit = 0;
		var pluginsValue = 'bbcode';

		if (typeof ($(this).attr('data-charLimit')) != 'undefined'){
			displayCountValue = true;
			characterLimit = $(this).attr('data-charLimit');
			pluginsValue = 'bbcode, charlimit';
		}

		$('#' + this.id).sceditor({
			id: 'editor_' + this.id,
			plugins: pluginsValue,
			autoExpand: true,//autoExpend when adding new lines
			toolbar: "bold,italic,underline,strike,color,size,superscript,subscript|orderedlist,bulletlist,indent,outdent|table,code,link,yt,square,symbol|ltr,rtl|keyboard",
			//toolbar: "bold,italic,underline,strike,color,size|orderedlist,bulletlist,table,code|link,yt|superscript,subscript,square,symbols|keyboard",
			//toolbar: "bold,italic,underline,strike,color,size|orderedlist,bulletlist,table|link,yt|superscript,subscript,square,pastetext|symbols",
			//toolbar: "bold,italic,underline,strike,color,size|center,orderedlist,bulletlist|link,image,yt|superscript,subscript,code,square,source",
			style: BBCODE_CSS,
			resizeEnabled: true,
			resizeMaxHeight: 500,//max height iframe can go, scrollbars used after this
			displayCount: displayCountValue,
			characterLimit: characterLimit,
			disablePasting: false,
			enablePasteFiltering: true,
			emoticonsEnabled: false,
			runWithoutWysiwygSupport: true // allow to display in non Wysiwyg compatible like mobile phones

		}).data("sceditor").expandToContent(true);//keep 'false', 'true' can make hidden iframes go way too high

		/* Important we know when adding new one on an existing page (matching questions) that we open or close them like 'current state' is set */
		if (sceditor_group_divs_are_closed) {
            $('.sceditor-group:not(:has(a.sceditor-button-keyboard))').hide();//BBCode buttons after they load to remove clutter.
        }

	});


	$('textarea.simpleBBcodeEditor').attr('rows', 5);
	$('textarea.simpleBBcodeEditor').each(function(){

		var displayCountValue = false;
		var characterLimit = 0;
		var pluginsValue = 'bbcode';

		if (typeof ($(this).attr('data-charLimit')) != 'undefined'){
			displayCountValue = true;
			characterLimit = $(this).attr('data-charLimit');
			pluginsValue = 'bbcode, charlimit';
		}

		$('#' + this.id).sceditor({
			id: 'editor_' + this.id,
			plugins: pluginsValue,
			autoExpand: false,
			toolbar: "bold,italic,underline,color,link,symbols|ltr,rtl|keyboard",
			style: BBCODE_CSS,
			resizeEnabled: false,
			displayCount: displayCountValue,
			characterLimit: characterLimit,
			disablePasting: false,
			enablePasteFiltering: true,
			emoticonsEnabled: false,
			runWithoutWysiwygSupport: true // allow to display in non Wysiwyg compatible like mobile phones
		});

		if (sceditor_group_divs_are_closed) {
            $('.sceditor-group:not(:has(a.sceditor-button-keyboard))').hide();//BBCode buttons after they load to remove clutter.
        }

	});



	/*
	 $('textarea.simpleBBcodeEditor')({
	 plugins: "bbcode",
	 style: "minified/jquery.sceditor.default.min.css"
	 });*/


	/*plugins: 'bbcode, charlimit',
	 disablePasting: true,
	 displayCount: true,
	 characterLimit: 20,
	 */





	/** FROM HTML **/



	var loadCSS = function(url, callback){
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;
		link.id = 'theme-style';

		document.getElementsByTagName('head')[0].appendChild(link);

		var img = document.createElement('img');
		img.onerror = function(){
			if(callback) callback(link);
		}
		img.src = url;
	}
	/** END FROM HTML **/

}

function colorText() {

	var input = $('.color-text');

	if((input.val().charAt(0) === '#' && (input.val().length === 4 || input.val().length === 7) ) || input.val().charAt(0) !== '#' && input.val().length >= 3) {
		$('.show-color').show();
		$('.color-click').show();
		$('.sceditor-color-option-custom').css('background-color', input.val());
		$('.sceditor-color-option-custom').attr('data-color', input.val());
	}
	else {
		$('.show-color').hide();
		$('.color-click').hide();
	}

}

function youtubeIdExtract(youtube_id){

	if (youtube_id.indexOf("youtube.com/embed/") != -1) {

		//youtube_id = youtube_id.replace(/http:\/\/www\.youtube\.com\/embed\//,"").substring(0, 11);
		alert('Do not add Embed code. Instead copy the YouTube Video ID or Link for the video to use.');
		return;

	} else if (youtube_id.indexOf("vimeo") != -1) {

		alert('This is a Vimeo video link. Select the Vimeo tab for this video.');
		return;

	} else if (youtube_id.indexOf("youtube") != -1) {

		youtube_id = youtube_id.replace(/^[^v]+v.(.{11}).*/,"$1");

	} else if (youtube_id.indexOf("youtu.be") != -1) {

		youtube_id = youtube_id.replace(/http(s?):\/\/youtu\.be\//,"").substring(0, 11);
	}



	if (youtube_id.length == 11){

		return youtube_id;

	}
	else {
		alert('Video ID must be 11 characters long');
		return;
	}
}


function vimeoIdExtract(vimeoVideo){

	if (vimeoVideo.indexOf("youtube") != -1 || vimeoVideo.indexOf("youtu.be") != -1) {

		alert('This is a YouTube video link. Select the YouTube tab for this video.');
		return;

	} else if (vimeoVideo.indexOf("iframe") != -1) {

		alert('Do not add Embed code');
		return;

	} else if (vimeoVideo.length == 0 || vimeoVideo.indexOf("vimeo.com") == -1 ){

		alert('This is not a valid Vimeo Link. Please check the link and try again.');
		return false;

	}

	/* Start to extract video ID */
	//var vimeo_video_url = vimeoVideo.replace('http://vimeo.com/','');
	//var vimeo_video_id = vimeoVideo.replace('http://player.vimeo.com/video/','');
	var url = vimeoVideo;
	var regExp = /http(s)?:\/\/(www\.)?(player\.)?vimeo.com\/(video\/)?(\d+)($|\/)/;

	var match = url.match(regExp);

	if (!match){

		alert("This is not a valid Vimeo Link. Please check the link and try again.");
		return;
	}
	var vimeo_video_id = match[5];
	return vimeo_video_id;
}
