'use strict';

define(['angular', 'moment', 'jquery', 'nprogress', 'toastr'], function (angular, moment, $, NProgress, toastr) {
	'use strict';

	var appDirectives = angular.module('app.orderDetail', []);
	appDirectives.directive('orderDetail', function ($rootScope, appApi, getOrderStatu) {
		return {
			restrict: 'E',
			scope: {
				// orderId: '=',
			},
			replace: true,
			template: '\n\t\t\t\t<div class="order-info">\n\t\t\t\t\t<header class="clearfix">\n\t\t\t\t\t\t<a class="button pull-left" hm-tap="back">\u8FD4\u56DE</a>\n\t\t\t\t\t\t<span class="pull-left">\u8BA2\u5355\u8BE6\u60C5&nbsp;&nbsp;(\u7F16\u53F7:{{orderDetail.orderNo}})</span>\n\t\t\t\t\t</header>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8D2D\u8F66\u4EBA\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA:</span><i>{{orderDetail.buyerName}} {{\'(\' + (orderDetail.gender | formatGender) + \')\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u8D2D\u4E70\u4EBA\u8BC1\u4EF6\u53F7\u7801:</span><i>{{orderDetail.buyerIdCard}}</i >\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u59D3\u540D:</span><i>{{orderDetail.buyerName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6536\u8D27\u4EBA\u624B\u673A\u53F7:</span><i>{{orderDetail.buyerMobile}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block">\n\t\t\t\t\t\t<h3>\u8BA2\u5355\u4FE1\u606F:</h3>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type != 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u540D\u79F0:</span><i>{{orderDetail.promotionName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u6761\u6B3E:</span><i>{{orderDetail.terms}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6D3B\u52A8\u91D1\u989D:</span><i>{{orderDetail.discountPrice}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8F66\u5730\u5740:</span><i>{{orderDetail.storeAddress}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u516C\u53F8:</span><i>{{orderDetail.organization}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.statusName }}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u91D1\u989D:</span><i>{{orderDetail.discountPrice  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity || 1}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u539F\u4EF7:</span><i>{{orderDetail.productPrice | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u73B0\u4EF7:</span><i>{{(orderDetail.productPrice - orderDetail.discountPrice)  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-body" ng-show="orderDetail&&orderDetail.type == 1">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4F18\u60E0\u5BA1\u6838\u72B6\u6001:</span><i>15012119780906771X150121</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u63D0\u8D27\u5730\u5740:</span><i>{{orderDetail.storeAddress}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4E0B\u5355\u65F6\u95F4:</span><i>{{orderDetail.formatCreatedTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u65F6\u95F4:</span><i>{{orderDetail.formatPaymentTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u7ED3\u6E05\u65F6\u95F4:</span><i>{{orderDetail.formatConfirmTime}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u72B6\u6001:</span><i>{{orderDetail.statusName}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u5546\u54C1\u660E\u7EC6:</span><i>{{orderDetail.productDetail}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u6570\u91CF:</span><i>{{orderDetail.quantity || 1}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span>\u4EF7\u683C:</span><i>{{(orderDetail.amount * 1)  | currency:\'\uFFE5\'}}</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info">\n\t\t\t\t\t\t<h3 class="clearfix">\n\t\t\t\t\t\t\t<span class="channel">\u652F\u4ED8\u6E20\u9053</span>\n\t\t\t\t\t\t\t<span class="pay-no">\u652F\u4ED8\u53F7</span>\n\t\t\t\t\t\t\t<span class="pay-amount">\u652F\u4ED8\u91D1\u989D</span>\n\t\t\t\t\t\t\t<span class="pay-state">\u72B6\u6001</span>\n\t\t\t\t\t\t\t<span class="pay-date">\u652F\u4ED8\u65F6\u95F4</span>\n\t\t\t\t\t\t\t<span class="pay-memo">\u5907\u6CE8</span>\n\t\t\t\t\t\t\t<span class="pay-code">\u652F\u4ED8\u7801</span>\n\t\t\t\t\t\t\t<span class="handle">\u64CD\u4F5C</span>\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in payment track by $index">\n\t\t\t\t\t\t\t\t<span class="channel">{{item.channel | formatChannel}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-no">{{item.merOrderNo?item.merOrderNo:\'null\'}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-amount">{{item.amount}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-state">{{item.status | payStatuDisplay}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-date">{{item.paymentTimeFormat}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-memo">{{item.comment?item.comment:\'\u65E0\'}}</span>\n\t\t\t\t\t\t\t\t<span class="pay-code" hm-tap="showPayCode(item)"><i class="icon" ng-if="item.status==0&&item.type==0">&#xe608;</i></span>\n\t\t\t\t\t\t\t\t<span class="handle"><a class="button small" hm-tap="cancel(item)" ng-if="item.status==0&&item.type==0">\u53D6\u6D88</a><a class="button small" hm-tap="refund(item)" ng-if="item.status==1&&item.type==0">\u9000\u6B3E</a></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-footer">\n\t\t\t\t\t\t\t<a class="button" hm-tap="addPay()">\u65B0\u589E\u652F\u4ED8\u4FE1\u606F</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block pay-info" ng-show="carInfo.VIN">\n\t\t\t\t\t\t<h3 class="clearfix">\u8F66\u8F86\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body clearfix">\n\t\t\t\t\t\t\t<div class="line pull-left" ng-repeat="item in carInfo track by $index">\n\t\t\t\t\t\t\t\t<span class="vin">VIN:{{item.VIN }}</span>\n\t\t\t\t\t\t\t\t<span class="vsn">VSN: {{item.VSN}}</span>\n\t\t\t\t\t\t\t\t<span class="">\u53D1\u52A8\u673A\u53F7\uFF1A{{item.no}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block appoint-info" ng-show="appoints.length > 0">\n\t\t\t\t\t\t<h3 class="clearfix">\u9080\u7EA6\u4FE1\u606F\uFF1A</h3>\n\t\t\t\t\t\t<div class="info-body">\n\t\t\t\t\t\t\t<div class="line" ng-repeat="item in appoints track by $index">\n\t\t\t\t\t\t\t\t<p>{{item.deliveryStageName}}:  {{item.nickname}} {{item.time}}</p>\n\t\t\t\t\t\t\t\t<p>\u5907\u6CE8:&nbsp&nbsp&nbsp&nbsp{{item.comments}}</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="info-block service-info" ng-show="orderDetail.type==0||orderDetail.type==2">\n\t\t\t\t\t\t<h3 class="clearfix">\n\t\t\t\t\t\t\t<span class="item">\u5546\u54C1</span>\n\t\t\t\t\t\t\t<span class="price">\u4EF7\u94B1</span>\n\t\t\t\t\t\t\t<span class="state">\u72B6\u6001</span>\n\t\t\t\t\t\t\t<span class="date">\u4E0B\u5355\u65F6\u95F4</span>\n\t\t\t\t\t\t\t<span class="handle">\u64CD\u4F5C</span>\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div class="info-body clearfix" ng-repeat="item in serviceOrder track by $index">\n\t\t\t\t\t\t\t<div class="line pull-left">\n\t\t\t\t\t\t\t\t<span class="item">{{item.productName}}</span>\n\t\t\t\t\t\t\t\t<span class="price">\xA5{{item.productPrice}}</span>\n\t\t\t\t\t\t\t\t<span class="state">{{item.status | orderStatu}}</span>\n\t\t\t\t\t\t\t\t<span class="date">{{item.createdTime | dateFormat}}</span>\n\t\t\t\t\t\t\t\t<span class="handle"><a class="button small">\u8BE6\u60C5</a></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="info-footer">\n\t\t\t\t\t\t\t<a class="button" hm-tap="addServiceOrder()">\u65B0\u589E\u670D\u52A1\u8BA2\u5355</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="modal fade custom-modal pay-code-modal" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t\t\t<a class="iconfont" data-dismiss="modal">&#xe60e;</a>\n\t\t\t\t\t\t\t<img src=""/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="modal fade custom-modal refund-modal" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t\t\t<div class="modal-header">\u9000\u6B3E(\u7F16\u53F7:<i>1312312</i>)</div>\n\t\t\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t\t\t<div class="item clearfix">\n\t\t\t\t\t\t\t\t\t\t\t<span class="tag">\u5F85\u9000\u6B3E&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="val">$10000</span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t\t\t<div class="item clearfix">\n\t\t\t\t\t\t\t\t\t\t\t<span class="tag">\u652F\u4ED8\u7C7B\u578B&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="val">POS</span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t\t\t<div class="item clearfix">\n\t\t\t\t\t\t\t\t\t\t\t<span class="tag">\u5907\u6CE8&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t\t\t<textarea class="default-textarea" ng-model="remark" ng-class="{\'error\':submited&&(remark==undefined||remark==\'\')}" rows="4"></textarea>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t\t\t<a class="button" hm-tap="affirm()">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t\t\t<a class="button" data-dismiss="modal">\u53D6\u6D88</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.$refundModal = $($element).find('.refund-modal').clone();
				$scope.$payCodeModal = $($element).find('.pay-code-modal').clone();
				$('body').append($scope.$payCodeModal);
				$('body').append($scope.$refundModal);
				setTimeout(function () {
					$($element).find('.pay-code-modal').remove();
					$($element).find('.refund-modal').remove();
				}, 0);
				$scope.addPayModal = false;
				var orderId, orderNo;
				$scope.back = function () {
					// $scope.detailShow = false;
					$scope.$emit('detailClose');
				};

				function init() {
					$scope.orderDetail = {};
					$scope.payment = [];
					$scope.appoints = [];
				};

				var loadPayInfo = function loadPayInfo(orderNo) {
					appApi.getPayment({
						orderNo: orderNo
					}, function (data) {
						$scope.payment = data.map(function (item) {
							item.paymentTimeFormat = item.paymentTime ? moment(item.paymentTime).format('YYYY-MM-DD HH:mm:ss') : '无';
							return item;
						});
					});
				};

				function getData(orderType) {
					//订单详情
					appApi.getOrderDetail({
						orderId: orderId
					}, function (data) {
						data.formatCreatedTime = moment(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
						data.formatConfirmTime = !data.confirmTime ? '--' : moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss");
						data.statusName = getOrderStatu(data.status);
						orderNo = data.orderNo;
						$scope.orderDetail = data;
						NProgress.done();

						//支付信息
						loadPayInfo(orderNo);
					});
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
					if (orderType != '1' && orderType != '3') {
						appApi.getCarInfo({
							orderId: orderId
						}, function (data) {
							$scope.carInfo = data;
						});
						appApi.showServiceOrder(orderId, function (d) {
							console.log(d);
							$scope.serviceOrder = d;
						});
					};
				};
				$scope.addPay = function () {
					$rootScope.$broadcast('addPay', {
						orderNo: orderNo,
						orderId: orderId
					});
				};
				$scope.cancel = function () {
					if (window.confirm('是否取消支付信息?')) {
						console.log(123);
					}
				};
				$scope.refund = function () {
					console.log(666);
					$scope.$refundModal.modal('show');
				};
				$scope.showPayCode = function (item) {
					appApi.rePosPay({
						orderId: orderId,
						paymentId: item.paymentId
					}, function (d) {
						$scope.$payCodeModal.data('src', d).modal('show');
					});
				};
				var getPayInfo = $rootScope.$on('loadPayInfo', function (e, data) {
					loadPayInfo(orderNo);
					$scope.$payCodeModal.data('src', data).modal('show');
				});
				var showDetail = $scope.$on('showDetail', function (e, data) {
					NProgress.start();
					// $scope.detailShow = true;
					init();
					if (orderId != data.orderId) {
						orderId = data.orderId;
						console.log(orderId);
						// orderNo = data.orderNo;
						getData(data.type);
					}
				});
				$scope.$payCodeModal.on('show.bs.modal', function () {
					$(this).find('img').attr('src', $(this).data('src'));
				});
				$scope.$on('$destroy', function () {
					getPayInfo();
					showDetail();
					$scope.$refundModal.remove();
					$scope.$payCodeModal.remove();
				});
			}
		};
	});
});