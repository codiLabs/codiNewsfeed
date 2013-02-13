/*!
 * codiNewsfeed jQuery plugin v0.1
 * http://codilabs.com
 *
 *
 * Copyright 2013 codiLabs Indonesia, Inc. and jQuery Library
 * Released not under any license
 * http://codilabs.com/jplugin/codiNewsfeed
 *
 * Date: 2013-02-13
 */

 (function($){
	$.fn.codiNewsfeed=function(settings){
		settings = $.extend({}, $.fn.codiNewsfeed.defaults, settings);
		return this.each(function() {
			//detect if url is empty
			if(settings.url=='') {
				alert("You haven't url parameter, please set it first \n \n $(elem).codiNewsfeed({ \n \t url : target.json.asp \n });");
				return false;
			}

			//rename .....
			var $this = $(this);

			//initializing for new size of element
			/*----------------------------------*/
			var thisOuterHeight = $this.outerHeight()
			var thisHeight = $this.height();
			var thisOuterWidth = $this.outerWidth();
			var thisWidth = $this.width();

			var parentHeight = $this.parent().height();
			var parentWidth = $this.parent().width();
			/*----------------------------------*/
			
			//resize element to a new size
			$this.css({
				height: parentHeight-(thisOuterHeight-thisHeight)+'px',
				width: parentWidth-(thisOuterWidth-thisWidth)+'px',
				overflow: 'hidden'
			});

			//set new elem's values
			var new_content = '';

			//get elem's value
			var myhtml = $this.html().replace(/\s+$/,"");

			//id for new elem childrens
			var elemid = 0;

			//generating new elem's values
			if(myhtml=='') {
				//if elem haven't some text or other elem child, it'll be return to textIfEmpty parameter
				new_content = settings.textIfEmpty;
			} else {
				//reconstructing elem's value
				$this.find("list").each(function(index, elem){
					new_content +=	'<div class="codiNewsfeedBox" id="codiNewsfeedBox_'+elemid+'">'+
														'<span id="codiNewsfeedContent_'+elemid+'">'+
															$(this).html()+
														'</span>'+
													'</div>';
					elemid++;
				});
			}
			
			//if not found any span content, it'll be return to textIfEmpty parameter
			if(new_content=='') {
				new_content = settings.textIfEmpty;
			}
			
			//last id from parameter
			var lastId = settings.lastId;

			//revariabling streamInterval
			var interval = settings.streamInt;
			//start stream for first time
			setTimeout(function() { getStream(lastId, elemid); }, interval);

			//reset elem's value
			$this.html(new_content);

			//Start to getting new stream datas
			/*----------------------------------*/

			//preparing transition speed
			var transition = settings.speedMove;
			var slideDown = (transition/3)*2;
			var fadeIn = transition/2;

			/*---- start of stream -----*/
			//sorry, we're unavailable to write some comments for all proccess below
			function getStream(lastId, elemid) {
				$.ajax({
					type: "GET", url: settings.url, data: 'id='+lastId, cache: false,
					success: function(result){
						var timeforrestream = 0;
						if(result!='') {
							if($this.html()==settings.textIfEmpty) {
								$this.html('');
							}
							var res = jQuery.parseJSON(result);
							var res_temp = new Array();
							for(var i=0; i<res.length; i++) {
								lastId = res[i].id;
								var content = res[i].text;
								$this.prepend('<div class="codiNewsfeedBox" id="codiNewsfeedBox_'+elemid+'">'+
													'<span id="codiNewsfeedContent_'+elemid+'">'+
														content+
													'</span>'+
												'</div>');
								$('#codiNewsfeedBox_'+elemid).hide();
								$('#codiNewsfeedContent_'+elemid).css({opacity:0});

								res_temp[i] = [elemid, timeforrestream];

								timeforrestream += interval+transition;
								elemid++;
							}

							for(var n=0; n<res_temp.length; n++) {
								showNewTicker(res_temp[n]);
							}
						}
						setTimeout(function() { getStream(lastId, elemid); }, interval+timeforrestream);
					} 
				});
			};

			function showNewTicker(res_tmp) {
				setTimeout(function() { 
					$('#codiNewsfeedBox_'+res_tmp[0]).slideDown(slideDown);
					setTimeout(function() {
						$('#codiNewsfeedContent_'+res_tmp[0]).animate({opacity:1}, transition);
					}, slideDown);
				}, res_tmp[1]);
			}
			/*---- end of stream -----*/

		});
	}

	$.fn.codiNewsfeed.defaults = {
		streamInt		: 4000,
		speedMove		: 1000,
		url			: '',
		lastId			: 0,
		textIfEmpty		: 'You haven\'t data',
	};
})(jQuery);
