'use strict';

define(['angular', 'moment'], function (angular, moment) {
	'use strict';

	var appFilters = angular.module('app.filters', []);
	appFilters.filter('trustHtml', function ($sce) {
		return function (input) {
			return $sce.trustAsHtml(input);
		};
	});
	appFilters.filter('formatGender', function ($rootScope) {
		return function (genderId) {
			var gender;
			switch (+genderId) {
				case 0:
					gender = '保密';
					break;
				case 1:
					gender = '女';
					break;
				case 2:
					gender = '男';
					break;
				default:
					gender = '未知';
			}
			return gender;
		};
	});
	appFilters.filter('formatChannel', function () {
		return function (channelId) {
			var channelName;
			switch (+channelId) {
				case 1:
					channelName = '支付宝';
					break;
				case 2:
					channelName = '微信';
					break;
				case 3:
					channelName = '网银';
					break;
				case 4:
					channelName = '线下';
					break;
				default:
					channelName = '--';
			}
			return channelName;
		};
	});
	appFilters.filter('payStatuDisplay', function () {
		return function (s) {
			var display = '';
			switch (s) {
				case 0:
					display = '未支付';
					break;
				case 1:
					display = '已支付';
					break;
				case 2:
					display = '已取消';
					break;
			};
			return display;
		};
	});
	appFilters.filter('dateFormat', function () {
		return function (d) {
			return moment(d).format('YYYY-MM-DD HH:mm:ss');
		};
	});
	appFilters.filter('orderStatu', function () {
		return function (s) {
			var statu = '';
			switch (s) {
				case 1:
					statu = '待付款';
					break;
				case 2:
					statu = '已关闭';
					break;
				case 3:
					statu = '已付款,待排产';
					break;
				case 4:
					statu = '已排产';
					break;
				case 5:
					statu = '已结清';
					break;
				case 6:
					statu = '申请退款';
					break;
				case 7:
					statu = '已退款';
					break;
			};
			return statu;
		};
	});
});