'use strict';

define(['angular', 'moment', 'jquery'], function (angular, moment, $) {
	'use strict';

	var appFactorys = angular.module('app.factorys', []);
	appFactorys.factory('destroy', function ($rootScope) {
		return function (scope) {
			$rootScope.$on('$routeChangeSuccess', function (evt, next, current) {
				if (scope != null) {
					scope.$destroy();
				}
				scope = null;
			});
		};
	});
	appFactorys.factory('watch', function ($rootScope) {
		return function (fn) {
			var watch = $rootScope.$watch('storeId', function (newVal, oldVal) {
				if (newVal != oldVal) {
					fn(newVal, oldVal);
				}
			});
			$rootScope.$on('$routeChangeStart', function (evt, next, current) {
				if (current) {
					watch();
				}
			});
		};
	});
	appFactorys.factory('getStatuDisplay', function () {
		return function (s) {
			var statu = '';
			switch (s) {
				case 1:
					statu = '待交尾款';
					break;
				case 2:
					statu = '待交尾款';
					break;
				case 3:
					statu = '待交尾款';
					break;
				case 4:
					statu = '待交车';
					break;
				case 5:
					statu = '待交车';
					break;
				case 6:
					statu = '待交车';
					break;
				case 7:
					statu = '待上牌';
					break;
				case 8:
					statu = '待上牌';
					break;
				case 9:
					statu = '待上牌';
					break;
				case 10:
					statu = '完成';
					break;
			};
			return statu;
		};
	});
	appFactorys.factory('getOrderStatu', function () {
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
	appFactorys.factory('getUserLv', function () {
		return function (s) {
			var level = '';
			switch (s) {
				case 0:
					level = 'O-订单';
					break;
				case 1:
					level = 'H-7天内可交付';
					break;
				case 2:
					level = 'A-半个月内可交付';
					break;
				case 3:
					level = 'B-一个月内可成交';
					break;
				case 4:
					level = 'C-2个月内能成交';
					break;
				case 5:
					level = 'F-战败';
					break;
					defaults: level = '--';
			};
			return level;
		};
	});
	appFactorys.factory('getMillisecond', function () {
		return function (d) {
			return moment(d).valueOf();
		};
	});
	appFactorys.factory('toThousands', function () {
		return function (num) {
			var numArr = (num || 0).toString().split('.'),
			    result = '';
			var numStr = numArr[0];
			while (numStr.length > 3) {
				result = ',' + numStr.slice(-3) + result;
				numStr = numStr.slice(0, numStr.length - 3);
			}
			if (numStr) {
				result = numStr + result;
			}
			;
			if (numArr[1] != undefined) {
				result = result + '.' + numArr[1];
			}
			;
			return result;
		};
	});
	appFactorys.factory('type', function () {
		return function (value) {
			var type = {};
			if (angular.isDefined(value)) {
				type.isDefined = true;
			};
			if (angular.isString(value)) {
				type.isString = true;
			};
			if (angular.isDate(value)) {
				type.isDate = true;
			};
			if (angular.isObject(value)) {
				type.isObject = true;
			};
			if (angular.isFunction(value)) {
				type.isFunction = true;
			};
			if (angular.isElement(value)) {
				type.isElement = true;
			};
			if (angular.isNumber(value)) {
				type.isNumber = true;
			};
			if (angular.isArray(value)) {
				type.isArray = true;
			};
			if (angular.isUndefined(value)) {
				type.isUndefined = true;
			};
			return type;
		};
	});
	appFactorys.factory('isArray', function ($rootScope) {
		return function (value) {
			if (value instanceof Array || !(value instanceof Object) && Object.prototype.toString.call(value) == '[object Array]' || typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice')) {
				return true;
			}
		};
	});
	appFactorys.factory('dataFormat', function () {
		return function (data) {
			if (data == null || data == undefined) {
				return '-';
			};
			if (data > 1500000000000) {
				return moment(data).format('YYYY-MM-DD HH:mm');
			};
			return data;
		};
	});
	appFactorys.factory('dateArray', function () {
		return function () {
			var obj = {
				date: [],
				time: ['09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30']
			};
			for (var i = 0; i < 365; i++) {
				obj.date.push({
					week: moment().add(i, 'days').format('ddd'),
					year: moment().add(i, 'days').format('YYYY'),
					month: moment().add(i, 'days').format('MM'),
					day: moment().add(i, 'days').format('DD'),
					date: moment().add(i, 'days').format('YYYY-MM-DD')
				});
			};
			return obj;
		};
	});
	appFactorys.factory('enumData', function () {
		return {
			yesOrNo: [{
				name: '是',
				value: 1
			}, {
				name: '否',
				value: 0
			}],
			payChannel: [{
				name: 'POS机',
				value: 4
			}],
			orderStatus: [//订单状态
			{
				name: '待付款',
				value: 1
			}, {
				name: '已关闭',
				value: 2
			}, {
				name: '已付款,待排产',
				value: 3
			}, {
				name: '已排产',
				value: 4
			}, {
				name: '已结清',
				value: 5
			}, {
				name: '申请退款',
				value: 6
			}, {
				name: '已退款',
				value: 7
			}],
			orderType: [//订单类型
			{
				name: '车辆',
				value: 0
			}, {
				name: '周边商品',
				value: 1
			}],
			gender: [//性别
			{ value: 0, name: '保密' }, { value: 1, name: '女' }, { value: 2, name: '男' }],
			userLevel: [//用户等级
			{ value: 0, name: 'O-订单' }, { value: 1, name: 'H-7天内可交付' }, { value: 2, name: 'A-半个月内可交付' }, { value: 3, name: 'B-一个月内可成交' }, { value: 4, name: 'C-2个月内能成交' }, { value: 5, name: 'F-战败' }],
			education: [//学历
			{ value: 0, name: '中专' }, { value: 1, name: '大专' }, { value: 2, name: '本科' }, { value: 3, name: '研究生' }, { value: 4, name: '博士' }],
			userStatus: [//用户状态
			{ value: 0, name: '邀约试驾' }, { value: 1, name: '已试驾' }, { value: 2, name: '已下单' }, { value: 3, name: '已付定金' }, { value: 4, name: '订单库存匹配' }, { value: 5, name: '已付尾款' }, { value: 6, name: '外地客户' }, { value: 7, name: '已外检' }, { value: 8, name: '已提车' }, { value: 9, name: '已拿领牌' }, { value: 10, name: '已拿正式牌' }, { value: 11, name: '邀约上牌' }],
			carUse: [//购车用途
			{ value: 0, name: '上下班/代步' }, { value: 1, name: '炫酷,玩' }, { value: 2, name: '接送小孩' }, { value: 3, name: '买菜专用' }, { value: 4, name: '其他' }],
			carUser: [//购车使用人
			{ value: 0, name: '自己用' }, { value: 1, name: '老婆,女友' }, { value: 2, name: '老公,男友' }, { value: 3, name: '父母' }, { value: 4, name: '其他' }],
			infoSource: [//信息来源
			{ value: 0, name: '商场逛街' }, { value: 1, name: '电梯广告' }, { value: 2, name: '户外广告' }, { value: 3, name: '朋友介绍' }, { value: 4, name: '报纸,电视' }, { value: 5, name: '活动得知' }, { value: 6, name: '网络' }, { value: 7, name: '其他' }],
			buyFocus: [//购买关注点
			{ value: 0, name: '时尚外观' }, { value: 1, name: '经济环保' }, { value: 2, name: '灵活方便' }, { value: 3, name: '炫酷造型' }, { value: 4, name: '百搭颜色' }, { value: 5, name: '独特车贴' }, { value: 6, name: '简约内饰' }, { value: 7, name: '专属两座' }, { value: 8, name: '大屏PAD' }, { value: 9, name: '其他' }],
			age: [//年龄
			{ value: 0, name: '20岁以下' }, { value: 1, name: '21-25岁' }, { value: 2, name: '26-30岁' }, { value: 3, name: '31-35岁' }, { value: 4, name: '36-40岁' }, { value: 5, name: '41-45岁' }]
		};
	});
});