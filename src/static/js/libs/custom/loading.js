//---------------------------------
//header:  loading plugin
//Author: Clearlove 7*
//Updated: 2016.9.2
//Version: 1.0
//---------------------------------
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		if ("undefined" == typeof jQuery) throw "loading requires jQuery to be loaded first";
		factory(jQuery);
	}
}(function ($) {
	$.fn.loading=function(options){
		$.fn.loading.defaults = {
			size:'4x'
		};
		var opts = $.extend({}, $.fn.loading.defaults, options),
			$this = $(this);
			$this.each(function() {
				if(!$this.is('body')&&$this.css('position')!='absolute'){
					$this.css('position','relative');
				};
				var sizeClass = 'la-'+opts.size;
				var loading = $('<div class="la-line-scale inline-loading '+sizeClass+'"><div></div><div></div><div></div><div></div><div></div></div>');
				var backdrop = $('<div class="modal-backdrop fade in"></div>');
				$this.append(loading);
				loading.css({
					'color':opts.color,
					'margin-top':'-'+loading.height()/2+'px',
					'margin-left':'-'+loading.width()/2+'px'
				});
			});
	};

}));






