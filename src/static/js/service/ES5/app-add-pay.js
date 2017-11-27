'use strict';

define(['angular', 'moment', 'jquery', 'toastr'], function (angular, moment, $, toastr) {
	'use strict';

	var appDirectives = angular.module('app.addPay', []);
	appDirectives.directive('addPay', function ($rootScope, appApi) {
		return {
			restrict: 'E',
			scope: {
				orderNo: '='
			},
			replace: true,
			//			<drop-down class="transition-02" ng-class="{'error':payInfoForm.$submitted&&(payInfo.channel===undefined||payInfo.channel==='')}" render-data="$root.enumData.payChannel" model="payInfo.channel"></drop-down>
			template: '\n\t\t\t<div class="modal fade custom-modal" style="display:block;" tabindex="-1" role="dialog" aria-hidden="true">\n\t\t\t\t<div class="modal-dialog modal-md">\n\t\t\t\t\t<div class="modal-content">\n\t\t\t\t\t\t<div class="modal-header">\n\t\t\t\t\t\t\t\u652F\u4ED8\u4FE1\u606F(\u7F16\u53F7\uFF1A<i ng-bind="orderNo"></i>)\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t<form name="payInfoForm" novalidate>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u5F85\u652F\u4ED8&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<div class="unpaid">\xA5<i>{{unpaid}}</i></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u91D1\u989D&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<input type="number" class="transition-02 default-input" ng-model="payInfo.amount" name="amount" required ng-class="{\'error\':payInfoForm.$submitted&&payInfoForm.amount.$invalid}" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="item">\n\t\t\t\t\t\t\t\t\t<span>\u652F\u4ED8\u7C7B\u578B&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<div class="val">pos\u652F\u4ED8</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="line">\n\t\t\t\t\t\t\t\t<div class="item special">\n\t\t\t\t\t\t\t\t\t<span>\u5907\u6CE8&nbsp;:</span>\n\t\t\t\t\t\t\t\t\t<textarea class="transition-02 default-textarea" ng-model="payInfo.comment" name="comment" required ng-class="{\'error\':payInfoForm.$submitted&&payInfoForm.comment.$invalid}"></textarea>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="modal-footer">\n\t\t\t\t\t\t\t<a class="button" hm-tap="submitPayInfo()">\u786E\u5B9A</a>\n\t\t\t\t\t\t\t<a class="button" data-dismiss="modal">\u53D6\u6D88</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t',
			controller: function controller($scope, $element, $attrs) {
				$scope.$modal = $($element);
				$scope.submitPayInfo = function () {
					$scope.payInfoForm.$submitted = true;
					if ($scope.payInfoForm.$valid) {
						console.log($scope.payInfo);
						appApi.unifiedOrder($scope.payInfo, function (data) {
							console.log(1231323);
							toastr.success('提交成功');
							$scope.$modal.modal('hide');
							$rootScope.$broadcast('loadPayInfo', data);
						});
					}
				};
				$scope.$modal.on('hide.bs.modal', function () {
					if ($scope.payInfoForm.$dirty) {
						$scope.payInfo = {};
					};
					$scope.payInfoForm.$setPristine();
					$scope.payInfoForm.$setUntouched();
				});
				var getPayInfo = function getPayInfo(id) {
					appApi.getPriceInfo(id, function (d) {
						console.log(d);
						$scope.unpaid = d.payPrice;
					});
				};
				var showAddPay = $rootScope.$on('addPay', function (e, d) {
					$scope.$modal.modal('show');
					$scope.orderNo = d.orderNo;
					$scope.payInfo = {
						orderId: d.orderId
						//						,paymentTimeStr:moment().format('YYYY-MM-DD HH:mm:ss')
					};
					getPayInfo(d.orderId);
				});
				$scope.$on('$destroy', function () {
					showAddPay();
				});
			}
		};
	});
});