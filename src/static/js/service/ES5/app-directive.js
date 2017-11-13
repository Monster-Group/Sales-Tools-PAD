'use strict';

define(['angular', 'moment', 'jquery', 'nprogress', 'upload', 'toastr', 'Ps', 'daterange'], function (angular, moment, $, NProgress, oss, toastr) {
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
				display: '=?', //显示名字字段
				renderData: '=', //渲染下拉列表数据  [{},{}]
				model: '=?', //接受数据model   直接为选项的val值
				placeholder: '=?', //默认显示文字
				clickEvent: '=?', //选项点击回调事件，参数$event,item   item为所点击选项的整个对象
				val: '=?' //点击选项取值的字段名
			},
			template: '\n\t\t\t\t<div class="dropdown">\n\t\t\t\t\t<a href="#" data-toggle="dropdown" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">\n\t\t\t\t\t\t<span class="val pull-left" ng-bind="displayName"></span>\n\t\t\t\t\t\t<i class="arrow icon pull-right">&#xe792;</i>\n\t\t\t\t\t</a>\n\t\t\t\t\t<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">\n\t\t\t\t\t\t<li hm-tap="itemClick($event, \'\')">\u8BF7\u9009\u62E9</li>\n\t\t\t\t\t\t<li ng-repeat="item in renderData track by $index" ng-bind="item[display]"  hm-tap="itemClick($event, item)"></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t',
			link: function link($scope, $elements, $attrs, controllers) {
				$($elements).find('.dropdown-toggle').on('tap', function (e) {
					$(this).dropdown('toggle');
					e.stopPropagation();
					e.preventDefault();
				});
			},
			controller: function controller($scope, $element, $attrs) {
				var getDisplayName = function getDisplayName(val) {
					var name = '';
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = $scope.renderData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var item = _step.value;

							if (item[$scope.val] == val) {
								name = item[$scope.display];
							}
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}

					return name;
				};
				$scope.val = $scope.val ? $scope.val : 'value';
				$scope.display = $scope.display ? $scope.display : 'name';
				$scope.placeholder || ($scope.placeholder = '请选择');
				$scope.displayName = $scope.model === undefined || $scope.model === '' ? $scope.placeholder : getDisplayName($scope.model);
				$scope.itemClick = function (e, item) {
					delete item.$$hashKey;
					if (item[$scope.val] == $scope.model) {
						e.preventDefault();
						return false;
					}
					$scope.model = item[$scope.val];
					$scope.clickEvent && $scope.clickEvent(e, item);
				};
				var watch = $scope.$watch('model', function (newVal, oldVal) {
					if (newVal != oldVal) {
						$scope.displayName = $scope.model === undefined || $scope.model === '' ? $scope.placeholder : getDisplayName($scope.model);
					}
				});
				$scope.$on('$destroy', function () {
					watch();
				});
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
			template: '\n\t\t\t\t<div class="order-info">\n\t\t\t\t\t<header class="clearfix">\n\t\t\t\t\t\t<a class="button pull-left" hm-tap="back">\u8FD4\u56DE</a>\n\t\t\t\t\t\t<span class="pull-left">\u8BA2\u5355\u8BE6\u60C5&nbsp;&nbsp;(\u7F16\u53F7:{{orderDetail.orderNo}})</span>\n\t\t\t\t\t</header>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8D2D\u8F66\u4EBA\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA:</span><i>{{orderDetail.buyerName}} {{\'(\' + (orderDetail.gender | formatGender) + \')\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u8BC1\u4EF6\u53F7\u7801:</span><i>{{orderDetail.buyerIdCard}}</i >\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u59D3\u540D:</span><i>{{orderDetail.buyerName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8BA2\u5355\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type != 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u540D\u79F0:</span><i>{{orderDetail.promotionName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u6761\u6B3E:</span><i>{{orderDetail.terms}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u91D1\u989D:</span><i>{{orderDetail.discountPrice}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u5730\u5740:</span><i>ccccc</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u516C\u53F8:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65F6\u95F4:</span><i>15012119780906771X1501</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.deliveryStageName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u91D1\u989D:</span><i>{{orderDetail.discountPrice  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u539F\u4EF7:</span><i>{{orderDetail.productPrice | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u73B0\u4EF7:</span><i>{{(orderDetail.productPrice - orderDetail.discountPrice)  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type == 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>15012119780906771X150121</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8D27\u5730\u5740:</span><i>15012119780906771X1501</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65F6\u95F4:</span><i>{{orderDetail.formatPaymentTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.deliveryStageName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4EF7\u683C:</span><i>{{orderDetail.amount  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info">\n\t\t\t\t\t\t<h3 class="clearfix">\n\t\t\t\t\t\t\t<span class="channel">\u652F\u4ED8\u6E20\u9053</span>\n\t\t\t\t\t\t\t<span class="pay-no">\u652F\u4ED8\u53F7</span>\n\t\t\t\t\t\t\t<span class="pay-amount">\u652F\u4ED8\u91D1\u989D</span>\n\t\t\t\t\t\t\t<span class="pay-date">\u652F\u4ED8\u65F6\u95F4</span>\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in payment track by $index">\n\t\t\t\t\t\t\t\t<span class="channel">{{item.channel | formatChannel}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-no">{{item.paymentId}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-amount">{{item.amount}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-date">{{item.paymentTimeFormat}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-footer">\n\t\t\t\t\t\t\t<a class="button" hm-tap="addPay()">\u65B0\u589E\u652F\u4ED8\u4FE1\u606F</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info" ng-show="carInfo.VIN">\n\t\t\t\t\t\t<h3 class="clearfix">\u8F66\u8F86\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in carInfo track by $index">\n\t\t\t\t\t\t\t\t<span class="vin">VIN:{{item.VIN }}</span>\n\t\t\t\t\t\t\t\t<span class="vsn">VSN: {{item.VSN}}</span>\n\t\t\t\t\t\t\t\t<span class="">\u53D1\u52A8\u673A\u53F7\uFF1A{{item.no}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block appoint-info" ng-show="appoints.length > 0">\n\t\t\t\t\t\t<h3 class="clearfix">\u9080\u7EA6\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in appoints track by $index">\n\t\t\t\t\t\t\t\t<span class="appoint">{{item.deliveryStageName}}:  {{item.buyerName}} {{item.time}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				var orderId, orderNo;
				$scope.back = function () {
					// $scope.detailShow = false;
					$scope.$emit('detailClose');
				};
				var loadPayInfo = function loadPayInfo(orderNo) {
					appApi.getPayment({
						orderNo: orderNo
					}, function (data) {
						$scope.payment = data.map(function (item) {
							item.paymentTimeFormat = moment(item.paymentTime).format("YYYY-MM-DD HH:mm:ss");
							return item;
						});
					});
				};
				function getData(orderType, orderNo) {
					//订单详情
					appApi.getOrderDetail({
						orderId: orderId
					}, function (data) {
						data.formatCreatedTime = moment(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
						data.formatConfirmTime = !data.confirmTime ? '--' : moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss");
						$scope.orderDetail = data;
						NProgress.done();
					});
					//支付信息
					loadPayInfo(orderNo);

					//代办事项
					appApi.getAppointById({
						orderId: orderId
					}, function (data) {
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
						appApi.getCarInfo({
							orderId: orderId
						}, function (data) {
							$scope.carInfo = data;
						});
					}
				}
				$scope.addPay = function () {
					$scope.$emit('addPay');
				};
				var getPayInfo = $rootScope.$on('loadPayInfo', function (e, data) {
					loadPayInfo(orderNo);
				});
				var showDetail = $scope.$on('showDetail', function (e, data) {
					NProgress.start();
					// $scope.detailShow = true;
					if (orderId != data.orderId) {
						orderId = data.orderId;
						orderNo = data.orderNo;
						getData(data.type, data.orderNo);
					}
				});
				$scope.$on('$destory', function () {
					getPayInfo();
					showDetail();
				});
			}
		};
	});
	appDirectives.directive('addPay', function ($rootScope, appApi) {
		return {
			restrict: 'E',
			scope: {
				orderNo: '='
			},
			replace: true,
			template: '\n\t\t\t<div class="modal fade custom-modal" style="display:block;" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t<div class="modal-header">\n\t\t\t\t\t\t\t\u652F\u4ED8\u4FE1\u606F(\u7F16\u53F7\uFF1A<i ng-bind="orderNo"></i>)\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t<form name="payInfoForm" novalidate>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u91D1\u989D&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<input type="number" class="transition-02 default-input" ng-model="payInfo.amount" name="amount" required ng-class="{\'error\':payInfoForm.$submitted&&payInfoForm.amount.$invalid}" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u7C7B\u578B&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<drop-down class="transition-02" ng-class="{\'error\':payInfoForm.$submitted&&(payInfo.channel===undefined||payInfo.channel===\'\')}" render-data="$root.enumData.payChannel" model="payInfo.channel"></drop-down>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u6D41\u6C34\u53F7&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<input type="text" class="transition-02 default-input" ng-model="payInfo.outTradeNo" name="outTradeNo" required ng-class="{\'error\':payInfoForm.$submitted&&payInfoForm.outTradeNo.$invalid}" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item special">\n\t\t\t\t\t\t\t\t\t<span>\u5907\u6CE8&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<textarea class="transition-02 default-textarea" ng-model="payInfo.comment" name="comment" required ng-class="{\'error\':payInfoForm.$submitted&&payInfoForm.comment.$invalid}"></textarea>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item special">\n\t\t\t\t\t\t\t\t\t<span>\u4E0A\u4F20\u51ED\u8BC1&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<div class="img-list">\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t<a class="uplaod-btn" ng-class="{\'uploading\':uploading}">\n\t\t\t\t\t\t\t\t\t\t\t\t<span ng-bind="percent"></span>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<li ng-repeat="item in imgUrl">\n\t\t\t\t\t\t\t\t\t\t\t\t<img src="{{item}}"/>\n\t\t\t\t\t\t\t\t\t\t\t\t<a class="cycle-button del-img icon" hm-tap="delImg($index)">&#xe60e;</a>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t<span class="error-msg" ng-show="payInfoForm.$submitted&&!payInfo.imgUrl">\u8BF7\u81F3\u5C11\u4E0A\u4F20\u4E00\u5F20\u56FE\u7247</span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t<a class="button" hm-tap="submitPayInfo()">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t<a class="button" data-dismiss="modal">\u53D6\u6D88</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.$modal = $($element);
				$scope.initUpload = false;
				$scope.ossInit = function () {
					var $container = $($element).find('.img-list');
					var obj = {};
					obj.container = $container[0];
					obj.browserBtn = $container.find('.uplaod-btn')[0];
					obj.dir = 'myfolder'; // 上传到哪个目录下
					obj.prefix = 'pay_'; // 上传过后文件名的前缀,可以根据功能模块命名
					obj.fileType = 'picture'; // 可以是picture或video, 支持的格式在upload.js中
					obj.beforeUpload_fn = function () {
						$scope.$apply(function () {
							$scope.percent = 0 + '%';
						});
					};
					obj.uploading_fn = function (percent) {
						// 上传中的回调
						$scope.$apply(function () {
							$scope.uploading = true;
							$scope.percent = percent + '%';
						});
						console.log('上传进度：' + percent + ' %');
					};
					obj.success_fn = function (data) {
						// 上传成功后的回调
						console.log(data);
						$scope.$apply(function () {
							$scope.uploading = false;
							$scope.imgUrl.push(data.fileUrl);
						});
					};
					obj.error_fn = function () {
						$scope.$apply(function () {
							$scope.uploading = false;
						});
					};
					oss.init([obj]); // 页面可配置多个上传,放到数组中一起init
					$scope.initUpload = true;
				};
				$scope.uploading = false;
				$scope.imgUrl = [];
				$scope.delImg = function (i) {
					$scope.imgUrl.splice(i, 1);
				};
				$scope.submitPayInfo = function () {
					$scope.payInfoForm.$submitted = true;
					if ($scope.payInfoForm.$valid && $scope.payInfo.channel && $scope.imgUrl.length > 0) {
						$scope.payInfo.imgUrl = $scope.imgUrl.join();
						console.log($scope.payInfo);
						appApi.savePaymentOrder($scope.payInfo, function (data) {
							console.log(1231323);
							toastr.success('提交成功');
							$scope.$modal.modal('hide');
							$rootScope.$broadcast('loadPayInfo');
						});
					}
				};
				$scope.$modal.on('shown.bs.modal', function () {
					if (!$scope.initUpload) {
						$scope.ossInit();
					}
				});
				$scope.$modal.on('hide.bs.modal', function () {
					if ($scope.payInfoForm.$dirty) {
						$scope.payInfo = {};
					};
					$scope.uploading = false;
					$scope.imgUrl = [];
					$scope.payInfoForm.$setPristine();
					$scope.payInfoForm.$setUntouched();
				});
				var showAddPay = $scope.$on('showAddPay', function (e, id) {
					$scope.$modal.modal('show');
					$scope.orderNo = id;
					$scope.payInfo = {
						orderNo: $scope.orderNo,
						paymentTimeStr: moment().format('YYYY-MM-DD HH:mm:ss')
					};
				});
				$scope.$on('$destory', function () {
					showAddPay();
				});
			}
		};
	});
	appDirectives.directive('clientUpdate', function ($rootScope, appApi) {
		return {
			restrict: 'E',
			scope: {
				id: '=?',
				type: '='
			},
			replace: true,
			template: '\n\t\t\t<form name="clientForm" novalidate>\n\t\t\t\t<div class="info-block">\n\t\t\t\t\t<h3>\u57FA\u672C\u4FE1\u606F:</h3>\n\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t<div ng-if="type==1">\n\t\t\t\t\t\t\t<span>ID:<i ng-bind="detailModel.userId"></i></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u59D3\u540D:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="name" ng-model="detailModel.realname" required ng-class="{\'error\':clientForm.$submitted&&clientForm.name.$invalid}" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u6027\u522B:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.gender" model="detailModel.sex" ng-class="{\'error\':clientForm.$submitted&&(detailModel.sex===undefined||detailModel.sex===\'\')}"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5E74\u9F84:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.age" model="detailModel.age"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u751F\u65E5:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="date" name="birthdayStr" ng-model="detailModel.birthdayStr" ng-if="detailModel.birthdayStr"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u624B\u673A\u53F7:</span>\n\t\t\t\t\t\t\t<input class="default-input" ng-readonly="type==1" type="text" name="mobile" ng-model="detailModel.mobile" required ng-class="{\'error\':clientForm.$submitted&&clientForm.mobile.$invalid}"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>QQ:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="qq" ng-model="detailModel.qq" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5FAE\u4FE1:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="wechatNumber" ng-model="detailModel.wechatNumber" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u90AE\u7BB1:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="email" ng-model="detailModel.email" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u6237\u7C4D:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="censusRegister" ng-model="detailModel.censusRegister" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u7701:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.regionList" model="detailModel.province" display="\'provinceName\'" val="\'provinceId\'" click-event="provinceClick" ng-class="{\'error\':clientForm.$submitted&&!detailModel.province}"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5E02:</span>\n\t\t\t\t\t\t\t<drop-down render-data="cityList" model="detailModel.city" display="\'cityName\'" val="\'cityId\'" ng-class="{\'error\':clientForm.$submitted&&!detailModel.city}"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5BB6\u5EAD\u4F4F\u5740:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="homeAddress" ng-model="detailModel.homeAddress" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5C0F\u533A:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="plot" ng-model="detailModel.plot" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u5DF2\u5A5A:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isMarried"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u6709\u5C0F\u5B69:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isKid"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5DE5\u4F5C\u5355\u4F4D:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="company" ng-model="detailModel.company" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u804C\u52A1:</span>\n\t\t\t\t\t\t\t<input class="default-input" type="text" name="job" ng-model="detailModel.job" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5B66\u5386:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.education" model="detailModel.education"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u7528\u6237\u72B6\u6001:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.userStatus" model="detailModel.userStatus"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u7B49\u7EA7:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.userLevel" model="detailModel.userLv"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u6709\u8D60\u54C1:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isGift"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u6709\u6295\u8BC9:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isComplain"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u8981\u56DE\u8BBF:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isVisit"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="info-block">\n\t\t\t\t\t<h3>\u8D2D\u4E70\u610F\u5411:</h3>\n\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u6709\u8F66:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isCar"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5DF2\u6709\u8F66\u578B:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="haveCar" ng-model="detailModel.haveCar"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u6709\u8F66\u5E74\u9650:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="number" name="haveCarYear" ng-model="detailModel.haveCarYear"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5DF2\u6709\u8F66\u4FDD\u9669\u4EF7\u683C:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="carInsurancePrice" ng-model="detailModel.carInsurancePrice" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u5DF2\u6709\u8F66\u4FDD\u9669\u79CD\u5185\u5BB9:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="carInsuranceContent" ng-model="detailModel.carInsuranceContent" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u5DF2\u8BD5\u9A7E:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isTestDrive"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="has-textarea">\n\t\t\t\t\t\t\t<span>\u8BD5\u9A7E\u53CD\u9988:</span>\n\t\t\t\t\t\t\t<textarea class="default-textarea" ng-model="detailModel.testDriveFeedback" rows="4"></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="has-textarea">\n\t\t\t\t\t\t\t<span>\u4EA7\u54C1\u5EFA\u8BAE:</span>\n\t\t\t\t\t\t\t<textarea class="default-textarea" ng-model="detailModel.productProposal" rows="4"></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="has-textarea">\n\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u610F\u5411:</span>\n\t\t\t\t\t\t\t<textarea class="default-textarea" ng-model="detailModel.buyInclination" rows="4"></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u51E0\u4E2A\u8F66\u4F4D:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="carportNumber" ng-model="detailModel.carportNumber" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u8F66\u4F4D\u60C5\u51B5:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="carportCondition" ng-model="detailModel.carportCondition" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u80FD\u5145\u7535:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isRecharge"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u8D2D\u8F66\u4F7F\u7528\u4EBA:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.carUser" model="detailModel.buyCarUser"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u63A5\u53D7\u4EF7\u683C:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="acceptPrice" ng-model="detailModel.acceptPrice" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u8D2D\u8F66\u7528\u9014:</span>\n\t\t\t\t\t\t\t<drop-down render-data="$root.enumData.carUse" model="detailModel.buyCarUse"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u610F\u5411\u8F66\u578B:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="catTypeInclination" ng-model="detailModel.catTypeInclination"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u610F\u5411\u914D\u7F6E:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="deployInclination" ng-model="detailModel.deployInclination" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u610F\u5411\u8F66\u8272:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="carColorInclination" ng-model="detailModel.carColorInclination" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u8D2D\u8F66\u5173\u6CE8\u56E0\u7D20:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.buyFocus" model="detailModel.buyCarFactor"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u9700\u8981\u4E13\u5C5E\u8BA2\u5236:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExclusive"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u4FE1\u606F\u6765\u6E90\u6E20\u9053:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.infoSource" model="detailModel.infobahn"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u662F\u5426\u4F53\u9A8C\u8F66\u7528\u6237:</span>\n\t\t\t\t\t\t\t<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExperienceCar"></drop-down>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u7528\u6237\u63A5\u89E6\u6B21\u6570:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="customerCount" ng-model="detailModel.customerCount" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span>\u7528\u6237\u63A5\u89E6\u539F\u56E0:</span>\n\t\t\t\t\t\t\t<input class="default-input short" type="text" name="customerReason" ng-model="detailModel.customerReason" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="btn-wrapper">\n\t\t\t\t\t<i class="error-msg" ng-if="showError&&clientForm.$submitted">\u8BF7\u5B8C\u6574\u4E14\u6B63\u786E\u7684\u586B\u5199\u5BA2\u6237\u4FE1\u606F</i>\n\t\t\t\t\t<a class="button" hm-tap="affirm()">\u786E\u5B9A</a>\n\t\t\t\t\t<a class="button" hm-tap="detailRest()">\u91CD\u7F6E</a>\n\t\t\t\t</div>\n\t\t\t</div>',
			controller: function controller($scope, $element, $attrs) {
				$scope.detailData = {};
				$scope.detailModel = {};
				var detailIsChange = function detailIsChange() {
					return !(JSON.stringify($scope.userDetail) == JSON.stringify($scope.detailModel));
				};
				var getDetail = function getDetail() {
					$('body').loading();
					appApi.getUserBack($scope.id, function (data) {
						$('body').find('.inline-loading').remove();
						delete data.user.createdTime;
						delete data.user.updatedTime;
						data.user.birthdayStr = moment(data.user.birthday)._d;
						delete data.user.birthday;
						$scope.detailData = data.user;
						$scope.detailModel = $.extend(true, {}, data.user);
						$('body').find('.inline-loading').remove();
						if (data.user.province) {
							getCityList(data.user.province);
						}
					});
				};
				var getCityList = function getCityList(id) {
					$scope.cityList = [];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = $rootScope.enumData.regionList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var item = _step2.value;

							if (item.provinceId == id) {
								$scope.cityList = item.cityList;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					;
				};
				if ($scope.type == 1) {
					getDetail();
				};
				$scope.provinceClick = function (e, i) {
					getCityList(i.provinceId);
				};
				$scope.affirm = function () {
					$scope.clientForm.$submitted = true;
					setTimeout(function () {
						if ($($element).find('.error').length == 0) {
							$scope.showError = false;
							var postData = $.extend(true, {}, $scope.detailModel);
							postData.birthdayStr = moment(postData.birthdayStr).format('YYYY-MM-DD');
							if ($scope.type == 1) {
								console.log('update');
								appApi.updateUserBack(postData, function (data) {
									console.log(data);
									toastr.success('成功更新用户资料');
									$scope.$emit('hideDetail');
									$rootScope.$broadcast('loadClientList');
								});
							} else {
								appApi.saveUserBack(postData, function (data) {
									console.log(data);
									toastr.success('成功新建用户');
									$scope.$emit('hideAddClient');
									$rootScope.$broadcast('loadClientList');
								});
							}
						} else {
							$scope.$apply(function () {
								$scope.showError = true;
							});
						}
					});
				};
				$scope.detailRest = function () {
					$scope.detailModel = $.extend(true, {}, $scope.userDetail);
				};
			}
		};
	});
});