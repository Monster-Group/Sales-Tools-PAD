define(['angular', 'Hammer'], function(angular,Hammer) {
	'use strict';
	var appTouch = angular.module('app.touch', []);
	var HGESTURES = {
		hmDoubletap: 'doubletap',
		hmDragstart: 'panstart', 
		hmDrag: 'pan', 
		hmDragup: 'panup', 
		hmDragdown: 'pandown', 
		hmDragleft: 'panleft', 
		hmDragright: 'panright', 
		hmDragend: 'panend', 
		hmPanstart: 'panstart',
		hmPan: 'pan',
		hmPanup: 'panup',
		hmPandown: 'pandown',
		hmPanleft: 'panleft',
		hmPanright: 'panright',
		hmPanend: 'panend',
		hmHold: 'press',
		hmPinch: 'pinch',
		hmPinchin: 'pinchin',
		hmPinchout: 'pinchout',
		hmPress: 'press',
		hmRelease: 'release',
		hmRotate: 'rotate',
		hmSwipe: 'swipe',
		hmSwipeup: 'swipeup',
		hmSwipedown: 'swipedown',
		hmSwipeleft: 'swipeleft',
		hmSwiperight: 'swiperight',
		hmTap: 'tap',
		hmTouch: 'touch',
		hmTransformstart: 'transformstart',
		hmTransform: 'transform',
		hmTransformend: 'transformend'
	};
	var HRECOGNIZERS = {
		hmDoubletap: [Hammer.Tap, 'Hammer.Tap'],
		hmDragstart: [Hammer.Pan, 'Hammer.Pan'],
		hmDrag: [Hammer.Pan, 'Hammer.Pan'],
		hmDragup: [Hammer.Pan, 'Hammer.Pan'],
		hmDragdown: [Hammer.Pan, 'Hammer.Pan'],
		hmDragleft: [Hammer.Pan, 'Hammer.Pan'],
		hmDragright: [Hammer.Pan, 'Hammer.Pan'],
		hmDragend: [Hammer.Pan, 'Hammer.Pan'],
		hmPanstart: [Hammer.Pan, 'Hammer.Pan'],
		hmPan: [Hammer.Pan, 'Hammer.Pan'],
		hmPanup: [Hammer.Pan, 'Hammer.Pan'],
		hmPandown: [Hammer.Pan, 'Hammer.Pan'],
		hmPanleft: [Hammer.Pan, 'Hammer.Pan'],
		hmPanright: [Hammer.Pan, 'Hammer.Pan'],
		hmPanend: [Hammer.Pan, 'Hammer.Pan'],
		hmHold: [Hammer.Press, 'Hammer.Press'],
		hmPinch: [Hammer.Pinch, 'Hammer.Pinch'],
		hmPinchin: [Hammer.Pinch, 'Hammer.Pinch'],
		hmPinchout: [Hammer.Pinch, 'Hammer.Pinch'],
		hmPress: [Hammer.Press, 'Hammer.Press'],
		hmRotate: [Hammer.Rotate, 'Hammer.Rotate'],
		hmSwipe: [Hammer.Swipe, 'Hammer.Swipe'],
		hmSwipeup: [Hammer.Swipe, 'Hammer.Swipe'],
		hmSwipedown: [Hammer.Swipe, 'Hammer.Swipe'],
		hmSwipeleft: [Hammer.Swipe, 'Hammer.Swipe'],
		hmSwiperight: [Hammer.Swipe, 'Hammer.Swipe'],
		hmTap: [Hammer.Tap, 'Hammer.Tap']
	};
	var VERBOSE = false;
	angular.forEach(HGESTURES, function(eventName, directiveName) {
		appTouch.directive(directiveName, ['$parse', '$log', '$timeout', 'hammerDefaultOpts', function($parse, $log, $timeout, hammerDefaultOpts) {
			return function(scope, element, attr) {
				var handler;
				attr.$observe(directiveName, function(value) {
					var callback = $parse(value);
					var opts = $parse(attr[directiveName + 'Opts'])(scope, {});
					var defaultOpts = angular.copy(hammerDefaultOpts);

					angular.extend(defaultOpts, opts);

					if(angular.isUndefined(element.hammertime)) {

						// validate that needed recognizer is enabled
						var recognizers = angular.isDefined(defaultOpts.recognizers) ? defaultOpts.recognizers : [];
						var recognizer = HRECOGNIZERS[directiveName];
						if(angular.isDefined(recognizer)) {
							var enabled = false;
							angular.forEach(recognizers, function(r) {
								if(recognizer[0] === r[0]) {
									if(angular.isUndefined(r[1].enable) || r[1].enable === true) {
										enabled = true;
									}
								}
							});
							if(!enabled) {
								throw new Error('Directive ' + directiveName + ' requires gesture recognizer [' + recognizer[1] + '] to be enabled');
							}
						}

						element.hammer = new Hammer.Manager(element[0], defaultOpts);
						scope.$on('$destroy', function() {
							element.hammer.off(eventName);
							element.hammer.destroy();
						});
					}

					handler = function(event) {
						if(VERBOSE) {
							$log.debug('app-touch: ', eventName, event);
						}
						var callbackHandler = function() {
							var cb = callback(scope, {
								$event: event
							});
							if(typeof cb === 'function') {
								cb.call(scope, event);
							}
						};

						if(scope.$root.$$phase === '$apply' ||
							scope.$root.$$phase === '$digest') {
							callbackHandler();
						} else {
							scope.$apply(callbackHandler);
						}

					};
					// register actual event
					element.hammer.on(eventName, handler);
				});
			};
		}]);
	});
	appTouch.provider('hammerDefaultOpts', function HammerDefaultOptsProvider() {
		var opts = {
			
			
		};

		this.set = function(value) {
			angular.extend(opts, value);
		};

		this.$get = function() {
			return opts;
		};
	});
});