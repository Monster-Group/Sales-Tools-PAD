define(['angular', 'require', 'angular-route', 'appDirectives', 'appServices', 'appFactorys', 'appTemplates', 'appTouch', 'angular-chosen', 'jquery', 'table'],
	function(angular, require) {
		var app = angular.module('webapp', ['ngRoute', 'app.directives', 'app.services', 'app.factorys', 'app.template', 'app.touch','localytics.directives']);
		app.run(function($rootScope,$q, $location, dropdownMenuScrollbar, ArrayhasObj,appApi,enumData) {
			$rootScope.$on('$routeChangeStart', function(evt, next, current) {
				$rootScope.path = $location.$$path;
				console.log($rootScope.path);
			});
			$rootScope.storeList = [];
			if(!localStorage.getItem('loginfo')){
				window.location.href = 'index.html';
			};
			$rootScope.loginfo = JSON.parse(localStorage.getItem('loginfo'));
			console.log($rootScope.loginfo);
			$rootScope.pageSize = 20;
			$rootScope.enumData = enumData;
			appApi.regionList(function(data){
				console.log(data);
				$rootScope.enumData.regionList = data;
			});
			$rootScope.logout = function(){
				appApi.logout(function(data){
					window.location.href = 'index.html';
				});
			};
			if($rootScope.loginfo){
				$rootScope.loginfo.provinceSet.forEach(function(p,pindex){
					p.cityList.forEach(function(c,cindex){
						c.storeList.forEach(function(item,index){
							$rootScope.storeList.push(item)
						})
					});
				});
				$rootScope.storeId = $rootScope.storeList[0].storeId;
				$rootScope.storeName = $rootScope.storeList[0].storeName;
			}
			console.log($rootScope.storeList);
			$rootScope.$on('$routeChangeSuccess', function(evt, next, current) {
				if(current) {
					$rootScope.prevPath = current.originalPath;
					//$window.history.replaceState('',document.title,'#'+current.originalPath);
				} else {
					$rootScope.prevPath = '/order';
					//$window.history.pushState('', '');
				}
			});
			appApi.countMatterSum(function(data){
				$rootScope.countMatterSum = data;
			});
			$rootScope.storeClick = function(e,i){
				if(i==$rootScope.storeId){
					e.stopPropagation();
					e.preventDefault();
					return;
				};
				$rootScope.storeId = i.storeId;
				$rootScope.storeName = i.storeName;
			};
		});
		app.directive('repeatFinish', function($timeout) {
			return {
				link: function(scope, element, attr) {
					if(scope.$last == true) {
						var finish = attr.repeatFinish;
						$timeout(function() {
							scope.$eval(finish)
						}, 0);
					}
				}
			}
		});
		app.directive('ngIfFinish', function($timeout) {
			return {
				link: function(scope, element, attr) {
					$timeout(function() {
						if($(element).is(':last-child')) {
							var finish = attr.ngIfFinish;
							$timeout(function() {
								scope.$eval(finish)
							}, 0);
						}
					}, 0);
				}
			}
		});
		app.filter('trustHtml', function($sce) {
			return function(input) {
				return $sce.trustAsHtml(input);
			};
		});
		app.filter('formatGender', function($rootScope) {
			return function(genderId) {
				var gender;
				switch(+genderId){
					case 0: gender = '保密';break;
					case 1: gender= '女';break;
					case 2: gender = '男';break;
					default: gender = '未知'
				}
				return gender;
			};
		});
		app.filter('formatChannel', function(){
			return function(channelId){
				var channelName;
				switch(+channelId){
					case 1: channelName = '支付宝';break;
					case 2: channelName= '微信';break;
					case 3: channelName = '网银';break;
					case 4: channelName = '线下';break;
					default: channelName = '--'
				}
				return channelName;
			}
		});
		app.config(['$routeProvider', '$controllerProvider','$httpProvider','hammerDefaultOptsProvider',
			function($routeProvider, $controllerProvider,$httpProvider,hammerDefaultOptsProvider) {
				hammerDefaultOptsProvider.set({
	        		recognizers: [[Hammer.Tap, {time: 150}],[Hammer.Swipe,{enable: true,direction: Hammer.DIRECTION_HORIZONTAL}]]});
	        	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
			    $httpProvider.defaults.transformRequest = [function(data) {
			      return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
			    }];
				var routeMap = {
					'/backlog': { //路由
						//模块的代码路径
						path: 'static/js/controller/backlog.js?v=' + stamp,
						controller: 'backlogController'
					},
					'/order': { //路由
						//模块的代码路径
						path: 'static/js/controller/order.js?v=' + stamp,
						controller: 'orderController'
					},
					'/client': { //路由
						//模块的代码路径
						path: 'static/js/controller/client.js?v=' + stamp,
						controller: 'clientController'
					}
				};
				//默认跳转到某个路由
				var defaultRoute = '/order';
				//出现未定义路由跳转
				$routeProvider.otherwise({
					redirectTo: defaultRoute
				});
				for(var key in routeMap) {
					$routeProvider.when(key, {
						template: '',
						controller: routeMap[key].controller,
						resolve: {
							keyName: requireModule(routeMap[key].path, routeMap[key].controller, key)
						}
					});
				}

				function requireModule(path, controller, key) {
					return function($route, $q, $templateCache) {
						var deferred = $q.defer();
						require([path],
							function(ret) {
								$controllerProvider.
								register(controller, ret.controller);
								$route.current.template = ret.tpl;
								deferred.resolve();
							});
						return deferred.promise;
					}
				};
				function getTplName(tpl) {
					var tmp = tpl.split('/');
					var name = '';
					tmp.shift();
					if(tmp.length > 1) {
						name = tmp.join('-')
					} else {
						name = tmp[0];
					}
					return name;
				};
			}
		]);
		return app;
	});