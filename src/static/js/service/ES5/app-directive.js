'use strict';

define(['angular', 'moment', 'jquery', 'Ps', 'daterange'], function (angular, moment, $) {
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

	appDirectives.directive('dropDown', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				renderData: '=',
				model: '=?',
				placeholder: '=?',
				clickEvent: '=?'
			},
			template: '\n\t\t\t\t<div class="dropdown">\n\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t<span class="val pull-left" ng-bind="model.name?model.name:placeholder"></span>\n\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</a>\n\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t<li ng-repeat="item in renderData track by $index" ng-bind="item.name" value="item.value" ng-click="itemClick($event, item)"></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {

				$scope.placeholder || ($scope.placeholder = '请选择');
				$scope.model || ($scope.model = { name: '', value: '' });

				$scope.itemClick = function (e, item) {
					delete item.$$hashKey;

					if (item.value == $scope.model.value) {
						e.stopPropagation();
						e.preventDefault();
						return;
					}
					$scope.model = Object.assign({}, item);

					$scope.clickEvent && $scope.clickEvent(e, item);
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
			template: '\n\t\t\t\t<div>\n\t\t\t\t<modal-container>\n\t\t\t\t\t<modal-container-header>{{title}}</modal-container-header>\n\t\t\t\t\t<modal-container-body>\n\t\t\t\t\t\t<div class="config">\n\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t<span>\u7C7B\u522B:</span>\n\t\t\t\t\t\t\t\t<!-- <drop-down render-data="$root.enumData.orderType" model="selectModel.orderType" click-event="itemClick"></drop-down>-->\n\t\t\t\t\t\t\t\t<select chosen placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-model="baz"\n    ng-options=" item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256"></select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="item" ng-if="selectModel.orderType.value == 0">\n\t\t\t\t\t\t\t\t<span>\u8F66\u7CFB:</span>\n\t\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.orderType" model="selectModel.orderType" click-event="itemClick"></drop-down>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="item" ng-if="selectModel.orderType.value == 0">\n\t\t\t\t\t\t\t\t<span>\u8F66\u578B:</span>\n\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="item" ng-if="selectModel.orderType.value == 0">\n\t\t\t\t\t\t\t\t<span>\u8F66\u9876\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.orderType" model="selectModel.orderType" click-event="itemClick"></drop-down>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="item" ng-if="selectModel.orderType.value == 0">\n\t\t\t\t\t\t\t\t<span>\u8F66\u8EAB\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="item" ng-if="selectModel.orderType.value == 0">\n\t\t\t\t\t\t\t\t<span>\u914D\u4EF6:</span>\n\t\t\t\t\t\t\t\t<div class="dropdown">\n\t\t\t\t\t\t\t\t\t<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t\t\t\t\t<span class="val pull-left">\u8BF7\u9009\u62E9</span>\n\t\t\t\t\t\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t\t\t\t\t\t<span class="arrow icon">&#xe792;</span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t\t<li>test</li>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</modal-container-body>\n\t\t\t\t\t<modal-container-footer>\n\t\t\t\t\t\t<div class="price-info">\n\t\t\t\t\t\t\t<p>\u8F66\u4EF7:<i>35800</i></p>\n\t\t\t\t\t\t\t<p>\u8F66\u4EF7:<i>35800</i></p>\n\t\t\t\t\t\t\t<p>\u8F66\u4EF7:<i>35800</i></p>\n\t\t\t\t\t\t\t<p class="total color-bdprimary">\u603B\u4EF7:<i>95800</i></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="btn-wrapper">\n\t\t\t\t\t\t\t<a class="button">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t<a class="button">\u53D6\u6D88</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</modal-container-footer>\n\t\t\t\t</modal-container>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.title = '创建订单';
				$($element).find('.modal').modal();

				$scope.postModel = {
					company: '',
					idCard: ''
				};

				$scope.selectModel = {
					orderType: Object.assign($rootScope.enumData.orderType[0]),
					product: {},
					level1Type: {},
					level2Type: {},
					userId: {},
					data: {},
					promotionId: {},
					storeId: ''
				};

				$scope.selectProductModel = {
					product: {},
					level1Type: {},
					level2Type: {}

					// $scope.itemClick = function(e, item){
					// 	$scope.postModel[attrName] = item.value;
					// }


				};
			}
		}
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
						alert('日期区间不正确');
					}
				}

			}
		};
	});
});