define(['angular','moment','jquery'], function(angular,moment, $) {
	'use strict';
	var appFactorys = angular.module('app.factorys', []);
	appFactorys.factory('destroy',function($rootScope){
		return function(scope){
			$rootScope.$on('$routeChangeSuccess', function(evt, next, current){
				if(scope!=null){
					scope.$destroy();
				}
				scope=null;
			});
		}
	});
	appFactorys.factory('getStatuDisplay',function(){
		return function(s){
			let statu = '';
			switch(s){
				case 1: statu='待交尾款(待邀约)' 
				break;
				case 2: statu='待交尾款(待分配)' 
				break;
				case 3: statu='待交尾款(代执行)' 
				break;
				case 4: statu='待交车(待邀约)' 
				break;
				case 5: statu='待交车(待分配)' 
				break;
				case 6: statu=' 待交车(待执行)' 
				break;
				case 7: statu='待上牌(待邀约)' 
				break;
				case 8: statu='待上牌 (待分配)' 
				break;
				case 9: statu='待上牌(待执行)' 
				break;
				case 10: statu='完成' 
				break;
			};
			return statu;
		}
	});
	appFactorys.factory('getMillisecond',function(){
		return function(d){
			return moment(d).valueOf();
		}
	});
	appFactorys.factory('toThousands',function(){
		return function(num) {
            var numArr = (num || 0).toString().split('.'), result = '';
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
	appFactorys.factory('type',function(){
		return function(value){
			var type={};
			if(angular.isDefined(value)){
				type.isDefined = true;
			};
			if(angular.isString(value)){
				type.isString = true;
			};
			if(angular.isDate(value)){
				type.isDate = true;
			};
			if(angular.isObject(value)){
				type.isObject = true;
			};
			if(angular.isFunction(value)){
				type.isFunction = true;
			};
			if(angular.isElement(value)){
				type.isElement = true;	
			};
			if(angular.isNumber(value)){
				type.isNumber = true;
			};
			if(angular.isArray(value)){
				type.isArray = true;
			};
			if(angular.isUndefined(value)){
				type.isUndefined = true;
			};
			return type;
		}
	});
	appFactorys.factory('isArray',function($rootScope){
		return function(value){
			if (value instanceof Array ||
			    (!(value instanceof Object) &&
			        (Object.prototype.toString.call((value)) == '[object Array]') ||
			        typeof value.length == 'number' &&
			        typeof value.splice != 'undefined' &&
			        typeof value.propertyIsEnumerable != 'undefined' &&			        !value.propertyIsEnumerable('splice'))) {
			    return true;
			}
		}
	});
	appFactorys.factory('dataFormat',function(){
		return function(data){
			if(data==null||data==undefined){
				return '-';
			};
			if(data>1500000000000){
				return moment(data).format('YYYY-MM-DD HH:mm');
			};
			return data;
		}
	});
	appFactorys.factory('enumData',function(){
		return {
			
		}
	});
});