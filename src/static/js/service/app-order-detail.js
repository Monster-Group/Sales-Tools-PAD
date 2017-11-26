define(['angular', 'moment', 'jquery', 'nprogress', 'toastr'], function(angular, moment, $, NProgress, toastr) {
	'use strict';
	var appDirectives = angular.module('app.orderDetail', []);
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
							<span class="pay-state">状态</span>
							<span class="pay-date">支付时间</span>
							<span class="pay-memo">备注</span>
							<span class="pay-code">支付码</span>
							<span class="handle">操作</span>
						</h3>
						<div class="info-body clearfix">
							<div class="line pull-left" ng-repeat="item in payment track by $index">
								<span class="channel">{{item.channel | formatChannel}}</span>
								<span class="pay-no">{{item.merOrderNo?item.merOrderNo:'null'}}</span>
								<span class="pay-amount">{{item.amount}}</span>
								<span class="pay-state">状态</span>
								<span class="pay-date">{{item.paymentTimeFormat}}</span>
								<span class="pay-memo">{{item.comment?item.comment:'无'}}</span>
								<span class="pay-code" hm-tap="showPayCode()"><i class="icon">&#xe608;</i></span>
								<span class="handle"><a class="button small" hm-tap="refund()">取消</a></span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button" hm-tap="addPay()">新增支付信息</a>
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
					<div class="info-block service-info" ng-show="orderDetail.type==0||orderDetail.type==2">
						<h3 class="clearfix">
							<span class="item">商品</span>
							<span class="price">价钱</span>
							<span class="state">状态</span>
							<span class="date">下单时间</span>
							<span class="handle">操作</span>
						</h3>
						<div class="info-body clearfix">
							<div class="line pull-left">
								<span class="item">商品</span>
								<span class="price">价钱</span>
								<span class="state">状态</span>
								<span class="date">下单时间</span>
								<span class="handle"><a class="button small">详情</a></span>
							</div>
						</div>
						<div class="info-footer">
							<a class="button" hm-tap="addServiceOrder()">新增服务订单</a>
						</div>
					</div>
					<div class="modal fade custom-modal pay-code-modal" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-md">
							<a class="iconfont" data-dismiss="modal">&#xe60e;</a>
							<img src="static/img/photo.png">
						</div>
					</div>
					<div class="modal fade custom-modal refund-modal" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-md">
							<div class="modal-content">
								<div class="modal-header">退款(编号:<i>1312312</i>)</div>
								<div class="modal-body">
									<div class="line">
										<div class="item clearfix">
											<span class="tag">待退款&nbsp;:</span>
											<span class="val">$10000</span>
										</div>
									</div>
									<div class="line">
										<div class="item clearfix">
											<span class="tag">支付类型&nbsp;:</span>
											<span class="val">POS</span>
										</div>
									</div>
									<div class="line">
										<div class="item clearfix">
											<span class="tag">备注&nbsp;:</span>
											<textarea class="default-textarea" ng-model="remark" ng-class="{'error':submited&&(remark==undefined||remark=='')}" rows="4"></textarea>
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<a class="button" hm-tap="affirm()">确定</a>
									<a class="button" data-dismiss="modal">取消</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			`,
			controller: function($scope, $element, $attrs) {
				$scope.$refundModal = $($element).find('.refund-modal').clone();
				$scope.$payCodeModal = $($element).find('.pay-code-modal').clone();
				$('body').append($scope.$refundModal);
				$('body').append($scope.$payCodeModal);
				setTimeout(()=>{
					$($element).find('.refund-modal').remove();
					$($element).find('.pay-code-modal').remove();
				},0);
				$scope.addPayModal = false;
				var orderId, orderNo;
				$scope.back = function() {
					// $scope.detailShow = false;
					$scope.$emit('detailClose');
				};

				function init() {
					$scope.orderDetail = {};
					$scope.payment = [];
					$scope.appoints = [];
				};

				let loadPayInfo = (orderNo) => {
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
							if(startDay == endDay) {
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
					if(orderType != '1'&&orderType != '3') {
						appApi.getCarInfo({
							orderId: orderId
						}, (data) => {
							$scope.carInfo = data;
						});
						appApi.showServiceOrder(orderId,(d)=>{
							console.log(d);
						});
					};
				};
				$scope.addPay = () => {
					$scope.$emit('addPay', orderNo);
				};
				$scope.cancel = ()=>{
					if(window.confirm('是否取消支付信息?')){
						console.log(123)
					}
				};
				$scope.refund = ()=>{
					console.log(666);
					$scope.$refundModal.modal('show');
				};
				$scope.showPayCode = ()=>{
					$scope.$payCodeModal.modal('show');
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
				$scope.$on('$destroy', function() {
					getPayInfo();
					showDetail();
					$scope.$refundModal.remove();
					$scope.$payCodeModal.remove();
				});
			}
		}
	});
});