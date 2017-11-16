define(['angular'], function(angular) {
try {
  var module = angular.module('app.template');
} catch (e) {
  var module = angular.module('app.template', []);
};
angular.module('app.template').run(['$templateCache', function($templateCache) {
  $templateCache.put('backlog.html',
    '<div class="module-wrapper backlog"><div class="form-header"><div class="line clearfix"><div class="form-item"><span class="form-tag">筛选条件:</span><div class="form-input-wrapper"><a class="checkbox" hm-tap="statusClick($event,3)" ng-class="{\'active\':stageIds.indexOf(3)>-1}"><i><em class="icon transition-02">&#xe605;</em> </i><span>待交尾款</span></a></div><div class="form-input-wrapper"><a class="checkbox" hm-tap="statusClick($event,6)" ng-class="{\'active\':stageIds.indexOf(6)>-1}"><i><em class="icon transition-02">&#xe605;</em> </i><span>待交车</span></a></div><div class="form-input-wrapper"><a class="checkbox" hm-tap="statusClick($event,9)" ng-class="{\'active\':stageIds.indexOf(9)>-1}"><i><em class="icon transition-02">&#xe605;</em> </i><span>待上牌</span></a></div></div><a class="button pull-right" hm-tap="search()">搜索</a> <a class="button pull-right rest" hm-tap="rest($event)">重置</a></div></div><table class="table table-hover table-bordered backlog-table"><thead><tr><th>姓名</th><th>电话</th><th>商品详情</th><th>订单价格</th><th>当前状态</th><th></th></tr></thead><tbody></tbody></table></div><div class="modal fade custom-modal task-modal" tabindex="-1" role="dialog" aria-hidden="true" style="display: block"><div class="modal-dialog modal-md"><div class="modal-content"><div class="modal-header">{{title}}</div><div class="modal-body"><p class="title">备注:</p><textarea class="default-textarea" ng-model="remark" ng-class="{\'error\':submited&&(remark==undefined||remark==\'\')}" rows="4"></textarea><div class="date-time-picker-wrapper"><p class="invite-time"><span class="tag">邀约时间:</span><i ng-if="isSkip==0">{{dateStr}}</i><i class="time" ng-if="isSkip==0">{{timeStr}}</i></p><div class="date-time-picker"><div class="date-pick-wrapper"><a class="left-arrow arrow icon">&#xe607;</a><div class="date-wapper swiper-container"><div class="swiper-wrapper clearfix" ng-style="wrapperStyle"><a class="date-item swiper-slide" ng-repeat="item in dateObj.date" hm-tap="dayClick(e,item,$index)" repeat-finish="dateFinish()" ng-class="{\'active\':$index==$dateIndex&&isSkip==0}"><span class="week-day">{{item.week}}</span> <span class="day">{{item.day}}</span></a></div></div><a class="right-arrow arrow icon">&#xe600;</a></div><div class="time-wrapper"><a class="time-item transition-02" ng-repeat="time in dateObj.time" hm-tap="timeClick($event,time)" ng-class="{\'active\':timeStr==time&&isSkip==0}">{{time}}</a></div></div><div class="skip clearfix"><a class="checkbox" hm-tap="skip()" ng-class="{\'active\':isSkip==1}"><i><em class="icon transition-02">&#xe605;</em> </i><span>跳过此项</span></a></div><p class="skip-info">选择下一次来店的邀约时间，无需邀约顾问再次电话邀约</p></div></div><div class="modal-footer"><a class="button" hm-tap="affirm()">确定</a> <a class="button" data-dismiss="modal">取消</a></div></div></div></div>');
}]);

angular.module('app.template').run(['$templateCache', function($templateCache) {
  $templateCache.put('client.html',
    '<div class="module-wrapper client"><section class="client-list-wrapper" ng-hide="showDetail||showAddClient"><div class="form-header"><div class="line clearfix"><div class="form-item"><span class="form-tag">用户名:</span><div class="form-input-wrapper"><input class="default-input" type="text" ng-model="searchParams.name"></div></div><div class="form-item"><span class="form-tag">手机号:</span><div class="form-input-wrapper"><input class="default-input" type="number" ng-model="searchParams.mobile"></div></div><div class="form-item"><span class="form-tag">等级:</span><div class="form-input-wrapper"><drop-down class="client-level" render-data="$root.enumData.userLevel" model="searchParams.userLv"></drop-down></div></div><a class="button pull-right" hm-tap="search()">搜索</a> <a class="button pull-right rest" hm-tap="rest($event)">重置</a></div></div><table class="table client-table"><thead><tr><th>姓名</th><th>手机号</th><th>创建时间</th><th>等级</th><th>最近一次备注</th></tr></thead><tbody></tbody></table><button class="cycle-button icon add-btn transition-05" hm-tap="addClient($event)">&#xe606;</button></section><div class="add-client-wrapper" ng-if="showAddClient"><div class="cancel-wrapper"><a class="cancel button" hm-tap="cancel()">返回</a></div><client-update type="0"></client-update></div><section class="detail-tab" ng-show="showDetail"><header><a class="go-back" hm-tap="goBack()">返回</a><div class="tab-wrapper" role="tablist"><a class="tab-item detail-info active" data-target="#detail" role="tab" data-toggle="tab">用户信息</a> <a class="tab-item user-order-list" data-target="#order" role="tab" data-toggle="tab">订单信息</a> <a class="tab-item user-remark" data-target="#remark" role="tab" data-toggle="tab">备注</a></div></header><div class="head clearfix" ng-hide="headHide"><span>ID:<i ng-bind="activeUser.userId"></i></span> <span>姓名:<i ng-bind="activeUser.realname"></i></span> <span>手机号: <i ng-bind="activeUser.mobile"></i></span></div><div class="tab-content"><div role="tabpanel" class="tab-pane active fade in" id="detail"><client-update detail-data="userDetail" detail-model="detailModel" type="1" id="userId" ng-if="showDetail"></client-update></div><div role="tabpanel" class="tab-pane fade" id="order"><table class="table client-detail-table"><thead><tr><th>订单号</th><th>下单时间</th><th>商品</th><th>团购名称</th><th>订单状态</th><th>购买人</th><th>手机号</th></tr></thead><tbody></tbody></table><button class="cycle-button icon add-btn transition-05" hm-tap="addOrder($event)">&#xe606;</button></div><div role="tabpanel" class="tab-pane fade" id="remark"><table class="table remark-table"><thead><tr><th>备注</th><th>等级</th><th>创建人</th><th>创建时间</th></tr></thead><tbody></tbody></table><button class="cycle-button icon add-btn transition-05 add-remark" hm-tap="addRemark($event)">&#xe606;</button></div></div><new-order user-id="userId" class="add-order-modal"></new-order></section></div><div class="modal fade custom-modal remark-modal" tabindex="-1" role="dialog" aria-hidden="true" style="display: block"><div class="modal-dialog modal-md"><div class="modal-content"><div class="modal-header">添加备注</div><div class="modal-body"><form name="remarkForm" novalidate><p class="title">备注:</p><textarea class="default-textarea" ng-model="remark" name="remark" ng-class="{\'error\':remarkForm.$submitted&&remarkForm.remark.$invalid}" required rows="4"></textarea></form></div><div class="modal-footer"><a class="button" hm-tap="affirm()">确定</a> <a class="button" data-dismiss="modal">取消</a></div></div></div></div>');
}]);

angular.module('app.template').run(['$templateCache', function($templateCache) {
  $templateCache.put('order.html',
    '<div class="module-wrapper order"><section ng-show="!showDetail"><div class="form-header"><div class="line clearfix"><div class="form-item"><span class="form-tag">订单号:</span><div class="form-input-wrapper"><input class="default-input" type="number" ng-model="searchParams.orderNo"></div></div><div class="form-item"><span class="form-tag">团购名称:</span><div class="form-input-wrapper"><drop-down class="tuan-name" render-data="allPromotion" display="\'promotionName\'" val="\'promotionId\'" model="searchParams.promotionId"></drop-down></div></div><div class="form-item"><span class="form-tag">购买人:</span><div class="form-input-wrapper"><input class="default-input buy-man" type="text" ng-model="searchParams.buyerName"></div></div><div class="form-item last"><span class="form-tag">购买人手机号:</span><div class="form-input-wrapper"><input class="default-input buy-man-num" type="number" ng-model="searchParams.buyerMobile"></div></div><a class="button pull-right" hm-tap="rest()">重置</a></div><div class="line clearfix"><div class="form-item"><span class="form-tag">订单状态:</span><div class="form-input-wrapper"><drop-down class="order-state" render-data="$root.enumData.orderStatus" model="searchParams.orderStatus"></drop-down></div></div><div class="form-item" range-date-validate><span class="form-tag">下单时间:</span><div class="form-input-wrapper date-picker"><input type="date" class="start-date default-input" ng-model="startTime"> <i class="icon pull-left">&#xe601;</i></div><span class="pull-left bridge">-</span><div class="form-input-wrapper date-picker end"><input type="date" class="end-date default-input" ng-model="endTime"> <i class="icon pull-left">&#xe601;</i></div><span class="error-msg pull-left">请正确选择日期</span></div><a class="button pull-right" hm-tap="search()">搜索</a></div></div><table class="table table-hover table-bordered order-table tap-table"><thead><tr><th>订单号</th><th>下单时间</th><th>商品</th><th>团购名称</th><th>订单状态</th><th>购买人</th><th>手机号</th></tr></thead><tbody></tbody></table><button class="cycle-button icon add-btn transition-05" hm-tap="addOrder($event)">&#xe606;</button></section><!-- <section class="order-info hide">\n' +
    '		<header class="clearfix">\n' +
    '			<a class="button pull-left">返回</a>\n' +
    '			<span class="pull-left">订单详情&nbsp;&nbsp;(编号:171785478852412587)</span>\n' +
    '		</header>\n' +
    '		<div class="info-block">\n' +
    '			<h3>购车人信息:</h3>\n' +
    '			<div class="info-body">\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>某某某</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>某某某</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>某某某</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>15012119780906771X15012119780906771X15012119780906771X15012119780906771X</i>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '		<div class="info-block">\n' +
    '			<h3>订单信息:</h3>\n' +
    '			<div class="info-body" ng-show="orderDetail.type != 1">\n' +
    '				<div>\n' +
    '					<span>活动名称:</span><i></i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>活动条款:</span><i>15012119780906771X15</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>活动金额:</span><i>1501211978</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>优惠审核状态:</span><i>15012119780906771X150121</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>提车地址:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>公司:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>下单时间:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>支付时间:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>结清时间:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>状态:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>商品明细:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>优惠金额:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>数量:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>原价:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>现价:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '			<div class="info-body" ng-show="orderDetail.type != 1">\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>15012119780906771X15012119780906771X15012119780906771X15012119780906771X</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>15012119780906771X15</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>1501211978</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>15012119780906771X150121</i>\n' +
    '				</div>\n' +
    '				<div>\n' +
    '					<span>购买人:</span><i>15012119780906771X1501</i>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '		<div class="info-block pay-info">\n' +
    '			<h3 class="clearfix">\n' +
    '				<span class="channel">支付渠道</span>\n' +
    '				<span class="pay-no">支付号</span>\n' +
    '				<span class="pay-amount">支付金额</span>\n' +
    '				<span class="pay-date">支付时间</span>\n' +
    '			</h3>\n' +
    '			<div class="info-body clearfix">\n' +
    '				<div class="line pull-left">\n' +
    '					<span class="channel">某某某</span>\n' +
    '					<span class="pay-no">15012119780906771X</span>\n' +
    '					<span class="pay-amount">9999999.00</span>\n' +
    '					<span class="pay-date">2017/11/31 12:59:00</span>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '			<div class="info-footer">\n' +
    '				<a class="button">新增支付信息</a>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '	</section> --><order-detail ng-show="showDetail" class="animated fadeIn"></order-detail></div><new-order class="add-order-modal"></new-order><add-pay class="add-pay-modal" order-no="orderId"></add-pay>');
}]);

})