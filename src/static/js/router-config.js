define(['angular', 'require', 'enumData', 'angular-route', 'appDirectives', 'appServices', 'appFactorys', 'appTemplates', 'appController','appTouch', 'angular-chosen', 'jquery', 'table'],
	function(angular, require, enumData) {
		var app = angular.module('webapp', ['ngRoute', 'app.directives', 'app.services', 'app.factorys', 'app.template', 'app.controller','app.touch','localytics.directives']);
		app.run(function($rootScope, $location, dropdownMenuScrollbar, ArrayhasObj) {
			$rootScope.$on('$routeChangeStart', function(evt, next, current) {
				$('.daterangepicker').remove();
				$rootScope.path = $location.$$path;
				console.log($rootScope.path);
			});
			$rootScope.pageSize = 20;
			$rootScope.enumData = enumData;

			$rootScope.$on('$routeChangeSuccess', function(evt, next, current) {
				if(current) {
					$rootScope.prevPath = current.originalPath;
					//$window.history.replaceState('',document.title,'#'+current.originalPath);
				} else {
					$rootScope.prevPath = '/event';
					//$window.history.pushState('', '');
				}
			});
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
			return function(sexId) {
				var len = $rootScope.enumData.gender.length;
				for(var i =0; i < len; i++) {
					if($rootScope.enumData.gender[i].value == genderId){
						return $rootScope.enumData.gender[i].name;
					}
				}
			};
		});
		app.config(['$routeProvider', '$controllerProvider','hammerDefaultOptsProvider',
			function($routeProvider, $controllerProvider,hammerDefaultOptsProvider) {
				hammerDefaultOptsProvider.set({
	        		recognizers: [[Hammer.Tap, {time: 150}],[Hammer.Swipe,{enable: true,direction: Hammer.DIRECTION_HORIZONTAL}]]});
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