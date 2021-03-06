define(['angular', 'moment', 'jquery', 'nprogress','upload','toastr'], function(angular, moment, $, NProgress,oss,toastr) {
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
					} else {
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
				display: '=?',//显示名字字段
				renderData: '=',//渲染下拉列表数据  [{},{}]
				model: '=?',//接受数据model   直接为选项的val值
				placeholder: '=?',//默认显示文字
				clickEvent: '=?',//选项点击回调事件，参数$event,item   item为所点击选项的整个对象
				val:'=?'//点击选项取值的字段名
			},
			template: `
				<div class="dropdown">
					<a href="#" data-toggle="dropdown" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
						<span class="val pull-left" ng-bind="displayName"></span>
						<i class="arrow icon pull-right">&#xe792;</i>
					</a>
					<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
						<li hm-tap="itemClick($event, '')">请选择</li>
						<li ng-repeat="item in renderData track by $index" ng-bind="item[display]"  hm-tap="itemClick($event, item)"></li>
					</ul>
				</div>
			`,
			link: function($scope, $elements, $attrs, controllers) {
				$($elements).find('.dropdown-toggle').on('tap',function(e){
					$(this).dropdown('toggle');
					e.stopPropagation();
					e.preventDefault();
				});
			},
			controller: function($scope, $element, $attrs) {
				let getDisplayName = (val)=>{
					let name = '';
					for(let item of $scope.renderData){
						if(item[$scope.val] == val){
							name = item[$scope.display];
						}
					}
					return name;
				};
				$scope.val = $scope.val?$scope.val:'value';
				$scope.display = $scope.display ? $scope.display : 'name';
				$scope.placeholder || ($scope.placeholder = '请选择');
				$scope.displayName = ($scope.model===undefined||$scope.model==='')?$scope.placeholder:getDisplayName($scope.model);
				$scope.itemClick = function(e, item) {
					delete item.$$hashKey;
					if(item[$scope.val] == $scope.model) {
						e.preventDefault();
						return false;
					}
					$scope.model = item[$scope.val];
					$scope.clickEvent && $scope.clickEvent(e, item);
				};
				var watch = $scope.$watch('model', function (newVal, oldVal) {
					if (newVal != oldVal) {
						$scope.displayName = ($scope.model===undefined||$scope.model==='')?$scope.placeholder:getDisplayName($scope.model);
					}
				});
				$scope.$on('$destroy', ()=>{
					watch();
				});
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

	appDirectives.directive('newOrder', function($rootScope, appApi,$timeout) {
		return {
			restrict: 'E',
			scope: {
				userId: '='
			},
			replace: true,
			template: `
				<div class="modal fade custom-modal" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">{{title}}</div>
							<div class="modal-body">
								<form id="orderForm" name="orderForm" novalidate onsubmit="return false;" ng-class="{'form-submited': orderForm.$submitted}">
								<div class="config">
									<div class="item">
										<span>类别:</span>
										<div ng-class="{'ng-invalid': orderForm.chebie.$invalid}">
											<select name="chebie" chosen required placeholder-text-single="'请选择'" ng-disabled="service" ng-model="orderModel.orderType" ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-change="typeChange()">
												<option value="">请选择</option>
			    							</select>
		    							</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车系:</span>
										 <select chosen disabled width="256" ng-model="orderModel.product">
										 	<option value="" select>E-100</option>
		    							</select>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车型:</span>
										<div ng-class="{'ng-invalid': orderForm.chexing.$invalid}">
											<select name="chexing" chosen required placeholder-text-single="'请选择'" ng-model='selectProduct' width="256" disable-search="true" ng-change="productChange(selectProduct)"  ng-options="item.productName for item in listCar">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车顶颜色:</span>
										<div ng-class="{'ng-invalid': orderForm.cheding.$invalid}">
											<select name="cheding" chosen required placeholder-text-single="'请选择'" ng-change="changeColorOne(selectOrder.selectColorOne)" width="256"  ng-model="selectOrder.selectColorOne" ng-options="item for item in colorOne.select" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>车身颜色:</span>
										<div ng-class="{'ng-invalid': orderForm.cheshen.$invalid}">
											<select name="cheshen" chosen required placeholder-text-single="'请选择'" ng-change="changeColorTow(selectOrder.selectColorTow)" width="256"  ng-model="selectOrder.selectColorTow" ng-options=" item for item in colorTow.select" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>内饰颜色:</span>
										<div ng-class="{'ng-invalid': orderForm.neishi.$invalid}">
											<select name="neishi" chosen required placeholder-text-single="'请选择'" width="256"  ng-model="orderModel.level3Type" ng-options="item for item in colorThree.select" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>配件:</span>
										<select name="" multiple chosen placeholder-text-multiple="'请选择'" width="256" ng-change="selectPei(orderModel.data)"  ng-model="orderModel.data" ng-options="item.productId as item.productName for item in peiList" id="" disable-search="true">
										</select>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>活动优惠:</span>
										<select name="" chosen placeholder-text-single="'请选择'" ng-change="promotionChange(selectOrder.selectPromotion)" width="256" chosen id="" ng-model="selectOrder.selectPromotion" ng-options="item.promotionName for item in promotions" disable-search="true">
											<option value="">请选择</option>
										</select>
										<span class="subjoin" ng-bind="selectOrder.selectPromotion.discount"></span>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>支付方式:</span>
										<div ng-class="{'ng-invalid': orderForm.payType.$invalid}">
											<select name="payType" required chosen placeholder-text-single="'请选择'" ng-change="payTypeChange(orderModel.payType)" width="256" chosen id="" ng-model="orderModel.payType" ng-options="item.value as item.name for item in $root.enumData.payType" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
										<span class="subjoin" ng-if="orderModel.payType==0">全款立减100</span>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>提车门店:</span>
										<div ng-class="{'ng-invalid': orderForm.tiche.$invalid}">
											<select name="tiche" chosen required placeholder-text-single="'请选择'" width="256" ng-model="orderModel.storeId" ng-options="item.storeId as item.storeName for item in listStore" ng-change="storeChange()"  id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>公司:</span>
										<div class="form-input-wrapper">
											<input class="default-input" ng-model="orderModel.organization" type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0&&!userId">
										<span>手机号:</span>
										<div class="form-input-wrapper">
											<input class="default-input" ng-model="orderModel.mobile" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0&&!userId">
										<span>姓名:</span>
										<div class="form-input-wrapper">
											<input class="default-input" ng-model="orderModel.realname" required type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0&&!userId">
										<span>身份证:</span>
										<div class="form-input-wrapper">
											<input class="default-input" ng-model="orderModel.idCard" required idcard-check type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>分类1:</span>
										<div ng-class="{'ng-invalid': orderForm.class1.$invalid}">
											<select name="class1" chosen required width="256" placeholder-text-single="'请选择'" ng-change="changeLv1(selectOrder.classlv1)" ng-model="selectOrder.classlv1" ng-options="item for item in listClassLv1" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>分类2:</span>
										<div ng-class="{'ng-invalid': orderForm.class2.$invalid}">
											<select name="class2" chosen required width="256" placeholder-text-single="'请选择'" ng-change="changeLv2(selectOrder.classlv2)" ng-model="selectOrder.classlv2" ng-options="item for item in listClassLv2" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>商品:</span>
										<div ng-class="{'ng-invalid': orderForm.chep.$invalid}">
											<select name="chep" chosen required width="256" placeholder-text-single="'请选择'" ng-change="chooseProduct(selectOrder.selectProduct)" ng-model="selectOrder.selectProduct" ng-options="item.productName for item in productsData" id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1">
										<span>提货地点:</span>
										<div ng-class="{'ng-invalid': orderForm.tihuo.$invalid}">
											<select name="tihuo" chosen required width="256" placeholder-text-single="'请选择'" ng-model="productModel.storeId" ng-options="item.storeId as item.storeName for item in listStore"  id="" disable-search="true">
												<option value="">请选择</option>
											</select>
										</div>
									</div>
									<div class="item" ng-if="(orderModel.orderType === 1||orderModel.orderType === 2)&&!userId">
										<span>手机号:</span>
										<div class="form-input-wrapper">
											<input class="default-input" name="buyerphone" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" ng-readonly="service" ng-model="productModel.mobile" type="number" ng-change="mobileChange()" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1&&!userId">
										<span>姓名:</span>
										<div class="form-input-wrapper">
											<input class="default-input" name="realname" required ng-model="productModel.realname" type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 1&&!userId">
										<span>身份证:</span>
										<div class="form-input-wrapper">
											<input class="default-input" name="cardId" required ng-model="productModel.idCard" idcard-check type="text" />
										</div>
									</div>
									<div class="item" ng-if="orderModel.orderType === 2">
										<span>商品:</span>
										<drop-down ng-class="{'error':orderForm.$submitted&&(serviceModel.productId==''||serviceModel.productId==undefined)}" render-data="serviceProduct" display="'productName'" val="'productId'" model="serviceModel.productId" click-event="cityClick"></drop-down>
									</div>
									<div class="item item-2 license" ng-if="orderModel.orderType === 2">
										<span>上牌地点:</span>
										<drop-down ng-class="{'error':orderForm.$submitted&&(serviceModel.provinceId==''||serviceModel.provinceId==undefined)}" render-data="$root.enumData.regionList" display="'provinceName'" val="'provinceId'" model="serviceModel.provinceId" click-event="provinceClick"></drop-down>
										<drop-down ng-class="{'error':orderForm.$submitted&&(serviceModel.cityId==''||serviceModel.cityId==undefined)}" render-data="cityList" display="'cityName'" val="'cityId'" model="serviceModel.cityId" click-event="cityClick"></drop-down>
									</div>
									<div class="item item-3" ng-if="orderModel.orderType === 2">
										<span>购车订单:</span>
										<drop-down ng-class="{'error':orderForm.$submitted&&(serviceModel.orderId==''||serviceModel.orderId==undefined)}" render-data="userOrderList" display="'productDetail'" val="'orderId'" model="serviceModel.orderId"></drop-down>
									</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<div class="price-info" ng-if="orderModel.orderType === 0">
								<p>车价:<i>{{carDisPrice?carDisPrice:carPrice | currency:'￥'}}</i></p>
								<p>配件:<i>{{peiPrice?peiPrice:0 | currency:'￥'}}</i></p>
								<p>活动优惠:<i>¥2000.00</i></p>
								<p>团购优惠:<i>{{selectOrder.selectPromotion.discount?selectOrder.selectPromotion.discount:0 | currency:'￥'}}</i></p>
								<p>地区补贴:<i>{{subsidy?subsidy:0 | currency:'￥'}}</i></p>
								<p class="total color-bdprimary">总价:<i>{{getSum() | currency:'￥'}}</i><span class="other-cost" ng-if="orderModel.payType==1">定金 : ¥2000.00</span><span class="other-cost" ng-if="orderModel.payType==2">分期 : ¥2000.00</span></p>
							</div>
							<div class="price-info" ng-if="orderModel.orderType === 1">
								<p class="total color-bdprimary">总价:<i><em>¥</em>{{productPrice?productPrice:0}}</i></p>
							</div>
							<div class="price-info" ng-if="orderModel.orderType === 2">
								<p class="total color-bdprimary">总价:<i><em>¥</em>{{serviceTotal?serviceTotal:0}}</i></p>
							</div>
							<div class="btn-wrapper">
								<a class="button" hm-tap="submit">确定</a>
								<a class="button" hm-tap="closeModal">取消</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			`,
			controller: function($scope, $element, $attrs) {
				$scope.title = '创建订单';
			},
			link: function($scope, $elements, $attrs, controllers) {
				$scope.$modal = $($elements);
				$scope.payDiscounts = 0;
				var orderModelDefault = {
					orderType: '',
					product: '',
					level1Type: '',
					level2Type: '',
					data: '',
					promotionId: '',
					storeId: '',
					idCard: '',
					organization: ''

				};
				var productModelDefault = {
					productId: '',
					// level1Type: '',
					// level2Type: '',
					storeId: ''
				};
				var serviceModelDefault = {
					accountId:$rootScope.loginfo.account.accountId,
					storeId:$rootScope.storeId
				};
				function init() {
					$scope.colorOne = {}
					$scope.colorTow = {}
					$scope.colorThree = {}
					$scope.orderModel || ($scope.orderModel = Object.assign({}, orderModelDefault));
					$scope.productModel || ($scope.productModel = Object.assign({}, productModelDefault));
					console.log($scope.productModel);
					$scope.serviceModel || ($scope.serviceModel = Object.assign({}, serviceModelDefault));
					$scope.selectOrder = {
						selectColorOne: '',
						selectColorTow: '',
						selectPromotion: {},
						classlv1: '',
						classlv2: '',
						selectProduct: ''
					};
				};
				init();
				//获取车辆列表
				appApi.listCar((data) => {
					$scope.listCar = data.map((item) => {
						return {
							productName: item.productName.split('-')[1],
							productId: item.productId,
							defaultPrice: item.defaultPrice,
							deposit: item.deposit,
							peiList: item.peiList
						}
					})
				});

				//获取活动
				appApi.getPromotion((data) => {
					$scope.promotions = data;
					console.log($scope.promotions)
				});

				//获取提车点
				appApi.listStoreMall((data) => {
					$scope.listStore = data;
				});

				//获取商品的分类
				appApi.listClassifyLv1((data) => {
					$scope.listClassLv1 = data;
				});
				//获取服务商品列表
//				appApi.listServiceProduct((data) => {
//					$scope.serviceProduct = data;
//					console.log(data);
//				});

				function getColor(data, fn) {
					appApi.getCarColor(data, (d) => {
						fn(d);
					})
				};

				function getProductType(data, fn) {
					appApi.listClassify(data, (d) => {
						fn(d);
					})
				};
				let getSubsidy = ()=>{
					if($scope.orderModel.storeId){
						let provinceId = undefined,
							cityId = undefined;
						for(let item of $scope.listStore){
							if(item.storeId==$scope.orderModel.storeId){
								provinceId = item.provinceId;
								cityId = item.cityId;
							};
						};
						console.log(provinceId);
						console.log(cityId);
						$scope.subsidy = undefined;
						$scope.carDisPrice = undefined;
						appApi.listCarDisc({
							isUse:1,
							provinceId:provinceId,
							cityId:cityId,
							productId:$scope.orderModel.productId
						},(data)=>{
							if(data.length){
								$scope.subsidy = data[0].changDisc +  data[0].diDisc + data[0].guoDisc;
								$scope.carDisPrice = data[0].price;
								$scope.carDiscDeployId = data[0].carDiscDeployId;
							};
						});
					}
				};
				let listCarDisc = ()=>{
					appApi.listCarDisc({
						isUse:1,
						provinceId:$scope.serviceModel.provinceId,
						cityId:$scope.serviceModel.cityId,
						productId:$scope.serviceModel.productId
					}, (d) => {
						if(d.length!=0){
							$scope.serviceTotal = d[0].price;
							$scope.serviceModel.carDiscDeployId = d[0].carDiscDeployId;
						}else{
							for(let item of $scope.serviceProduct){
								if(item.productId == $scope.serviceModel.productId){
									$scope.serviceTotal = item.defaultPrice;
								}
							}
						}
					});
				};
				let getCityList = ()=>{
					$scope.cityList = [];
					for(let item of $rootScope.enumData.regionList){
						if(item.provinceId==$scope.serviceModel.provinceId){
							$scope.cityList = item.cityList;
						}
					};
				};
				if($scope.serviceModel.provinceId!=undefined){
					getCityList();
				};
				$scope.provinceClick = ()=>{
					$timeout(()=>{
						getCityList();
					},0);
					$scope.serviceModel.cityId = '';
				};
				$scope.cityClick = ()=>{
					$timeout(()=>{
						if($scope.serviceModel.provinceId&&$scope.serviceModel.cityId&&$scope.serviceModel.productId){
							listCarDisc();
						}
					},0);
				};
				$scope.storeChange = ()=>{
					$timeout(()=>{
						getSubsidy();
						console.log(666);
					},0);
				};
				$scope.mobileChange = ()=>{
					appApi.listCarOrderBack($scope.productModel.mobile,(d)=>{
						console.log(d);
						$scope.userOrderList = d.list;
					});
				};
				$scope.typeChange = ()=>{
					console.log($scope.orderType);
				};
				$scope.productChange = (product) => {
					console.log('select: ', product);
					if($scope.orderModel.productId == product.productId) return;
					$scope.orderForm.$submitted = true;
					$scope.orderModel.productId = product.productId;
					$scope.peiList = product.peiList;
					$scope.carPrice = product.defaultPrice;

					$scope.colorThree = {};
					$scope.colorTow = {};
					$scope.selectOrder.selectColorOne = '';
					$scope.selectOrder.selectColorTow = '';
					$scope.orderModel.level1Type = '';
					$scope.orderModel.level2Type = '';
					$scope.orderModel.level3Type = '';
					getColor({
						productId: product.productId
					}, (data) => {
						$scope.colorOne = data;
					});
					getSubsidy();
				};
				$scope.changeColorOne = (colorOne) => {
					if(colorOne === $scope.orderModel.level1Type) return;
					$scope.orderModel.level1Type = colorOne;
					$scope.orderModel.level2Type = '';
					$scope.orderModel.level3Type = '';
					$scope.selectOrder.selectColorTow = '';
					$scope.colorThree = {}
					getColor({
						productId: $scope.orderModel.productId,
						level1Type: colorOne
					}, (data) => {
						$scope.colorTow = data;
					})
				};
				$scope.changeColorTow = (colorTow) => {
					if(colorTow === $scope.orderModel.level1Type) return;

					$scope.orderModel.level2Type = colorTow;
					$scope.orderModel.level3Type = '';
					getColor({
						productId: $scope.orderModel.productId,
						level1Type: $scope.orderModel.level1Type,
						level2Type: $scope.orderModel.level2Type,
					}, (data) => {
						$scope.colorThree = data;
					})
				};
				var typeObj = {};
				$scope.changeLv1 = (classlv1) => {
					if(classlv1 === typeObj.classlv1) return;
					typeObj.classlv1 = classlv1;
					$scope.productsData = undefined;
					$scope.selectOrder.selectProduct = undefined;
					$scope.selectOrder.classlv2 = '';

					if(classlv1 === '') return;
					getProductType({
						subtype: classlv1
					}, (data) => {
						$scope.listClassLv2 = data.list;
					});
				};
				$scope.changeLv2 = (classlv2) => {
					appApi.listProduct({
						subtype: $scope.selectOrder.classlv1,
						subtype2: classlv2
					}, (data) => {
						$scope.productsData = data;
					});
				};
				$scope.promotionChange = (promotion) => {
					if(promotion.promotionId === $scope.orderModel.promotionId) return;

					$scope.orderModel.promotionId = promotion.promotionId;
				};
				$scope.selectPei = (peiArr) => {
					var peiPrice = 0;
					$scope.peiList.forEach(function(item) {
						if(peiArr.indexOf(item.productId) > -1) {
							peiPrice += Number(item.default_price);
						}
					});
					$scope.peiPrice = peiPrice;
				};
				$scope.chooseProduct = (product) => {
					$scope.productModel.productId = product.productId;
					$scope.productPrice = product.defaultPrice;
				};
				$scope.payTypeChange = (t)=>{
					console.log(t);
					if(t===0){
						$scope.payDiscounts = 100;
					}else{
						$scope.payDiscounts = 0;
					}
				};
				$scope.closeModal = function() {
					$scope.$modal.modal('toggle');
					init();
				};
				$scope.getSum = function() {
					var carPrice = angular.isNumber($scope.carDisPrice) ? +$scope.carDisPrice : angular.isNumber($scope.carPrice) ? +$scope.carPrice : 0;
					var pei = angular.isNumber($scope.peiPrice)  ? +$scope.peiPrice : 0;
					var discount = angular.isNumber($scope.selectOrder.selectPromotion) ? +$scope.discount : 0 ;
					let subsidy = angular.isNumber($scope.subsidy) ? +$scope.subsidy : 0;
					let total = carPrice + pei - discount - subsidy - $scope.payDiscounts - 2000;
					return total>0?total:0;
				};
				$scope.submit = function() {
					console.log($scope.serviceModel);
					$scope.orderForm.$submitted = true;
					if($scope.orderForm.$valid) {
						if($scope.orderModel.orderType == 0) {
							var orderModel = Object.assign({}, $scope.orderModel);
							orderModel.data = orderModel.data && orderModel.data.join(',');
							delete orderModel.orderType;
							if($scope.carDiscDeployId) orderModel.carDiscDeployId = $scope.carDiscDeployId;
							if($scope.userId) orderModel.userId = $scope.userId;
							getCreateOrder().call(this, orderModel, fn_success, fn_fail)
						} else if($scope.orderModel.orderType == 1) {
							var productModel = Object.assign({}, $scope.productModel)
							if($scope.userId) productModel.userId = $scope.userId;
							getProductOrder().call(this, productModel, fn_success, fn_fail)
						}else if($scope.orderModel.orderType == 2) {
							var serviceModel = Object.assign({}, $scope.serviceModel);
							getProductOrder().call(this, serviceModel, fn_success, fn_fail)
						}
					}
				};
				function fn_success(res) {
					$scope.closeModal();
					$scope.$emit('addOrderClose');
					toastr.success('创建成功');
				};
				function fn_fail() {

				};
				function getCreateOrder() {
					if($scope.userId) {
						return appApi.createOrderWithUserId;
					} else {
						return appApi.createOrder
					}
				};
				function getProductOrder() {
					if($scope.orderModel.orderType == 2){
						return appApi.createServiceOrderBack;
					}else{
						if($scope.userId) {
							return appApi.createProductWithUserId;
						} else {
							return appApi.createProduct
						}
					}
				};
				$scope.$modal.on('hide.bs.modal', function() {
					$scope.carDisPrice = 0;
					$scope.carPrice = 0;
					$scope.peiPrice = 0;   
					$scope.subsidy = 0;
					$scope.title = '创建订单';
					$scope.service = undefined;
					$scope.orderModel.orderType = '';
					$scope.disabled = false;
					$scope.orderModel = Object.assign({}, orderModelDefault);
					$scope.productModel = Object.assign({}, productModelDefault);
					$scope.serviceModel = Object.assign({}, serviceModelDefault);
					$scope.selectOrder = {
						selectColorOne: '',
						selectColorTow: '',
						selectPromotion: {},
						classlv1: '',
						classlv2: '',
						selectProduct: ''
					};
					$scope.orderForm.$setPristine();
					$scope.orderForm.$setUntouched();
				});
				let addOrder = $rootScope.$on('addOrder', function(e, data) {
					$scope.$modal.modal('show');
					if(data&&data.service){
						$scope.title = '创建服务订单';
						$scope.service = true;
						$scope.orderModel.orderType = 2;
						$scope.productModel.mobile = parseInt(data.item.buyerMobile);
						$scope.mobileChange();
					};
				});
				$scope.$on('$destroy', function() {
					addOrder();
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
	appDirectives.directive('orderDetail', function($rootScope, appApi, getOrderStatu) {
		return {
			restrict: 'E',
			scope: {
				// orderId: '=',
			},
			replace: true,
			template: `
				<div class="order-info">
					<header class="clearfix">
						<a class="button pull-left" hm-tap="back">返回</a>
						<span class="pull-left">订单详情&nbsp;&nbsp;(编号:{{orderDetail.orderNo}})</span>
					</header>
					<div class="info-block">
						<h3>购车人信息:</h3>
						<div class="info-body">
							<div>
								<span>购买人:</span><i>{{orderDetail.buyerName}} {{'(' + (orderDetail.gender | formatGender) + ')'}}</i>
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
								<span>提车地址:</span><i>{{orderDetail.storeAddress}}</i>
							</div>
							<div>
								<span>公司:</span><i>{{orderDetail.organization}}</i>
							</div>
							<div>
								<span>下单时间:</span><i>{{orderDetail.formatCreatedTime}}</i>
							</div>
							<div>
								<span>结清时间:</span><i>{{orderDetail.formatConfirmTime}}</i>
							</div>
							<div>
								<span>状态:</span><i>{{orderDetail.statusName }}</i>
							</div>
							<div>
								<span>商品明细:</span><i>{{orderDetail.productDetail}}</i>
							</div>
							<div>
								<span>优惠金额:</span><i>{{orderDetail.discountPrice  | currency:'￥'}}</i>
							</div>
							<div>
								<span>数量:</span><i>{{orderDetail.quantity || 1}}</i>
							</div>
							<div>
								<span>原价:</span><i>{{orderDetail.productPrice | currency:'￥'}}</i>
							</div>
							<div>
								<span>现价:</span><i>{{(orderDetail.productPrice - orderDetail.discountPrice)  | currency:'￥'}}</i>
							</div>
						</div>
						<div class="info-body" ng-show="orderDetail&&orderDetail.type == 1">
							<div>
								<span>优惠审核状态:</span><i>15012119780906771X150121</i>
							</div>
							<div>
								<span>提货地址:</span><i>{{orderDetail.storeAddress}}</i>
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
								<span>状态:</span><i>{{orderDetail.statusName}}</i>
							</div>
							<div>
								<span>商品明细:</span><i>{{orderDetail.productDetail}}</i>
							</div>
							<div>
								<span>数量:</span><i>{{orderDetail.quantity || 1}}</i>
							</div>
							<div>
								<span>价格:</span><i>{{(orderDetail.amount * 1)  | currency:'￥'}}</i>
							</div>
						</div>
					</div>
					<div class="info-block pay-info">
						<h3 class="clearfix">
							<span class="channel">支付渠道</span>
							<span class="pay-no">支付号</span>
							<span class="pay-amount">支付金额</span>
							<span class="pay-date">支付时间</span>
							<span class="pay-memo">备注</span>
						</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in payment track by $index">
								<span class="channel">{{item.channel | formatChannel}}</span>
								<span class="pay-no">{{item.paymentId}}</span>
								<span class="pay-amount">{{item.amount}}</span>
								<span class="pay-date">{{item.paymentTimeFormat}}</span>
								<span class="pay-memo">{{item.comment}}</span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button hide" hm-tap="addPay()">新增支付信息</a>
						</div>
					</div>
					<div class="info-block pay-info" ng-show="carInfo.VIN">
						<h3 class="clearfix">车辆信息：</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in carInfo track by $index">
								<span class="vin">VIN:{{item.VIN }}</span>
								<span class="vsn">VSN: {{item.VSN}}</span>
								<span class="">发动机号：{{item.no}}</span>
							</div>
						</div>
					</div>
					<div class="info-block appoint-info" ng-show="appoints.length > 0">
						<h3 class="clearfix">邀约信息：</h3>
						<div class="info-body">
							<div class="line" ng-repeat="item in appoints track by $index">
								<p>{{item.deliveryStageName}}:  {{item.nickname}} {{item.time}}</p>
								<p>备注:&nbsp&nbsp&nbsp&nbsp{{item.comments}}</p>
							</div>
						</div>
					</div>
				</div>
			`,
			controller: function($scope, $element, $attrs) {
				var orderId;
				$scope.addPayModal = false

				var orderId,orderNo;
				$scope.back = function(){
					// $scope.detailShow = false;
					$scope.$emit('detailClose');
				}

				function init(){
					$scope.orderDetail = {};
					$scope.payment = [];
					$scope.appoints = [];
				}

				let loadPayInfo = (orderNo)=>{
					appApi.getPayment({
						orderNo: orderNo
					}, (data) => {
						$scope.payment = data.map(function(item) {
							item.paymentTimeFormat = moment(item.paymentTime).format("YYYY-MM-DD HH:mm:ss");
							return item;
						});
					});
				};

				function getData(orderType) {
					//订单详情
					appApi.getOrderDetail({
						orderId: orderId
					}, (data) => {
						data.formatCreatedTime = moment(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
						data.formatConfirmTime = !data.confirmTime ? '--' : moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss");
						data.statusName = getOrderStatu(data.status);
						orderNo = data.orderNo;
						$scope.orderDetail = data;
						NProgress.done();

						//支付信息
						appApi.getPayment({
							orderNo: orderNo
						}, (data) => {
							$scope.payment = data.map(function(item) {
								item.paymentTimeFormat = moment(item.paymentTime).format("YYYY-MM-DD HH:mm:ss");
								return item;
							});
						});

						loadPayInfo(orderNo);
					});
					

					//代办事项
					appApi.getAppointById({
						orderId: orderId
					}, (data) => {
						$scope.appoints = data.map(function(item) {
							if(item.reservationStartTime && item.reservationEndTime)
								var startDay = moment(item.reservationStartTime).format('YYYY-MM-DD');
							var endDay = moment(item.reservationEndTime).format('YYYY-MM-DD');
							if(startDay == endDay){
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
					if(orderType != '1') {
						appApi.getCarInfo({
							orderId: orderId
						}, (data) => {
							$scope.carInfo = data;
						});
					}
				}
				$scope.addPay = ()=>{
					$scope.$emit('addPay', orderNo);
				};
				let getPayInfo = $rootScope.$on('loadPayInfo', function(e, data) {
					loadPayInfo(orderNo);
				});
				let showDetail = $scope.$on('showDetail', function(e, data) {
					NProgress.start();
					// $scope.detailShow = true;
					init();
					if(orderId != data.orderId) {
						orderId = data.orderId;
						// orderNo = data.orderNo;
						getData(data.type);
					}
				});
				$scope.$on('$destory', function() {
					getPayInfo();
					showDetail();
				});
			}
		}
	});
	appDirectives.directive('addPay', function($rootScope,appApi) {
		return {
			restrict: 'E',
			scope: {
				orderNo:'='
			},
			replace: true,
			template: `
			<div class="modal fade custom-modal" style="display:block;" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-md">
					<div class="modal-content">
						<div class="modal-header">
							支付信息(编号：<i ng-bind="orderNo"></i>)
						</div>
						<div class="modal-body">
							<form name="payInfoForm" novalidate>
							<div class="line">
								<div class="item">
									<span>金额&nbsp;:</span>
									<input type="number" class="transition-02 default-input" ng-model="payInfo.amount" name="amount" required ng-class="{'error':payInfoForm.$submitted&&payInfoForm.amount.$invalid}" />
								</div>
								<div class="item">
									<span>支付类型&nbsp;:</span>
									<drop-down class="transition-02" ng-class="{'error':payInfoForm.$submitted&&(payInfo.channel===undefined||payInfo.channel==='')}" render-data="$root.enumData.payChannel" model="payInfo.channel"></drop-down>
								</div>
								<div class="item">
									<span>流水号&nbsp;:</span>
									<input type="text" class="transition-02 default-input" ng-model="payInfo.outTradeNo" name="outTradeNo" required ng-class="{'error':payInfoForm.$submitted&&payInfoForm.outTradeNo.$invalid}" />
								</div>
							</div>
							<div class="line">
								<div class="item special">
									<span>备注&nbsp;:</span>
									<textarea class="transition-02 default-textarea" ng-model="payInfo.comment" name="comment" required ng-class="{'error':payInfoForm.$submitted&&payInfoForm.comment.$invalid}"></textarea>
								</div>
							</div>
							<div class="line">
								<div class="item special">
									<span>上传凭证&nbsp;:</span>
									<div class="img-list">
										<ul>
											<a class="uplaod-btn" ng-class="{'uploading':uploading}">
												<span ng-bind="percent"></span>
											</a>
											<li ng-repeat="item in imgUrl">
												<img ng-src="{{item}}"/>
												<a class="cycle-button del-img icon" hm-tap="delImg($index)">&#xe60e;</a>
											</li>
										</ul>
										<span class="error-msg" ng-show="payInfoForm.$submitted&&!payInfo.imgUrl">请至少上传一张图片</span>
									</div>
								</div>
							</div>
							</form>
						</div>
						<div class="modal-footer">
							<a class="button" hm-tap="submitPayInfo()">确定</a>
							<a class="button" data-dismiss="modal">取消</a>
						</div>
					</div>
				</div>
			</div>
			`,
			controller: function($scope, $element, $attrs) {
				$scope.$modal = $($element);
				$scope.initUpload = false;
				$scope.ossInit = () =>{
					var $container = $($element).find('.img-list');
					var obj = {};
					obj.container = $container[0];
					obj.browserBtn = $container.find('.uplaod-btn')[0];
					obj.dir = 'myfolder'; // 上传到哪个目录下
					obj.prefix = 'pay_'; // 上传过后文件名的前缀,可以根据功能模块命名
					obj.fileType = 'picture'; // 可以是picture或video, 支持的格式在upload.js中
					obj.beforeUpload_fn = ()=>{
						$scope.$apply(() => {
							$scope.percent = 0+'%';
						});
					}
					obj.uploading_fn = (percent)=> { // 上传中的回调
						$scope.$apply(() => {
							$scope.uploading = true;
							$scope.percent = percent+'%';
						});
						console.log('上传进度：' + percent + ' %');
					}
					obj.success_fn = (data)=> { // 上传成功后的回调
						console.log(data);
						$scope.$apply(() => {
							$scope.uploading = false;
							$scope.imgUrl.push(data.fileUrl);
						})
					}
					obj.error_fn  = ()=>{
						$scope.$apply(() => {
							$scope.uploading = false;
						});
					}
					oss.init([obj]); // 页面可配置多个上传,放到数组中一起init
					$scope.initUpload = true;
				};
				$scope.uploading = false;
				$scope.imgUrl = [];
				$scope.delImg = (i)=>{
					$scope.imgUrl.splice(i,1);
				};
				$scope.submitPayInfo = ()=>{
					$scope.payInfoForm.$submitted=true;
					if($scope.payInfoForm.$valid&&$scope.payInfo.channel&&$scope.imgUrl.length>0){
						$scope.payInfo.imgUrl = $scope.imgUrl.join();
						console.log($scope.payInfo);
						appApi.savePaymentOrder($scope.payInfo,(data)=>{
							console.log(1231323);
							toastr.success('提交成功');
							$scope.$modal.modal('hide');
							$rootScope.$broadcast('loadPayInfo');
						});
					}
				};
				$scope.$modal.on('shown.bs.modal', function() {
					if(!$scope.initUpload){
						$scope.ossInit();
					}
				});
				$scope.$modal.on('hide.bs.modal', function() {
					if($scope.payInfoForm.$dirty) {
						$scope.payInfo = {};
					};
					$scope.uploading = false;
					$scope.imgUrl = [];
					$scope.payInfoForm.$setPristine();
					$scope.payInfoForm.$setUntouched();
				});
				let showAddPay = $scope.$on('showAddPay', function(e,id) {
					$scope.$modal.modal('show');
					$scope.orderNo = id;
					$scope.payInfo = {
						orderNo:$scope.orderNo,
						paymentTimeStr:moment().format('YYYY-MM-DD HH:mm:ss')
					};
				});
				$scope.$on('$destory', function() {
					showAddPay();
				});
			}
		}
	});
	appDirectives.directive('clientUpdate', function($rootScope,appApi) {
		return {
			restrict: 'E',
			scope: {
				id:'=?',
				type:'='
			},
			replace: true,
			template: `
			<form name="clientForm" novalidate>
				<div class="info-block">
					<h3>基本信息:</h3>
					<div class="info-body">
						<div ng-if="type==1">
							<span>ID:<i ng-bind="detailModel.userId"></i></span>
						</div>
						<div>
							<span><i class="color-red">*</i>姓名:</span>
							<input class="default-input" type="text" name="name" ng-model="detailModel.realname" required ng-class="{'error':clientForm.$submitted&&clientForm.name.$invalid}" />
						</div>
						<div>
							<span><i class="color-red">*</i>性别:</span>
							<drop-down render-data="$root.enumData.gender" model="detailModel.sex" ng-class="{'error':clientForm.$submitted&&(detailModel.sex===undefined||detailModel.sex==='')}"></drop-down>
						</div>
						<div>
							<span>年龄:</span>
							<drop-down render-data="$root.enumData.age" model="detailModel.age"></drop-down>
						</div>
						<div>
							<span>生日:</span>
							<input class="default-input" type="date" name="birthdayStr" ng-model="detailModel.birthdayStr"/>
						</div>
						<div>
							<span><i class="color-red">*</i>手机号:</span>
							<input class="default-input mobile" ng-readonly="type==1" type="text" name="mobile" ng-model="detailModel.mobile" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" ng-class="{'error':clientForm.$submitted&&clientForm.mobile.$invalid}"/>
						</div>
						<div>
							<span>QQ:</span>
							<input class="default-input" type="text" name="qq" ng-model="detailModel.qq" />
						</div>
						<div>
							<span>微信:</span>
							<input class="default-input" type="text" name="wechatNumber" ng-model="detailModel.wechatNumber" />
						</div>
						<div>
							<span>邮箱:</span>
							<input class="default-input" type="text" name="email" ng-model="detailModel.email" />
						</div>
						<div>
							<span>户籍:</span>
							<input class="default-input" type="text" name="censusRegister" ng-model="detailModel.censusRegister" />
						</div>
						<div>
							<span><i class="color-red">*</i>省:</span>
							<drop-down render-data="$root.enumData.regionList" model="detailModel.province" display="'provinceName'" val="'provinceId'" click-event="provinceClick" ng-class="{'error':clientForm.$submitted&&!detailModel.province}"></drop-down>
						</div>
						<div>
							<span><i class="color-red">*</i>市:</span>
							<drop-down render-data="cityList" model="detailModel.city" display="'cityName'" val="'cityId'" ng-class="{'error':clientForm.$submitted&&!detailModel.city}"></drop-down>
						</div>
						<div>
							<span>家庭住址:</span>
							<input class="default-input" type="text" name="homeAddress" ng-model="detailModel.homeAddress" />
						</div>
						<div>
							<span>小区:</span>
							<input class="default-input" type="text" name="plot" ng-model="detailModel.plot" />
						</div>
						<div>
							<span>是否已婚:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isMarried"></drop-down>
						</div>
						<div>
							<span>是否有小孩:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isKid"></drop-down>
						</div>
						<div>
							<span>工作单位:</span>
							<input class="default-input" type="text" name="company" ng-model="detailModel.company" />
						</div>
						<div>
							<span>职务:</span>
							<input class="default-input" type="text" name="job" ng-model="detailModel.job" />
						</div>
						<div>
							<span>学历:</span>
							<drop-down render-data="$root.enumData.education" model="detailModel.education"></drop-down>
						</div>
						<div>
							<span>用户状态:</span>
							<drop-down render-data="$root.enumData.userStatus" model="detailModel.userStatus"></drop-down>
						</div>
						<div>
							<span>等级:</span>
							<drop-down render-data="$root.enumData.userLevel" model="detailModel.userLv"></drop-down>
						</div>
						<div>
							<span>是否有赠品:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isGift"></drop-down>
						</div>
						<div>
							<span>是否有投诉:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isComplain"></drop-down>
						</div>
						<div>
							<span>是否要回访:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isVisit"></drop-down>
						</div>
					</div>
				</div>
				<div class="info-block">
					<h3>购买意向:</h3>
					<div class="info-body">
						<div>
							<span>是否有车:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isCar"></drop-down>
						</div>
						<div>
							<span>已有车型:</span>
							<input class="default-input short" type="text" name="haveCar" ng-model="detailModel.haveCar"/>
						</div>
						<div>
							<span>有车年限:</span>
							<input class="default-input short" type="number" name="haveCarYear" ng-model="detailModel.haveCarYear"/>
						</div>
						<div>
							<span>已有车保险价格:</span>
							<input class="default-input short" type="text" name="carInsurancePrice" ng-model="detailModel.carInsurancePrice" />
						</div>
						<div>
							<span>已有车保险种内容:</span>
							<input class="default-input short" type="text" name="carInsuranceContent" ng-model="detailModel.carInsuranceContent" />
						</div>
						<div>
							<span>是否已试驾:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isTestDrive"></drop-down>
						</div>
						<div class="has-textarea">
							<span>试驾反馈:</span>
							<textarea class="default-textarea" ng-model="detailModel.testDriveFeedback" rows="4"></textarea>
						</div>
						<div class="has-textarea">
							<span>产品建议:</span>
							<textarea class="default-textarea" ng-model="detailModel.productProposal" rows="4"></textarea>
						</div>
						<div class="has-textarea">
							<span>购买意向:</span>
							<textarea class="default-textarea" ng-model="detailModel.buyInclination" rows="4"></textarea>
						</div>
						<div>
							<span>几个车位:</span>
							<input class="default-input short" type="text" name="carportNumber" ng-model="detailModel.carportNumber" />
						</div>
						<div>
							<span>车位情况:</span>
							<input class="default-input short" type="text" name="carportCondition" ng-model="detailModel.carportCondition" />
						</div>
						<div>
							<span>是否能充电:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isRecharge"></drop-down>
						</div>
						<div>
							<span>购车使用人:</span>
							<drop-down class="short" render-data="$root.enumData.carUser" model="detailModel.buyCarUser"></drop-down>
						</div>
						<div>
							<span>接受价格:</span>
							<input class="default-input short" type="text" name="acceptPrice" ng-model="detailModel.acceptPrice" />
						</div>
						<div>
							<span>购车用途:</span>
							<drop-down render-data="$root.enumData.carUse" model="detailModel.buyCarUse"></drop-down>
						</div>
						<div>
							<span>意向车型:</span>
							<input class="default-input short" type="text" name="catTypeInclination" ng-model="detailModel.catTypeInclination"/>
						</div>
						<div>
							<span>意向配置:</span>
							<input class="default-input short" type="text" name="deployInclination" ng-model="detailModel.deployInclination" />
						</div>
						<div>
							<span>意向车色:</span>
							<input class="default-input short" type="text" name="carColorInclination" ng-model="detailModel.carColorInclination" />
						</div>
						<div>
							<span>购车关注因素:</span>
							<drop-down class="short" render-data="$root.enumData.buyFocus" model="detailModel.buyCarFactor"></drop-down>
						</div>
						<div>
							<span>是否需要专属订制:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExclusive"></drop-down>
						</div>
						<div>
							<span>信息来源渠道:</span>
							<drop-down class="short" render-data="$root.enumData.infoSource" model="detailModel.infobahn"></drop-down>
						</div>
						<div>
							<span>是否体验车用户:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExperienceCar"></drop-down>
						</div>
						<div>
							<span>用户接触次数:</span>
							<input class="default-input short" type="text" name="customerCount" ng-model="detailModel.customerCount" />
						</div>
						<div>
							<span>用户接触原因:</span>
							<input class="default-input short" type="text" name="customerReason" ng-model="detailModel.customerReason" />
						</div>
					</div>
				</div>
				<div class="btn-wrapper">
					<i class="error-msg" ng-if="showError&&clientForm.$submitted">请完整且正确的填写客户信息</i>
					<a class="button" hm-tap="affirm()">确定</a>
					<a class="button" hm-tap="detailRest()">重置</a>
				</div>
			</div>`,
			controller: function($scope, $element, $attrs) {
				$scope.detailData = {};
				$scope.detailModel = {};
				let detailIsChange = ()=>{
					return !(JSON.stringify($scope.userDetail) == JSON.stringify($scope.detailModel));
				};
				let getDetail = () => {
					$('body').loading();
					appApi.getUserBack($scope.id, (data) => {
						$('body').find('.inline-loading').remove();
						delete data.user.createdTime;
						delete data.user.updatedTime;
						data.user.birthdayStr = moment(data.user.birthday)._d;
						delete data.user.birthday;
						$scope.detailData = data.user;
						$scope.detailModel = $.extend(true,{},data.user);
						$('body').find('.inline-loading').remove();
						if(data.user.province){
							getCityList(data.user.province);
						}
					});
				};
				let getCityList = (id)=>{
					$scope.cityList = [];
					for(let item of $rootScope.enumData.regionList){
						if(item.provinceId==id){
							$scope.cityList = item.cityList;
						}
					};
				};
				if($scope.type==1){
					getDetail();
				};
				$($element).find('.mobile').on('blur',function(){
					if($(this).hasClass('ng-valid')&&$scope.type!=1){
						appApi.checkMobile($(this).val(),(data)=>{
							console.log(data);
							if(data.data.code==200){
								$(this).removeClass('error');
							}else{
								$(this).addClass('error');
							}
						});
					};
				});
				$scope.provinceClick = (e,i)=>{
					getCityList(i.provinceId);
				};
				$scope.affirm = () => {
					$scope.clientForm.$submitted = true;
					setTimeout(()=>{
						if($($element).find('.error').length==0){
							$scope.showError = false;
							let postData = $.extend(true, {}, $scope.detailModel);
							postData.birthdayStr = moment(postData.birthdayStr).format('YYYY-MM-DD');
							if($scope.type==1){
								console.log('update');
								appApi.updateUserBack(postData,(data)=>{
									console.log(data);
									toastr.success('成功更新用户资料');
									$scope.$emit('hideDetail');
									$rootScope.$broadcast('loadClientList');
								});
							}else{
								appApi.saveUserBack(postData,(data)=>{
									console.log(data);
									toastr.success('成功新建用户');
									$scope.$emit('hideAddClient');
									$rootScope.$broadcast('loadClientList');
								});
							}
						}else{
							$scope.$apply(() => {
								$scope.showError = true;
							});
						}
					});
				};
				$scope.detailRest = ()=>{
					$scope.detailModel = $.extend(true,{},$scope.userDetail);
				};
				
			}
		}
	});
	appDirectives.directive('idcardCheck', function(){
        return{
            require: '?ngModel',
            link: function($scope, $elem, $attrs, ctrl){
                ctrl.$validators.idcardCheck = function(modelValue, viewValue){
                    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                    var reg =  /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i
                    // console.log(reg.test(value))
                    var value = modelValue || viewValue;
                    if(!value||!reg.test(value))return false;

                    if(!city[String(value).substr(0,2)])return false;

                    return true;
                }
              }
        }
    })
});