define(['angular', 'moment', 'jquery','toastr'], function(angular, moment, $,toastr) {
	'use strict';
	var appDirectives = angular.module('app.newOrder', []);
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
											<select name="chebie" chosen required placeholder-text-single="'请选择'" ng-model="orderModel.orderType" ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-change="typeChange()">
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
										<select name="" chosen  placeholder-text-single="'请选择'" ng-change="promotionChange(selectOrder.selectPromotion)" width="256" chosen id="" ng-model="selectOrder.selectPromotion" ng-options="item.promotionName for item in promotions" disable-search="true">
											<option value="">请选择</option>
										</select>
										<span class="subjoin" ng-bind="selectOrder.selectPromotion.discount"></span>
									</div>
									<div class="item" ng-if="orderModel.orderType === 0">
										<span>提车门店:</span>
										<div ng-class="{'ng-invalid': orderForm.tiche.$invalid}">
											<select name="tiche" chosen required placeholder-text-single="'请选择'" width="256" ng-model="orderModel.storeId" ng-options="item.storeId as item.storeName for item in listStore"  id="" disable-search="true">
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
											<input class="default-input" name="buyerphone" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" ng-model="productModel.mobile" type="number" ng-change="mobileChange()" />
										</div>
									</div>
									<div class="item" ng-if="(orderModel.orderType === 1||orderModel.orderType === 2)&&!userId">
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
									<div class="item item-2" ng-if="orderModel.orderType === 2">
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
								<p>车价:<i>{{carPrice}}</i></p>
								<p>配件:<i>{{peiPrice}}</i></p>
								<p>活动优惠:<i>{{selectOrder.selectPromotion.discount}}</i></p>
								<p class="total color-bdprimary">总价:<i><em>¥</em>{{getSum()}}</i></p>
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
					}
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
				appApi.listServiceProduct((data) => {
					$scope.serviceProduct = data;
					console.log(data);
				});

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
				let listCarDisc = ()=>{
					appApi.listCarDisc({
						provinceId:$scope.serviceModel.provinceId,
						cityId:$scope.serviceModel.cityId,
						productId:$scope.serviceModel.productId
					}, (d) => {
						$scope.serviceTotal = d[0].price;
						$scope.serviceModel.carDiscDeployId = d[0].carDiscDeployId;
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
				$scope.mobileChange = ()=>{
					console.log($scope.productModel.mobile);
					appApi.listOrderByBack($scope.productModel.mobile,(d)=>{
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
					})
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
				$scope.closeModal = function() {
					$scope.$modal.modal('toggle');
					init();
				};
				$scope.getSum = function() {
					var carPrice = angular.isNumber($scope.carPrice) ? +$scope.carPrice : 0;
					var pei = angular.isNumber($scope.peiPrice) ? +$scope.peiPrice : 0;
					var discount = angular.isNumber($scope.selectOrder.selectPromotion) ? +$scope.discount : 0;
					return carPrice + pei - discount;
				};
				$scope.submit = function() {
					console.log($scope.serviceModel);
					$scope.orderForm.$submitted = true;
					if($scope.orderForm.$valid) {
						if($scope.orderModel.orderType == 0) {
							var orderModel = Object.assign({}, $scope.orderModel);
							orderModel.data = orderModel.data && orderModel.data.join(',');
							delete orderModel.orderType
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
					if($scope.orderForm.$dirty) {
						$scope.orderModel = Object.assign({}, orderModelDefault);
						$scope.productModel = Object.assign({}, productModelDefault);
						$scope.orderForm.$setPristine();
						$scope.orderForm.$setUntouched();
					}
				});
			}
		}
	});
});