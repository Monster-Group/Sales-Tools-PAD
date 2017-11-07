define(['angular', 'moment', 'jquery', 'nprogress', 'Ps', 'daterange'], function(angular, moment, $, NProgress) {
	'use strict';
	var appDirectives = angular.module('app.directives', []);
	appDirectives.directive('ngScrollbar', function() {
		return {
			link: function($scope, $element) {
				$($element).perfectScrollbar();
			}
		}
	});
	appDirectives.directive('ngScrollbarY', function() {
		return {
			link: function($scope, $element) {
				$($element).perfectScrollbar({
					suppressScrollX: true
				});
			}
		}
	});
	appDirectives.directive('ngFocus', [function() {
		var FOCUS_CLASS = "ng-focused";
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				element.bind('focus',
					function(evt) {
						element.removeClass(FOCUS_CLASS);
						scope.$apply(function() {
							ctrl.$focused = false;
						});
					}).bind('blur',
					function(evt) {
						element.addClass(FOCUS_CLASS);
						scope.$apply(function() {
							ctrl.$focused = true;
						});
					});
			}
		}
	}]);
	appDirectives.directive('tdRepeat', function($timeout) {
		return {
			link: function($scope, $element, $attrs) {
				if($scope.$last == true && $scope.$parent.$last == true) {
					var finish = $attrs.tdRepeat;
					$timeout(function() {
						$scope.$eval(finish);
					}, 0);
				}
			}
		}
	});
	appDirectives.directive('ngInput', function($rootScope, $parse) {
		return {
			template: function(element, attrs) {
				var type = attrs.type ? attrs.type : 'text';
				var iconLeft = attrs.iconLeft ? attrs.iconLeft.indexOf('{') > -1 ? '<i class="icon icon-left ' + attrs.iconLeft + '"></i>' : '<i class="icon icon-left">' + attrs.iconLeft + '</i>' : '';
				var iconRight = attrs.iconRight ? attrs.iconRight.indexOf('{') > -1 ? '<i class="icon icon-right ' + attrs.iconRight + '"></i>' : '<i class="icon icon-right">' + attrs.iconRight + '</i>' : '';
				var placeholder = attrs.placeholder ? 'placeholder="' + attrs.placeholder + '"' : '';
				var errorLable = '';
				var valid = '';
				var name = attrs.name ? 'name="' + attrs.name + '"' : '';
				var model = attrs.model ? 'ng-model="' + attrs.model + '"' : '';
				var focus = attrs.model ? 'ng-focus' : '';
				if(attrs.valid) {
					var required = attrs.required ? attrs.required : '';
					var minlength = attrs.min ? attrs.min : '';
					var maxlength = attrs.max ? attrs.max : '';
					var pattern = attrs.pattern ? attrs.pattern : '';
					switch(type) {
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
					if(required != '') {
						valid += ' required=' + required;
						errorLable += '<span ng-show="(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.' + attrs.name + '.$touched)||(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.$submitted)" class="error-lable">内容不可为空</span>';
					}
					if(minlength != '') {
						valid += ' ng-minlength=' + minlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.minlength" class="error-lable">内容不可少于' + minlength + '个字</span>';
					}
					if(maxlength != '') {
						valid += ' ng-maxlength=' + maxlength;
						valid += ' maxlength=' + maxlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.maxlength" class="error-lable">内容不可多于' + maxlength + '个字</span>';
					}
					if(pattern != '') {
						valid += ' ng-pattern=' + pattern;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.pattern" class="error-lable">您输入的格式不正确</span>';
					}
				};
				return '<div class="clearfix default-input">' + iconLeft + iconRight + '<input  type="' + type + '" ' + valid + ' ' + model + ' ' + placeholder + ' ' + name + ' ' + focus + ' autocomplete="off" />' + errorLable + '</div>'
			},
			replace: true,
			controller: function($scope, $element, $attrs) {
				var opt = $parse($attrs.opt)($scope);
				var $this = $($element);
				if(opt && opt.class) {
					$this.addClass(opt.class);
				}
			}
		}
	});
	appDirectives.directive('dateRangePicker', function($rootScope, $parse) {
		return {
			template: '<div class="clearfix default-input date-range-picker-wrapper"><i class="icon icon-right" ng-click="pickerToggle()">&#xe618;</i><input class="date-range-picker" readonly="readonly"/></div>',
			replace: true,
			scope: {
				model: '=',
				apply: '=?',
				opt: '=options',
				picker: '=?'
			},
			controller: function($scope, $element, $attrs) {
				var $this = $($element);
				var $input = $this.find('input');
				var size = $attrs.size ? $attrs.size : null;
				var opt = $scope.opt ? $scope.opt : {};
				var thisClass = $attrs.class;
				var noToday = $attrs.noToday ? true : false;
				var options, startDate, endDate;
				if(!noToday) {
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
				if(!$attrs.free) {
					opts.minDate = moment().subtract(90, 'days');
				};
				if(!$scope.model || $scope.model == '') {
					$scope.model = undefined;
				} else {
					opts.startDate = moment($scope.model.split('|')[0]);
					opts.endDate = moment($scope.model.split('|')[1]);
				};
				$this.addClass(thisClass);
				$input.daterangepicker(opts);
				$scope.picker = $input.data('daterangepicker');
				$scope.pickerToggle = function() {
					$scope.picker.show();
				};
				$input.on('show.daterangepicker', function() {
					$this.addClass('open');
				});
				$input.on('hide.daterangepicker', function() {
					$this.removeClass('open');
				});
				$input.on('apply.daterangepicker',
					function(ev, picker) {
						console.log(picker);
						$(this).val(
							picker.chosenLabel != '自定义时间' ? picker.chosenLabel :
							picker.startDate.format('YYYY-MM-DD') == picker.endDate.format('YYYY-MM-DD') ? picker.startDate.format('YYYY-MM-DD') : picker.startDate.format('YYYY-MM-DD') +
							'至' +
							picker.endDate.format('YYYY-MM-DD'));
						$scope.model = picker
							.startDate.format('YYYY-MM-DD') +
							'|' +
							picker.endDate.format('YYYY-MM-DD');
						$rootScope.$digest();
						if($scope.apply) {
							$scope.apply();
						}
					});
			}
		}
	});
	appDirectives.directive('rangeDateValidate', function() {
		return {
			link: function($scope, $elements, $attrs, ) {
				var $start = $($elements).find('.start-date'),
					$end = $($elements).find('.end-date')

				$start.off('change')
					.on('change', function() {
						compare();
					})

				$end.off('change')
					.on('change', function() {
						compare()
					})

				function compare(start, end) {
					var startDate = $start.val();
					var endDate = $end.val();
					console.log(startDate, endDate);
					if((startDate && endDate) && startDate > endDate) {
						$($elements).addClass('error');
					}else{
						$($elements).removeClass('error');
					}
				}
			}
		}
	});

	appDirectives.directive('dropDown', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				display:'=?',
				renderData: '=',
				model: '=?',
				placeholder: '=?',
				clickEvent: '=?'
			},
			template: `
				<div class="dropdown">
					<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
						<span class="val pull-left" ng-bind="model[$scope.display]?model.name:placeholder"></span>
						<div class="pull-right">
							<span class="arrow icon">&#xe792;</span>
						</div>
					</a>
					<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
						<li ng-repeat="item in renderData track by $index" ng-bind="item[display]"  hm-tap="itemClick($event, item)"></li>
					</ul>
				</div>
			`,
			controller: function($scope, $element, $attrs) {
				$scope.display = $scope.display?$scope.display:'name';
				console.log($scope.display);
				$scope.placeholder || ($scope.placeholder = '请选择')
				$scope.model || ($scope.model = {
					name: '',
					value: ''
				});

				$scope.itemClick = function(e, item) {
					delete item.$$hashKey;
					if(item[$scope.display] == $scope.model[$scope.display]) {
						e.stopPropagation();
						e.preventDefault();
						return;
					}
//					console.log(666)
					$scope.model = Object.assign({}, item);
					$scope.clickEvent && $scope.clickEvent(e, item);
//					console.log(666)
				}
			}
		}
	})

	appDirectives.directive('modalContainer', function() {
		return {
			restrict: 'E',
			transclude: {
				'header': 'modalContainerHeader',
				'body': 'modalContainerBody',
				'footer': 'modalContainerFooter'
			},
			replace: true,
			template: `
				<div class="modal fade custom-modal add-order-modal in" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header" ng-transclude="header">		
							</div>
							<div class="modal-body" ng-transclude="body">
							</div>
							<div class="modal-footer" ng-transclude="footer">
							</div>
						</div>
					</div>
				</div>
			`,
			controller: function($scope, $element, $attrs) {}
		}
	});

	appDirectives.directive('newOrder', function($rootScope){
		return {
			restrict: 'E',
			scope:{
			},
			replace: true,
			template: `
				<div class="modal fade custom-modal add-order-modal in" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">{{title}}</div>
							<div class="modal-body">
								<form id="orderForm" name="orderForm" novalidate onsubmit="return false;">
								<div class="config">
									<div class="item">
										<span>类别:</span>
										<select chosen  placeholder-text-single="'请选择'" ng-model="orderModel.orderType"
		    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" conver-to-number>
											<option value="">请选择</option>
		    							</select>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车系:</span>
										 <select chosen multiple placeholder-text-multiple="'请选择'"
		    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-model="orderModel.product">
		    							</select>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车型:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车顶颜色:</span>
										<drop-down render-data="$root.enumData.orderType" click-event="itemClick"></drop-down>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车身颜色:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>配件:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>活动优惠:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>提车门店:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>提车门店:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>身份证:</span>
										<div class="form-input-wrapper">
											<input class="default-input" ng-model="orderModel.cardId" type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>公司:</span>
										<div class="form-input-wrapper">
											<input class="default-input" type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>分类1:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>分类2:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>商品:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>提货地点:</span>
										<div class="dropdown">
											<a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
												<span class="val pull-left">请选择</span>
												<div class="pull-right">
													<span class="arrow icon">&#xe792;</span>
												</div>
											</a>
											<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
												<li>test</li>
												<li>test</li>
												<li>test</li>
												<li>test</li>
											</ul>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<div class="price-info" ng-if="orderModel.orderType === 0">
								<p>车价:<i>35800</i></p>
								<p>配件:<i>35800</i></p>
								<p>活动优惠:<i>35800</i></p>
								<p class="total color-bdprimary">总价:<i>95800</i></p>
							</div>
							<div class="price-info" ng-if="orderModel.orderType === 1">
								<p>总价:<i>000</i></p>
							</div>
							<div class="btn-wrapper">
								<a class="button">确定</a>
								<a class="button" hm-tap="closeModal">取消</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			`,
			controller: function($scope, $element ,$attrs){
				$scope.title = '创建订单';
			},
			link: function($scope, $elements, $attrs, controllers){
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
				}
				var productModelDefault = {
					product: '',
					level1Type: '',
					level2Type: '',
					storeId: ''
				}
				
				$scope.orderModel&& ($scope.orderModel = Object.assign({}, orderModelDefault));
				$scope.productModel&& ($scope.productModel = Object.assign({}, productModelDefault));

				$scope.closeModal = function(){
					$scope.$modal.modal('toggle')
				}

				$scope.submit = function(){
					if($scope.orderForm.$valid){
						alert('提交')
					}
				}

				$scope.$modal.on('hide.bs.modal', function(){
					if($scope.orderForm.$dirty){
						$scope.orderModel = Object.assign({}, orderModelDefault);
						$scope.productModel = Object.assign({}, productModelDefault);
						$scope.orderForm.$setPristine();
						$scope.orderForm.$setUntouched();
					}
				});
			}
		}
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
	
	appDirectives.directive('orderDetail', function($rootScope, appApi){
		return {
			restrict: 'E',
			scope: {
				orderId: '=',
			},
			replace: true,
			template: `
				<div class="order-info" ng-show="detailShow">
					<header class="clearfix">
						<a class="button pull-left" hm-tap="back">返回</a>
						<span class="pull-left">订单详情&nbsp;&nbsp;(编号:{{orderDetail.orderNo}})</span>
					</header>
					<div class="info-block">
						<h3>购车人信息:</h3>
						<div class="info-body">
							<div>
								<span>购买人:</span><i>{{orderDetail.buyerName}} {{ renderData.sex | formatGender}}</i>
							</div>
							<div>
								<span>购买人手机号:</span><i>{{orderDetail.buyerMobile}}</i>
							</div>
							<div>
								<span>购买人证件号码:</span><i>{{orderDetail.buyerIdCard}}</i >
							</div>
							<div>
								<span>收货人姓名:</span><i>{{orderDetail.buyerName}}</i>
							</div>
							<div>
								<span>收货人手机号:</span><i>{{orderDetail.buyerMobile}}</i>
							</div>
						</div>
					</div>
					<div class="info-block">
						<h3>订单信息:</h3>
						<div class="info-body" ng-show="orderDetail&&orderDetail.type != 1">
							<div>
								<span>活动名称:</span><i>{{orderDetail.promotionName}}</i>
							</div>
							<div>
								<span>活动条款:</span><i>{{orderDetail.terms}}</i>
							</div>
							<div>
								<span>活动金额:</span><i>{{orderDetail.discountPrice}}</i>
							</div>
							<div>
								<span>优惠审核状态:</span><i>{{orderDetail.organization}}</i>
							</div>
							<div>
								<span>提车地址:</span><i>ccccc</i>
							</div>
							<div>
								<span>公司:</span><i>{{orderDetail.organization}}</i>
							</div>
							<div>
								<span>下单时间:</span><i>{{orderDetail.formatCreatedTime}}</i>
							</div>
							<div>
								<span>支付时间:</span><i>15012119780906771X1501</i>
							</div>
							<div>
								<span>结清时间:</span><i>{{orderDetail.formatConfirmTime}}</i>
							</div>
							<div>
								<span>状态:</span><i>{{orderDetail.deliveryStageName}}</i>
							</div>
							<div>
								<span>商品明细:</span><i>{{orderDetail.productDetail}}</i>
							</div>
							<div>
								<span>优惠金额:</span><i>{{orderDetail.discountPrice}}</i>
							</div>
							<div>
								<span>数量:</span><i>{{orderDetail.quantity}}</i>
							</div>
							<div>
								<span>原价:</span><i>{{orderDetail.productPrice}}</i>
							</div>
							<div>
								<span>现价:</span><i>{{orderDetail.productPrice - orderDetail.discountPrice}}</i>
							</div>
						</div>
						<div class="info-body" ng-show="orderDetail&&orderDetail.type == 1">
							<div>
								<span>优惠审核状态:</span><i>15012119780906771X150121</i>
							</div>
							<div>
								<span>提货地址:</span><i>15012119780906771X1501</i>
							</div>
							<div>
								<span>下单时间:</span><i>{{orderDetail.formatCreatedTime}}</i>
							</div>
							<div>
								<span>支付时间:</span><i>{{orderDetail.formatPaymentTime}}</i>
							</div>
							<div>
								<span>结清时间:</span><i>{{orderDetail.formatConfirmTime}}</i>
							</div>
							<div>
								<span>状态:</span><i>{{orderDetail.deliveryStageName}}</i>
							</div>
							<div>
								<span>商品明细:</span><i>{{orderDetail.productDetail}}</i>
							</div>
							<div>
								<span>数量:</span><i>{{orderDetail.quantity}}</i>
							</div>
							<div>
								<span>价格:</span><i>{{orderDetail.amount}}</i>
							</div>
						</div>
					</div>
					<div class="info-block pay-info">
						<h3 class="clearfix">
							<span class="channel">支付渠道</span>
							<span class="pay-no">支付号</span>
							<span class="pay-amount">支付金额</span>
							<span class="pay-date">支付时间</span>
						</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in payment track by $index">
								<span class="channel">{{item.channel | formatChannel}}</span>
								<span class="pay-no">{{item.paymentId}}</span>
								<span class="pay-amount">{{item.amount}}</span>
								<span class="pay-date">{{item.paymentTimeFormat}}</span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button">新增支付信息</a>
						</div>
					</div>
					<div class="info-block pay-info" ng-show="orderDetail&&orderDetail.type != 1">
						<h3 class="clearfix">车辆信息：</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in carInfo track by $index">
								<span class="vin">VIN:{{item.VIN }}</span>
								<span class="vsn">VSN: {{item.VSN}}</span>
								<span class="">发动机号：{{item.no}}</span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button">新增支付信息</a>
						</div>
					</div>
					<div class="info-block appoint-info" ng-show="appoints.length > 0">
						<h3 class="clearfix">邀约信息：</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in appoints track by $index">
								<span class="appoint">{{deliveryStageName}}:  {{item.buyerName}} {{item.time}}</span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button">新增支付信息</a>
						</div>
					</div>
				</div>
			`,
			controller: function($scope, $element ,$attrs ){
				var orderId;
				$scope.back = function(){
					$scope.detailShow = false;
				}

				function getData(orderType, orderNo){
					//订单详情
					appApi.getOrderDetail({orderId: orderId} ,(data) => {
						data.formatCreatedTime = moment(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
						data.formatConfirmTime = !data.confirmTime ? '--' : moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss");
						$scope.orderDetail = data;
						NProgress.done();
					});
					//支付信息
					appApi.getPayment({orderNo: orderNo} ,(data) => {
						$scope.payment = data.map(function(item){
							item.paymentTimeFormat = moment(item.paymentTime).format("YYYY-MM-DD HH:mm:ss");
						});
					});

					//代办事项
					appApi.getAppointById({orderId: orderId} ,(data) => {
						$scope.appoints = data.map(function(item){
							if(item.reservationStartTime&&item.reservationEndTime)
							var startDay = moment(item.reservationStartTime).format('YYYY-MM-DD');
							var endDay = moment(item.reservationEndTime).format('YYYY-MM-DD');
							if(startDay == endDate){
								var startTime = moment(item.reservationStartTime).format('HH:mm');
								var endTime = moment(item.reservationEndTime).format('HH:mm');
								item.time = startDay + ' ' + startTime + '-' + endTime;
							}else{
								var startTime = moment(item.reservationStartTime).format('YYYY-MM-DD HH:mm');
								var endTime = moment(item.reservationEndTime).format('YYYY-MM-DD HH:mm');
								item.time = startTime + '-' + endTime;
							}
							return item; 
						});
					});
					
					//车辆详情
					if(orderType != '1'){
						appApi.getCarInfo({orderId: orderId} ,(data) => {
							$scope.carInfo = data;
						});
					}
				}

				$scope.$on('showDetail',function(e, data){
					NProgress.start();
					$scope.detailShow = true;

					if(orderId != data.orderId){
						orderId = data.orderId;
						getData(data.type, data.orderNo);
					}
				})
			}
		}
	});
});
