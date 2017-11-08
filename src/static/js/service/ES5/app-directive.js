'use strict';

define(['angular', 'moment', 'jquery', 'nprogress', 'Ps', 'daterange'], function (angular, moment, $, NProgress) {
	'use strict';

	var appDirectives = angular.module('app.directives', []);
	appDirectives.directive('ngScrollbar', function () {
		return {
			link: function link($scope, $element) {
				$($element).perfectScrollbar();
			}
		};
	});
	appDirectives.directive('ngScrollbarY', function () {
		return {
			link: function link($scope, $element) {
				$($element).perfectScrollbar({
					suppressScrollX: true
				});
			}
		};
	});
	appDirectives.directive('ngFocus', [function () {
		var FOCUS_CLASS = "ng-focused";
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				element.bind('focus', function (evt) {
					element.removeClass(FOCUS_CLASS);
					scope.$apply(function () {
						ctrl.$focused = false;
					});
				}).bind('blur', function (evt) {
					element.addClass(FOCUS_CLASS);
					scope.$apply(function () {
						ctrl.$focused = true;
					});
				});
			}
		};
	}]);
	appDirectives.directive('tdRepeat', function ($timeout) {
		return {
			link: function link($scope, $element, $attrs) {
				if ($scope.$last == true && $scope.$parent.$last == true) {
					var finish = $attrs.tdRepeat;
					$timeout(function () {
						$scope.$eval(finish);
					}, 0);
				}
			}
		};
	});
	appDirectives.directive('ngInput', function ($rootScope, $parse) {
		return {
			template: function template(element, attrs) {
				var type = attrs.type ? attrs.type : 'text';
				var iconLeft = attrs.iconLeft ? attrs.iconLeft.indexOf('{') > -1 ? '<i class="icon icon-left ' + attrs.iconLeft + '"></i>' : '<i class="icon icon-left">' + attrs.iconLeft + '</i>' : '';
				var iconRight = attrs.iconRight ? attrs.iconRight.indexOf('{') > -1 ? '<i class="icon icon-right ' + attrs.iconRight + '"></i>' : '<i class="icon icon-right">' + attrs.iconRight + '</i>' : '';
				var placeholder = attrs.placeholder ? 'placeholder="' + attrs.placeholder + '"' : '';
				var errorLable = '';
				var valid = '';
				var name = attrs.name ? 'name="' + attrs.name + '"' : '';
				var model = attrs.model ? 'ng-model="' + attrs.model + '"' : '';
				var focus = attrs.model ? 'ng-focus' : '';
				if (attrs.valid) {
					var required = attrs.required ? attrs.required : '';
					var minlength = attrs.min ? attrs.min : '';
					var maxlength = attrs.max ? attrs.max : '';
					var pattern = attrs.pattern ? attrs.pattern : '';
					switch (type) {
						case 'email':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.email" class="error-lable">请输入正确的电子邮件格式</span>';
							break;
						case 'number':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.number" class="error-lable">请输入正确的数字</span>';
							break;
						case 'url':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.url" class="error-lable">请输入正确的URL</span>';
							break;
						default:
					}
					if (required != '') {
						valid += ' required=' + required;
						errorLable += '<span ng-show="(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.' + attrs.name + '.$touched)||(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.$submitted)" class="error-lable">内容不可为空</span>';
					}
					if (minlength != '') {
						valid += ' ng-minlength=' + minlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.minlength" class="error-lable">内容不可少于' + minlength + '个字</span>';
					}
					if (maxlength != '') {
						valid += ' ng-maxlength=' + maxlength;
						valid += ' maxlength=' + maxlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.maxlength" class="error-lable">内容不可多于' + maxlength + '个字</span>';
					}
					if (pattern != '') {
						valid += ' ng-pattern=' + pattern;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.pattern" class="error-lable">您输入的格式不正确</span>';
					}
				};
				return '<div class="clearfix default-input">' + iconLeft + iconRight + '<input  type="' + type + '" ' + valid + ' ' + model + ' ' + placeholder + ' ' + name + ' ' + focus + ' autocomplete="off" />' + errorLable + '</div>';
			},
			replace: true,
			controller: function controller($scope, $element, $attrs) {
				var opt = $parse($attrs.opt)($scope);
				var $this = $($element);
				if (opt && opt.class) {
					$this.addClass(opt.class);
				}
			}
		};
	});
	appDirectives.directive('dateRangePicker', function ($rootScope, $parse) {
		return {
			template: '<div class="clearfix default-input date-range-picker-wrapper"><i class="icon icon-right" ng-click="pickerToggle()">&#xe618;</i><input class="date-range-picker" readonly="readonly"/></div>',
			replace: true,
			scope: {
				model: '=',
				apply: '=?',
				opt: '=options',
				picker: '=?'
			},
			controller: function controller($scope, $element, $attrs) {
				var $this = $($element);
				var $input = $this.find('input');
				var size = $attrs.size ? $attrs.size : null;
				var opt = $scope.opt ? $scope.opt : {};
				var thisClass = $attrs.class;
				var noToday = $attrs.noToday ? true : false;
				var options, startDate, endDate;
				if (!noToday) {
					startDate = moment();
					endDate = moment();
					options = {
						size: size,
						maxDate: moment(),
						ranges: {
							'今天': [moment(), moment()],
							'最近7天': [moment().subtract(6, 'days'), moment()],
							'最近14天': [moment().subtract(13, 'days'), moment()],
							'最近30天': [moment().subtract(29, 'days'), moment()]
						}
					};
				} else {
					startDate = moment().subtract(7, 'days');
					endDate = moment().subtract(1, 'days');
					options = {
						size: size,
						maxDate: moment().subtract(1, 'days'),
						startDate: moment().subtract(7, 'days'),
						endDate: moment().subtract(1, 'days'),
						ranges: {
							'最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
							'最近14天': [moment().subtract(14, 'days'), moment().subtract(1, 'days')],
							'最近30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
						}
					};
				};
				var opts = $.extend({}, options, opt);
				if (!$attrs.free) {
					opts.minDate = moment().subtract(90, 'days');
				};
				if (!$scope.model || $scope.model == '') {
					$scope.model = undefined;
				} else {
					opts.startDate = moment($scope.model.split('|')[0]);
					opts.endDate = moment($scope.model.split('|')[1]);
				};
				$this.addClass(thisClass);
				$input.daterangepicker(opts);
				$scope.picker = $input.data('daterangepicker');
				$scope.pickerToggle = function () {
					$scope.picker.show();
				};
				$input.on('show.daterangepicker', function () {
					$this.addClass('open');
				});
				$input.on('hide.daterangepicker', function () {
					$this.removeClass('open');
				});
				$input.on('apply.daterangepicker', function (ev, picker) {
					console.log(picker);
					$(this).val(picker.chosenLabel != '自定义时间' ? picker.chosenLabel : picker.startDate.format('YYYY-MM-DD') == picker.endDate.format('YYYY-MM-DD') ? picker.startDate.format('YYYY-MM-DD') : picker.startDate.format('YYYY-MM-DD') + '至' + picker.endDate.format('YYYY-MM-DD'));
					$scope.model = picker.startDate.format('YYYY-MM-DD') + '|' + picker.endDate.format('YYYY-MM-DD');
					$rootScope.$digest();
					if ($scope.apply) {
						$scope.apply();
					}
				});
			}
		};
	});
	appDirectives.directive('rangeDateValidate', function () {
		return {
			link: function link($scope, $elements, $attrs) {
				var $start = $($elements).find('.start-date'),
				    $end = $($elements).find('.end-date');

				$start.off('change').on('change', function () {
					compare();
				});

				$end.off('change').on('change', function () {
					compare();
				});

				function compare(start, end) {
					var startDate = $start.val();
					var endDate = $end.val();
					console.log(startDate, endDate);
					if (startDate && endDate && startDate > endDate) {
						$($elements).addClass('error');
					} else {
						$($elements).removeClass('error');
					}
				}
			}
		};
	});

	appDirectives.directive('dropDown', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				display: '=?',
				renderData: '=',
				model: '=?',
				placeholder: '=?',
				clickEvent: '=?'
			},
			template: '\n\t\t\t\t<div class="dropdown">\n\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t<span class="val pull-left" ng-bind="displayName"></span>\n\t\t\t\t\t\t<i class="arrow icon pull-right">&#xe792;</i>\n\t\t\t\t\t</a>\n\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t<li ng-repeat="item in renderData track by $index" ng-bind="item[display]"  hm-tap="itemClick($event, item)"></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.display = $scope.display ? $scope.display : 'name';
				console.log($scope.display);
				$scope.placeholder || ($scope.placeholder = '请选择');
				$scope.model || ($scope.model = {
					name: '',
					value: ''
				});
				$scope.displayName = $scope.model[$scope.display] ? $scope.model[$scope.display] : $scope.placeholder;
				$scope.itemClick = function (e, item) {
					delete item.$$hashKey;
					if (item[$scope.display] == $scope.displayName) {
						e.stopPropagation();
						e.preventDefault();
						return;
					}
					//					console.log(666)
					$scope.model = Object.assign({}, item);
					$scope.displayName = $scope.model[$scope.display];
					$scope.clickEvent && $scope.clickEvent(e, item);
					//					console.log(666)
				};
			}
		};
	});

	appDirectives.directive('modalContainer', function () {
		return {
			restrict: 'E',
			transclude: {
				'header': 'modalContainerHeader',
				'body': 'modalContainerBody',
				'footer': 'modalContainerFooter'
			},
			replace: true,
			template: '\n\t\t\t\t<div class="modal fade custom-modal add-order-modal in" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t\t<div class="modal-header" ng-transclude="header">\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="modal-body" ng-transclude="body">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="modal-footer" ng-transclude="footer">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {}
		};
	});

	appDirectives.directive('newOrder', function ($rootScope) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			template: '\n\t\t\t\t<div class="modal fade custom-modal" style="display:block;"  tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t\t<div class="modal-header">{{title}}</div>\n\t\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t\t<form id="orderForm" name="orderForm" novalidate onsubmit="return false;">\n\t\t\t\t\t\t\t\t<div class="config">\n\t\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t\t<span>\u7C7B\u522B:</span>\n\t\t\t\t\t\t\t\t\t\t<select chosen  placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-model="orderModel.orderType"\n\t\t    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" conver-to-number>\n\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t    \t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u7CFB:</span>\n\t\t\t\t\t\t\t\t\t\t <select chosen multiple placeholder-text-multiple="\'\u8BF7\u9009\u62E9\'"\n\t\t    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-model="orderModel.product">\n\t\t    \t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u578B:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u9876\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.orderType" click-event="itemClick"></drop-down>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u8EAB\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u914D\u4EF6:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u4F18\u60E0:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u95E8\u5E97:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u95E8\u5E97:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8EAB\u4EFD\u8BC1:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" ng-model="orderModel.cardId" type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u516C\u53F8:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5206\u7C7B1:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5206\u7C7B2:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5546\u54C1:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u63D0\u8D27\u5730\u70B9:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t<div class="price-info" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t<p>\u8F66\u4EF7:<i>35800</i></p>\n\t\t\t\t\t\t\t\t<p>\u914D\u4EF6:<i>35800</i></p>\n\t\t\t\t\t\t\t\t<p>\u6D3B\u52A8\u4F18\u60E0:<i>35800</i></p>\n\t\t\t\t\t\t\t\t<p class="total color-bdprimary">\u603B\u4EF7:<i>95800</i></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="price-info" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t<p>\u603B\u4EF7:<i>000</i></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="btn-wrapper">\n\t\t\t\t\t\t\t\t<a class="button">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t\t<a class="button" hm-tap="closeModal">\u53D6\u6D88</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.title = '创建订单';
			},
			link: function link($scope, $elements, $attrs, controllers) {
				$scope.$modal = $($elements);
				var orderModelDefault = {
					orderType: '',
					product: '',
					level1Type: '',
					level2Type: '',
					userId: '',
					data: '',
					promotionId: '',
					storeId: '',
					idCard: '',
					company: ''
				};
				var productModelDefault = {
					product: '',
					level1Type: '',
					level2Type: '',
					storeId: ''
				};

				$scope.orderModel && ($scope.orderModel = Object.assign({}, orderModelDefault));
				$scope.productModel && ($scope.productModel = Object.assign({}, productModelDefault));

				$scope.closeModal = function () {
					$scope.$modal.modal('toggle');
				};

				$scope.submit = function () {
					if ($scope.orderForm.$valid) {
						alert('提交');
					}
				};

				$scope.$modal.on('hide.bs.modal', function () {
					if ($scope.orderForm.$dirty) {
						$scope.orderModel = Object.assign({}, orderModelDefault);
						$scope.productModel = Object.assign({}, productModelDefault);
						$scope.orderForm.$setPristine();
						$scope.orderForm.$setUntouched();
					}
				});
			}
		};
	});
	//单选
	//<select chosen  placeholder-text-single="'请选择'" ng-model="selectModel.orderType"
	//    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" conver-to-number>
	//								<option value="">请选择</option>
	//    							</select>
	//多选
	// <select chosen multiple placeholder-text-multiple="'请选择'"
	//    ng-options="item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-model="selectModel.product">
	//    					

	appDirectives.directive('orderDetail', function ($rootScope, appApi) {
		return {
			restrict: 'E',
			scope: {
				orderId: '='
			},
			replace: true,
			template: '\n\t\t\t\t<div class="order-info">\n\t\t\t\t\t<header class="clearfix">\n\t\t\t\t\t\t<a class="button pull-left" hm-tap="back">\u8FD4\u56DE</a>\n\t\t\t\t\t\t<span class="pull-left">\u8BA2\u5355\u8BE6\u60C5&nbsp;&nbsp;(\u7F16\u53F7:{{orderDetail.orderNo}})</span>\n\t\t\t\t\t</header>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8D2D\u8F66\u4EBA\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA:</span><i>{{orderDetail.buyerName}} {{\'(\' + (orderDetail.gender | formatGender) + \')\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u8BC1\u4EF6\u53F7\u7801:</span><i>{{orderDetail.buyerIdCard}}</i >\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u59D3\u540D:</span><i>{{orderDetail.buyerName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8BA2\u5355\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type != 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u540D\u79F0:</span><i>{{orderDetail.promotionName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u6761\u6B3E:</span><i>{{orderDetail.terms}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u91D1\u989D:</span><i>{{orderDetail.discountPrice}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u5730\u5740:</span><i>ccccc</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u516C\u53F8:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65F6\u95F4:</span><i>15012119780906771X1501</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.deliveryStageName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u91D1\u989D:</span><i>{{orderDetail.discountPrice  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u539F\u4EF7:</span><i>{{orderDetail.productPrice | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u73B0\u4EF7:</span><i>{{(orderDetail.productPrice - orderDetail.discountPrice)  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type == 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>15012119780906771X150121</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8D27\u5730\u5740:</span><i>15012119780906771X1501</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65F6\u95F4:</span><i>{{orderDetail.formatPaymentTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.deliveryStageName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4EF7\u683C:</span><i>{{orderDetail.amount  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info">\n\t\t\t\t\t\t<h3 class="clearfix">\n\t\t\t\t\t\t\t<span class="channel">\u652F\u4ED8\u6E20\u9053</span>\n\t\t\t\t\t\t\t<span class="pay-no">\u652F\u4ED8\u53F7</span>\n\t\t\t\t\t\t\t<span class="pay-amount">\u652F\u4ED8\u91D1\u989D</span>\n\t\t\t\t\t\t\t<span class="pay-date">\u652F\u4ED8\u65F6\u95F4</span>\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in payment track by $index">\n\t\t\t\t\t\t\t\t<span class="channel">{{item.channel | formatChannel}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-no">{{item.paymentId}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-amount">{{item.amount}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-date">{{item.paymentTimeFormat}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-footer">\n\t\t\t\t\t\t\t<a class="button">\u65B0\u589E\u652F\u4ED8\u4FE1\u606F</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info" ng-show="carInfo.VIN">\n\t\t\t\t\t\t<h3 class="clearfix">\u8F66\u8F86\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in carInfo track by $index">\n\t\t\t\t\t\t\t\t<span class="vin">VIN:{{item.VIN }}</span>\n\t\t\t\t\t\t\t\t<span class="vsn">VSN: {{item.VSN}}</span>\n\t\t\t\t\t\t\t\t<span class="">\u53D1\u52A8\u673A\u53F7\uFF1A{{item.no}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block appoint-info" ng-show="appoints.length > 0">\n\t\t\t\t\t\t<h3 class="clearfix">\u9080\u7EA6\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in appoints track by $index">\n\t\t\t\t\t\t\t\t<span class="appoint">{{item.deliveryStageName}}:  {{item.buyerName}} {{item.time}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				var orderId;
				$scope.back = function () {
					// $scope.detailShow = false;
					$scope.$emit('detailClose');
				};

				function getData(orderType, orderNo) {
					//订单详情
					appApi.getOrderDetail({ orderId: orderId }, function (data) {
						data.formatCreatedTime = moment(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
						data.formatConfirmTime = !data.confirmTime ? '--' : moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss");
						$scope.orderDetail = data;
						NProgress.done();
					});
					//支付信息
					appApi.getPayment({ orderNo: orderNo }, function (data) {
						$scope.payment = data.map(function (item) {
							item.paymentTimeFormat = moment(item.paymentTime).format("YYYY-MM-DD HH:mm:ss");
						});
					});

					//代办事项
					appApi.getAppointById({ orderId: orderId }, function (data) {
						$scope.appoints = data.map(function (item) {
							if (item.reservationStartTime && item.reservationEndTime) var startDay = moment(item.reservationStartTime).format('YYYY-MM-DD');
							var endDay = moment(item.reservationEndTime).format('YYYY-MM-DD');
							if (startDay == endDay) {
								var startTime = moment(item.reservationStartTime).format('HH:mm');
								var endTime = moment(item.reservationEndTime).format('HH:mm');
								item.time = startDay + ' ' + startTime + '-' + endTime;
							} else {
								var startTime = moment(item.reservationStartTime).format('YYYY-MM-DD HH:mm');
								var endTime = moment(item.reservationEndTime).format('YYYY-MM-DD HH:mm');
								item.time = startTime + '-' + endTime;
							}
							return item;
						});
					});

					//车辆详情
					if (orderType != '1') {
						appApi.getCarInfo({ orderId: orderId }, function (data) {
							$scope.carInfo = data;
						});
					}
				}

				$scope.$on('showDetail', function (e, data) {
					NProgress.start();
					// $scope.detailShow = true;

					if (orderId != data.orderId) {
						orderId = data.orderId;
						getData(data.type, data.orderNo);
					}
				});
			}
		};
	});
	appDirectives.directive('addPay', function ($rootScope) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			template: '\n\t\t\t<div class="modal fade custom-modal" style="display:block;" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t<div class="modal-header">\n\t\t\t\t\t\t\t\u652F\u4ED8\u4FE1\u606F(\u7F16\u53F7\uFF1A89757)\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u91D1\u989D&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<input type="number" class="default-input"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u7C7B\u578B&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u6D41\u6C34\u53F7&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<input type="number" class="default-input"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item special">\n\t\t\t\t\t\t\t\t\t<span>\u5907\u6CE8&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<textarea class="default-textarea"></textarea>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item special">\n\t\t\t\t\t\t\t\t\t<span>\u4E0A\u4F20\u51ED\u8BC1&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<div class="img-list">\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<img src="./static/7498226.jpg" width="100px" height="100px"/>\n\t\t\t\t\t\t\t\t\t\t\t\t<a class="cycle-button del-img icon">&#xe60e;</a>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t<a class="button">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t<a class="button" data-dismiss="modal">\u53D6\u6D88</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {}
		};
	});
});