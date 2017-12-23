'use strict';

define(['angular', 'moment', 'jquery', 'toastr'], function (angular, moment, $, toastr) {
	'use strict';

	var appDirectives = angular.module('app.newOrder', []);
	appDirectives.directive('newOrder', function ($rootScope, appApi, $timeout) {
		return {
			restrict: 'E',
			scope: {
				userId: '='
			},
			replace: true,
			template: '\n\t\t\t\t<div class="modal fade custom-modal" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t\t<div class="modal-header">{{title}}</div>\n\t\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t\t<form id="orderForm" name="orderForm" novalidate onsubmit="return false;" ng-class="{\'form-submited\': orderForm.$submitted}">\n\t\t\t\t\t\t\t\t<div class="config">\n\t\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t\t<span>\u7C7B\u522B:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.chebie.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="chebie" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-disabled="service" ng-model="orderModel.orderType" ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-change="typeChange()">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t    \t\t\t\t\t\t\t</select>\n\t\t    \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u7CFB:</span>\n\t\t\t\t\t\t\t\t\t\t <select chosen disabled width="256" ng-model="orderModel.product">\n\t\t\t\t\t\t\t\t\t\t \t<option value="" select>E-100</option>\n\t\t    \t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u578B:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.chexing.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="chexing" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-model=\'selectProduct\' width="256" disable-search="true" ng-change="productChange(selectProduct)"  ng-options="item.productName for item in listCar">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u9876\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.cheding.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="cheding" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="changeColorOne(selectOrder.selectColorOne)" width="256"  ng-model="selectOrder.selectColorOne" ng-options="item for item in colorOne.select" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u8F66\u8EAB\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.cheshen.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="cheshen" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="changeColorTow(selectOrder.selectColorTow)" width="256"  ng-model="selectOrder.selectColorTow" ng-options=" item for item in colorTow.select" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u5185\u9970\u989C\u8272:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.neishi.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="neishi" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" width="256"  ng-model="orderModel.level3Type" ng-options="item for item in colorThree.select" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u914D\u4EF6:</span>\n\t\t\t\t\t\t\t\t\t\t<select name="" multiple chosen placeholder-text-multiple="\'\u8BF7\u9009\u62E9\'" width="256" ng-change="selectPei(orderModel.data)"  ng-model="orderModel.data" ng-options="item.productId as item.productName for item in peiList" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u4F18\u60E0:</span>\n\t\t\t\t\t\t\t\t\t\t<select name="" chosen placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="promotionChange(selectOrder.selectPromotion)" width="256" chosen id="" ng-model="selectOrder.selectPromotion" ng-options="item.promotionName for item in promotions" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t<span class="subjoin" ng-bind="selectOrder.selectPromotion.discount"></span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65B9\u5F0F:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.payType.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="payType" required chosen placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="payTypeChange(orderModel.payType)" width="256" chosen id="" ng-model="orderModel.payType" ng-options="item.value as item.name for item in $root.enumData.payType" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u95E8\u5E97:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.tiche.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="tiche" chosen required placeholder-text-single="\'\u8BF7\u9009\u62E9\'" width="256" ng-model="orderModel.storeId" ng-options="item.storeId as item.storeName for item in listStore" ng-change="storeChange()"  id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t\t\t<span>\u516C\u53F8:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" ng-model="orderModel.organization" type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u624B\u673A\u53F7:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" ng-model="orderModel.mobile" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u59D3\u540D:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" ng-model="orderModel.realname" required type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 0&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u8EAB\u4EFD\u8BC1:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" ng-model="orderModel.idCard" required idcard-check type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5206\u7C7B1:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.class1.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="class1" chosen required width="256" placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="changeLv1(selectOrder.classlv1)" ng-model="selectOrder.classlv1" ng-options="item for item in listClassLv1" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5206\u7C7B2:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.class2.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="class2" chosen required width="256" placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="changeLv2(selectOrder.classlv2)" ng-model="selectOrder.classlv2" ng-options="item for item in listClassLv2" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u5546\u54C1:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.chep.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="chep" chosen required width="256" placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-change="chooseProduct(selectOrder.selectProduct)" ng-model="selectOrder.selectProduct" ng-options="item.productName for item in productsData" id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t\t\t<span>\u63D0\u8D27\u5730\u70B9:</span>\n\t\t\t\t\t\t\t\t\t\t<div ng-class="{\'ng-invalid\': orderForm.tihuo.$invalid}">\n\t\t\t\t\t\t\t\t\t\t\t<select name="tihuo" chosen required width="256" placeholder-text-single="\'\u8BF7\u9009\u62E9\'" ng-model="productModel.storeId" ng-options="item.storeId as item.storeName for item in listStore"  id="" disable-search="true">\n\t\t\t\t\t\t\t\t\t\t\t\t<option value="">\u8BF7\u9009\u62E9</option>\n\t\t\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="(orderModel.orderType === 1||orderModel.orderType === 2)&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u624B\u673A\u53F7:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" name="buyerphone" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" ng-readonly="service" ng-model="productModel.mobile" type="number" ng-change="mobileChange()" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u59D3\u540D:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" name="realname" required ng-model="productModel.realname" type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 1&&!userId">\n\t\t\t\t\t\t\t\t\t\t<span>\u8EAB\u4EFD\u8BC1:</span>\n\t\t\t\t\t\t\t\t\t\t<div class="form-input-wrapper">\n\t\t\t\t\t\t\t\t\t\t\t<input class="default-input" name="cardId" required ng-model="productModel.idCard" idcard-check type="text" />\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item" ng-if="orderModel.orderType === 2">\n\t\t\t\t\t\t\t\t\t\t<span>\u5546\u54C1:</span>\n\t\t\t\t\t\t\t\t\t\t<drop-down ng-class="{\'error\':orderForm.$submitted&&(serviceModel.productId==\'\'||serviceModel.productId==undefined)}" render-data="serviceProduct" display="\'productName\'" val="\'productId\'" model="serviceModel.productId" click-event="serviceClick"></drop-down>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item item-2 license" ng-if="orderModel.orderType === 2">\n\t\t\t\t\t\t\t\t\t\t<span>\u4E0A\u724C\u5730\u70B9:</span>\n\t\t\t\t\t\t\t\t\t\t<drop-down ng-class="{\'error\':orderForm.$submitted&&(serviceModel.provinceId==\'\'||serviceModel.provinceId==undefined)}" render-data="$root.enumData.regionList" display="\'provinceName\'" val="\'provinceId\'" model="serviceModel.provinceId" click-event="provinceClick" readonly="\'readonly\'"></drop-down>\n\t\t\t\t\t\t\t\t\t\t<drop-down ng-class="{\'error\':orderForm.$submitted&&(serviceModel.cityId==\'\'||serviceModel.cityId==undefined)}" render-data="cityList" display="\'cityName\'" val="\'cityId\'" model="serviceModel.cityId" click-event="cityClick" readonly="\'readonly\'"></drop-down>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="item item-3" ng-if="orderModel.orderType === 2">\n\t\t\t\t\t\t\t\t\t\t<span>\u8D2D\u8F66\u8BA2\u5355:</span>\n\t\t\t\t\t\t\t\t\t\t<drop-down ng-class="{\'error\':orderForm.$submitted&&(serviceModel.orderId==\'\'||serviceModel.orderId==undefined)}" render-data="userOrderList" display="\'productDetail\'" val="\'orderId\'" model="serviceModel.orderId" click-event="orderChange" readonly="service"></drop-down>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t<div class="price-info" ng-if="orderModel.orderType === 0">\n\t\t\t\t\t\t\t\t<p>\u8F66\u4EF7:<i>{{carDisPrice?carDisPrice:carPrice | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p>\u914D\u4EF6:<i>{{peiPrice?peiPrice:0 | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p>\u56E2\u8D2D\u4F18\u60E0:<i>{{selectOrder.selectPromotion.discount?selectOrder.selectPromotion.discount:0 | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p>\u56FD\u5BB6\u8865\u8D34:<i>{{guoDisc?guoDisc:0 | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p>\u5730\u533A\u8865\u8D34:<i>{{diDisc?diDisc:0 | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p>\u5382\u5BB6\u8865\u8D34:<i>{{changDisc?changDisc:0 | currency:\'\uFFE5\'}}</i></p>\n\t\t\t\t\t\t\t\t<p class="total color-bdprimary">\u603B\u4EF7:<i>{{getSum() | currency:\'\uFFE5\'}}</i><span class="other-cost" ng-if="orderModel.payType==1">\u5B9A\u91D1 : \xA52000.00</span><span class="other-cost" ng-if="orderModel.payType==2">\u5206\u671F : \xA52000.00</span></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="price-info" ng-if="orderModel.orderType === 1">\n\t\t\t\t\t\t\t\t<p class="total color-bdprimary">\u603B\u4EF7:<i><em>\xA5</em>{{productPrice?productPrice:0}}</i></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="price-info" ng-if="orderModel.orderType === 2">\n\t\t\t\t\t\t\t\t<p class="total color-bdprimary">\u603B\u4EF7:<i><em>\xA5</em>{{serviceTotal?serviceTotal:0}}</i></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="btn-wrapper">\n\t\t\t\t\t\t\t\t<a class="button" hm-tap="submit">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t\t<a class="button" hm-tap="closeModal">\u53D6\u6D88</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.title = '创建订单';
			},
			link: function link($scope, $elements, $attrs, controllers) {
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
					accountId: $rootScope.loginfo.account.accountId,
					storeId: $rootScope.storeId
				};
				function init() {
					$scope.colorOne = {};
					$scope.colorTow = {};
					$scope.colorThree = {};
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
				appApi.listCar(function (data) {
					$scope.listCar = data.map(function (item) {
						return {
							productName: item.productName.split('-')[1],
							productId: item.productId,
							defaultPrice: item.defaultPrice,
							deposit: item.deposit,
							peiList: item.peiList
						};
					});
				});

				//获取活动
				appApi.getPromotion(function (data) {
					$scope.promotions = data;
					console.log($scope.promotions);
				});

				//获取提车点
				appApi.listStoreMall(function (data) {
					$scope.listStore = data;
				});

				//获取商品的分类
				appApi.listClassifyLv1(function (data) {
					$scope.listClassLv1 = data;
				});
				//获取服务商品列表
				appApi.listServiceProduct(function (data) {
					$scope.serviceProduct = data;
					console.log(data);
				});
				function getColor(data, fn) {
					appApi.getCarColor(data, function (d) {
						fn(d);
					});
				};

				function getProductType(data, fn) {
					appApi.listClassify(data, function (d) {
						fn(d);
					});
				};
				var getSubsidy = function getSubsidy() {
					$scope.subsidy = 0;
					$scope.changDisc = undefined;
					$scope.diDisc = undefined;
					$scope.guoDisc = undefined;
					$scope.carDisPrice = undefined;
					$scope.carDiscDeployId = undefined;
					if ($scope.orderModel.storeId) {
						var provinceId = undefined,
						    cityId = undefined;
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = $scope.listStore[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var item = _step.value;

								if (item.storeId == $scope.orderModel.storeId) {
									provinceId = item.provinceId;
									cityId = item.cityId;
								};
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

						;
						appApi.listCarDisc({
							isUse: 1,
							provinceId: provinceId,
							cityId: cityId,
							productId: $scope.orderModel.productId
						}, function (data) {
							if (data.length) {
								$scope.changDisc = data[0].changDisc;
								$scope.diDisc = data[0].diDisc;
								$scope.guoDisc = data[0].guoDisc;
								$scope.carDisPrice = data[0].price;
								$scope.carDiscDeployId = data[0].carDiscDeployId;
								$scope.subsidy = $scope.changDisc + $scope.diDisc + $scope.guoDisc;
							};
						});
					};
				};
				var listCarDisc = function listCarDisc() {
					if (!$scope.serviceModel.provinceId || !$scope.serviceModel.cityId || !$scope.serviceModel.productId) {
						$scope.serviceTotal = 0;
						$scope.serviceModel.carDiscDeployId = undefined;
					} else {
						appApi.listCarDisc({
							isUse: 1,
							provinceId: $scope.serviceModel.provinceId,
							cityId: $scope.serviceModel.cityId,
							productId: $scope.serviceModel.productId
						}, function (d) {
							if (d.length != 0) {
								$scope.serviceTotal = d[0].price;
								$scope.serviceModel.carDiscDeployId = d[0].carDiscDeployId;
							} else {
								var _iteratorNormalCompletion2 = true;
								var _didIteratorError2 = false;
								var _iteratorError2 = undefined;

								try {
									for (var _iterator2 = $scope.serviceProduct[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
										var item = _step2.value;

										if (item.productId == $scope.serviceModel.productId) {
											$scope.serviceTotal = item.defaultPrice;
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
							}
						});
					};
				};
				var getCityList = function getCityList() {
					$scope.cityList = [];
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = $rootScope.enumData.regionList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var item = _step3.value;

							if (item.provinceId == $scope.serviceModel.provinceId) {
								$scope.cityList = item.cityList;
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					;
				};
				$scope.provinceClick = function () {
					$timeout(function () {
						getCityList();
					}, 0);
					$scope.serviceModel.cityId = '';
				};
				$scope.serviceClick = function () {
					$timeout(function () {
						listCarDisc();
					}, 0);
				};
				$scope.orderChange = function (e, i) {
					console.log(i);
					$scope.serviceModel.provinceId = i.provinceId;
					getCityList();
					$scope.serviceModel.cityId = i.cityId;
					listCarDisc();
				};
				$scope.storeChange = function () {
					$timeout(function () {
						getSubsidy();
						console.log(666);
					}, 0);
				};
				$scope.mobileChange = function (id) {
					if ($($elements).find('.inline-loading').length == 0) {
						$($elements).find('.modal-content').loading();
					};
					appApi.listCarOrderBack($scope.productModel.mobile, function (d) {
						console.log(d);
						$scope.userOrderList = d.list;
						if (id) {
							$scope.serviceModel.orderId = id;
						};
						$($elements).find('.modal-content').find('.inline-loading').remove();
					});
				};
				$scope.typeChange = function () {
					console.log($scope.orderType);
				};
				$scope.productChange = function (product) {
					console.log('select: ', product);
					if ($scope.orderModel.productId == product.productId) return;
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
					}, function (data) {
						$scope.colorOne = data;
					});
					getSubsidy();
				};
				$scope.changeColorOne = function (colorOne) {
					if (colorOne === $scope.orderModel.level1Type) return;
					$scope.orderModel.level1Type = colorOne;
					$scope.orderModel.level2Type = '';
					$scope.orderModel.level3Type = '';
					$scope.selectOrder.selectColorTow = '';
					$scope.colorThree = {};
					getColor({
						productId: $scope.orderModel.productId,
						level1Type: colorOne
					}, function (data) {
						$scope.colorTow = data;
					});
				};
				$scope.changeColorTow = function (colorTow) {
					if (colorTow === $scope.orderModel.level1Type) return;

					$scope.orderModel.level2Type = colorTow;
					$scope.orderModel.level3Type = '';
					getColor({
						productId: $scope.orderModel.productId,
						level1Type: $scope.orderModel.level1Type,
						level2Type: $scope.orderModel.level2Type
					}, function (data) {
						$scope.colorThree = data;
					});
				};
				var typeObj = {};
				$scope.changeLv1 = function (classlv1) {
					if (classlv1 === typeObj.classlv1) return;
					typeObj.classlv1 = classlv1;
					$scope.productsData = undefined;
					$scope.selectOrder.selectProduct = undefined;
					$scope.selectOrder.classlv2 = '';

					if (classlv1 === '') return;
					getProductType({
						subtype: classlv1
					}, function (data) {
						$scope.listClassLv2 = data.list;
					});
				};
				$scope.changeLv2 = function (classlv2) {
					appApi.listProduct({
						subtype: $scope.selectOrder.classlv1,
						subtype2: classlv2
					}, function (data) {
						$scope.productsData = data;
					});
				};
				$scope.promotionChange = function (promotion) {
					if (promotion.promotionId === $scope.orderModel.promotionId) return;

					$scope.orderModel.promotionId = promotion.promotionId;
				};
				$scope.selectPei = function (peiArr) {
					var peiPrice = 0;
					$scope.peiList.forEach(function (item) {
						if (peiArr.indexOf(item.productId) > -1) {
							peiPrice += Number(item.default_price);
						}
					});
					$scope.peiPrice = peiPrice;
				};
				$scope.chooseProduct = function (product) {
					$scope.productModel.productId = product.productId;
					$scope.productPrice = product.defaultPrice;
				};
				$scope.payTypeChange = function (t) {
					console.log(t);
					if (t === 0) {
						$scope.payDiscounts = 0;
					} else {
						$scope.payDiscounts = 0;
					}
				};
				$scope.closeModal = function () {
					$scope.$modal.modal('toggle');
					init();
				};
				$scope.getSum = function () {
					var carPrice = angular.isNumber($scope.carDisPrice) ? +$scope.carDisPrice : angular.isNumber($scope.carPrice) ? +$scope.carPrice : 0;
					var pei = angular.isNumber($scope.peiPrice) ? +$scope.peiPrice : 0;
					var discount = angular.isNumber($scope.selectOrder.selectPromotion) ? +$scope.discount : 0;
					var subsidy = angular.isNumber($scope.subsidy) ? +$scope.subsidy : 0;
					console.log($scope.payDiscounts);
					console.log(carPrice);
					console.log(subsidy);
					var total = carPrice + pei - discount - subsidy - $scope.payDiscounts;
					return total > 0 ? total : 0;
				};
				$scope.submit = function () {
					var _this = this;

					console.log($scope.serviceModel);
					$scope.orderForm.$submitted = true;
					$timeout(function () {
						if ($scope.orderForm.$valid && $($elements).find('.error').length == 0) {
							if ($scope.orderModel.orderType == 0) {
								var orderModel = Object.assign({}, $scope.orderModel);
								orderModel.data = orderModel.data && orderModel.data.join(',');
								delete orderModel.orderType;
								if ($scope.carDiscDeployId) orderModel.carDiscDeployId = $scope.carDiscDeployId;
								if ($scope.userId) orderModel.userId = $scope.userId;
								getCreateOrder().call(_this, orderModel, fn_success, fn_fail);
							} else if ($scope.orderModel.orderType == 1) {
								var productModel = Object.assign({}, $scope.productModel);
								if ($scope.userId) productModel.userId = $scope.userId;
								getProductOrder().call(_this, productModel, fn_success, fn_fail);
							} else if ($scope.orderModel.orderType == 2) {
								var serviceModel = Object.assign({}, $scope.serviceModel);
								getProductOrder().call(_this, serviceModel, fn_success, fn_fail);
							}
						};
					}, 0);
				};
				function fn_success(res) {
					$scope.closeModal();
					$scope.$emit('addOrderClose');
					$scope.$emit('getServiceOrder');
					toastr.success('创建成功');
				};

				function fn_fail() {};
				function getCreateOrder() {
					if ($scope.userId) {
						return appApi.createOrderWithUserId;
					} else {
						return appApi.createOrder;
					}
				};
				function getProductOrder() {
					if ($scope.orderModel.orderType == 2) {
						return appApi.createServiceOrderBack;
					} else {
						if ($scope.userId) {
							return appApi.createProductWithUserId;
						} else {
							return appApi.createProduct;
						}
					}
				};
				$scope.$modal.on('hide.bs.modal', function () {
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
				var addOrder = $rootScope.$on('addOrder', function (e, data) {
					console.log('addOrder');
					$scope.$modal.modal('show');
					if (data && data.service) {
						$scope.title = '创建服务订单';
						$scope.service = true;
						$scope.orderModel.orderType = 2;
						$scope.productModel.mobile = parseInt(data.item.buyerMobile);
						console.log(data.item.orderId);
						$scope.mobileChange(data.item.orderId);
						//						$scope.serviceModel.orderId = data.item.orderId;
						$scope.orderChange(undefined, data.item);
					};
				});
				$scope.$on('$destroy', function () {
					addOrder();
				});
			}
		};
	});
});