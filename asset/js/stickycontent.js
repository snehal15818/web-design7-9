/*
* Sticky Content script v2.0
* Created: July 29th, 2015 by DynamicDrive.com.
* Author: Dynamic Drive at http://www.dynamicdrive.com/
* Visit http://www.dynamicdrive.com/ for full source code
*/

(function ($){

	window.requestAnimationFrame = window.requestAnimationFrame
	    || window.mozRequestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.msRequestAnimationFrame
	    || function(f){return setTimeout(f, 1000/60)}

	$.fn.stickyit=function(options){
		
		var setting = $.extend({}, {clone:false, stickyclass:'sticky'}, options)
		var $body

		return this.each(function(){
			$body = $(document.body)
			var $target = {original: $(this), clone:null}
			var offsets= {top:null, left:null}
			var resizeTimer

			function getCoords(){
				var targetoffset = $target.original.offset()
				offsets.top = targetoffset.top
				offsets.left = targetoffset.left
			}

			getCoords()

			if (setting.clone){
				$target.clone = $target.original.clone(true).css({
					position:'fixed', left:offsets.left, top:0, visibility:'hidden', width:$target.original.width(), height:$target.original.height(), margin:0
				}).appendTo(document.body)
				$target.clone.attr('id', $target.original.attr('id') + '-clone')
			}

			$(window).bind('scroll', function(){
				requestAnimationFrame(function(){
					makesticky($target, offsets, setting)
				})
			})			

			$(window).bind('load resize', function(){
				clearTimeout(resizeTimer)
				resizeTimer = setTimeout(function(){
					if (!setting.clone){
						$target.original.removeClass(setting.stickyclass)
					}
					getCoords()
					if (setting.clone){
						$target.clone.css({left:offsets.left - $(document).scrollLeft()})
					}
					makesticky($target, offsets, setting)
				}, 50)
			})

		})


		function makesticky($target, offsets, setting){
			var scrollTop = $(document).scrollTop()
			var $stickytarget = (setting.clone)? $target.clone : $target.original
			var offsets = (setting.clone)? $target.original.offset() : offsets // grab fresh copy of offset() if in clone mode
			if (scrollTop >= offsets.top){
				if (!$stickytarget.hasClass(setting.stickyclass)){
					$stickytarget.addClass(setting.stickyclass)
					if (setting.clone){
						$target.original.css('visibility', 'hidden')
						$stickytarget.css({visibility: 'visible', left:offsets.left - $(document).scrollLeft()})
					}
				}
			}
			else{
				if ($stickytarget.hasClass(setting.stickyclass)){
					$stickytarget.removeClass(setting.stickyclass)
					if (setting.clone){
						$target.original.css('visibility', 'visible')
						$stickytarget.css('visibility', 'hidden')
					}
				}
			}
		}


	}

})(jQuery);