define(['angular', 'moment', 'jquery','toastr'], function(angular, moment, $,toastr) {
	'use strict';
	var appDirectives = angular.module('app.addPay', []);
	appDirectives.directive('addPay', function($rootScope,appApi) {
		return {
			restrict: 'E',
			scope: {
				orderNo:'='
			},
			replace: true,
//			<drop-down class="transition-02" ng-class="{'error':payInfoForm.$submitted&&(payInfo.channel===undefined||payInfo.channel==='')}" render-data="$root.enumData.payChannel" model="payInfo.channel"></drop-down>
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
									<span>待支付&nbsp;:</span>
									<div class="unpaid">¥<i>{{unpaid}}</i></div>
								</div>
								<div class="item">
									<span>金额&nbsp;:</span>
									<input type="number" class="transition-02 default-input" ng-model="payInfo.amount" name="amount" required ng-class="{'error':payInfoForm.$submitted&&payInfoForm.amount.$invalid}" />
								</div>
								<div class="item">
									<span>支付类型&nbsp;:</span>
									<div class="val">pos支付</div>
								</div>
							</div>
							<div class="line">
								<div class="item special">
									<span>备注&nbsp;:</span>
									<textarea class="transition-02 default-textarea" ng-model="payInfo.comment" name="comment" required ng-class="{'error':payInfoForm.$submitted&&payInfoForm.comment.$invalid}"></textarea>
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
				$scope.submitPayInfo = ()=>{
					$scope.payInfoForm.$submitted=true;
					if($scope.payInfoForm.$valid){
						console.log($scope.payInfo);
						appApi.unifiedOrder($scope.payInfo,(data)=>{
							console.log(1231323);
							toastr.success('提交成功');
							$scope.$modal.modal('hide');
							$rootScope.$broadcast('loadPayInfo',data);
						});
					}
				};
				$scope.$modal.on('hide.bs.modal', function() {
					if($scope.payInfoForm.$dirty) {
						$scope.payInfo = {};
					};
					$scope.payInfoForm.$setPristine();
					$scope.payInfoForm.$setUntouched();
				});
				let getPayInfo = (id)=>{
					appApi.getPriceInfo(id,(d)=>{
						console.log(d);
						$scope.unpaid = d.payPrice;
					});
				};
				let showAddPay = $rootScope.$on('addPay', function(e,d) {
					$scope.$modal.modal('show');
					$scope.orderNo = d.orderNo;
					$scope.payInfo = {
						orderId:d.orderId
//						,paymentTimeStr:moment().format('YYYY-MM-DD HH:mm:ss')
					};
					getPayInfo(d.orderId);
				});
				$scope.$on('$destroy', function() {
					showAddPay();
				});
			}
		}
	});
});
