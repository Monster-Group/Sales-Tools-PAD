'use strict';

define(['angular', 'baseSet', 'jquery', 'sweetalert'], function (angular, baseSet, $, swal) {
	'use strict';

	var appServices = angular.module('app.services', []);
	appServices.service('appHttp', function ($http) {
		this.appPost = function (obj) {
			var suc = obj.success ? obj.success : function (e) {
				console.log(e);
			};
			var com = obj.complete ? obj.complete : function (e) {
				//				console.log(e);
			};
			var err = obj.error ? obj.error : function (e) {
				console.log(e);
			};
			delete obj.success;
			delete obj.complete;
			delete obj.error;
			var getModel = {
				url: '',
				method: 'POST',
				data: '',
				headers: {}
			};
			getModel = angular.merge({}, getModel, obj);
			$http(getModel).then(function (response) {
				if (response.data.code == 200) {
					suc(response.data.data);
				} else {
					if (response.data.code == 422) {
						$('.inline-loading').remove();
						swal({
							title: '登录信息异常,请重新登录',
							confirmButtonText: '确定',
							onClose: function onClose() {
								window.location.href = 'index.html';
							}
						});
					} else if (response.data.code == 407) {
						swal({
							title: '警告信息',
							text: '手机号已存在，请更换手机号',
							type: 'warning',
							confirmButtonText: '确定'
						}).then(function () {
							$('.inline-loading').remove();
						});
					} else {
						swal({
							title: '错误信息',
							text: response.data.msg,
							type: 'error',
							confirmButtonText: '确定'
						}).then(function () {
							$('.inline-loading').remove();
						});
					}
				}
				com(response);
			}, function (response) {
				console.log(response);
				swal({
					title: '错误信息',
					text: '服务器/网络错误，请稍后再试。',
					type: 'error',
					confirmButtonText: '确定',
					debug: true,
					errorInfo: JSON.stringify(response)
				}).then(function () {
					$('.inline-loading').remove();
				});
				err(response);
			});
		};
	});
	appServices.service('appApi', ['$q', 'appHttp', '$rootScope', function ($q, appHttp, $rootScope) {
		this.regionList = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/city/listBySelect',
				success: suc
			});
		};
		this.logout = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/account/loginOut',
				success: suc
			});
		};
		this.countMatterSum = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/countMatterSum',
				success: suc
			});
		};
		this.searchMatter = function (ids, num, suc, com, err) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/searchMatter',
				data: {
					storeId: $rootScope.storeId,
					deliveryStageIds: ids.join(),
					pageSize: $rootScope.pageSize,
					page: num
				},
				success: suc
			});
		};
		this.updateAppoint = function (data, u, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/' + u,
				data: data,
				success: suc
			});
		};
		this.searchOrderList = function (data, page, suc) {
			var obj = Object.assign({}, data);
			obj.page = page;
			obj.pageSize = $rootScope.pageSize;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/searchOrderList',
				data: obj,
				success: suc
			});
		};
		this.listOrderByAccount = function (id, page, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/listOrderByAccount',
				data: {
					userId: id,
					page: page,
					pageSize: $rootScope.pageSize
				},
				success: suc
			});
		};
		this.createOrder = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/createCarOrderBackTwo',
				data: data,
				success: suc
			});
		};
		this.createOrderWithUserId = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/createCarOrderBack',
				data: data,
				success: suc
			});
		};
		this.createProduct = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/cretaeProductOrderBackTwo',
				data: data,
				success: suc
			});
		};
		this.createProductWithUserId = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/cretaeProductOrderBack',
				data: data,
				success: suc
			});
		};
		this.detailOrder = function (id, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/detailOrder',
				data: {
					orderId: id
				},
				success: suc
			});
		};
		this.cretaeProductOrderBack = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/cretaeProductOrderBack',
				data: data,
				success: suc
			});
		};
		this.getPayment = function (no, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/cretaeProductOrderBack',
				data: {
					orderNo: no
				},
				success: suc
			});
		};
		this.listAllPromotion = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/promotion/listAllPromotion',
				data: {
					pageSize: 100
				},
				success: suc
			});
		};
		this.listStoreBack = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/store/listStoreBack',
				success: suc
			});
		};
		this.getOrderDetail = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/detailOrder',
				data: data,
				success: suc
			});
		};
		this.getCarInfo = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/showCarInfo',
				data: data,
				success: suc
			});
		};
		this.listStoreMall = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/store/listStoreMall',
				success: suc
			});
		};
		this.getAppointById = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/showAppointById',
				data: data,
				success: suc
			});
		};
		this.getPayment = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/getPayment',
				data: data,
				success: suc
			});
		};
		this.savePaymentOrder = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/savePaymentOrder',
				data: data,
				success: suc
			});
		};
		this.listUserBackSales = function (data, page, suc) {
			var obj = Object.assign({}, data);
			obj.page = page;
			obj.pageSize = $rootScope.pageSize;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/listUserBackSales',
				data: obj,
				success: suc
			});
		};
		this.getUserBack = function (id, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/getUserBack',
				data: {
					userId: id
				},
				success: suc
			});
		};

		this.getPromotion = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/promotion/listProotionOrder',
				success: suc
			});
		};

		this.listCar = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listCar',
				success: suc
			});
		};

		this.getCarColor = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listCarColor',
				data: data,
				success: suc
			});
		};
		this.listClassifyLv1 = function (suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listClassifyLV1Back',
				success: suc
			});
		};
		this.listClassify = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listClassifyBack',
				data: data,
				success: suc
			});
		};
		this.listProduct = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listProductByClassify',
				data: data,
				success: suc
			});
		};
		this.listRemarkBack = function (id, page, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/account/listRemarkBack',
				data: {
					userId: id,
					page: page,
					pageSize: $rootScope.pageSize
				},
				success: suc
			});
		};
		this.saveUserBack = function (data, suc) {
			var obj = Object.assign({}, data);
			obj.isSales = 1;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/saveUserBack',
				data: obj,
				success: suc
			});
		};
		this.updateUserBack = function (data, suc) {
			var obj = Object.assign({}, data);
			obj.isSales = 1;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/updateUserBack',
				data: obj,
				success: suc
			});
		};
		this.saveRemark = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/account/saveRemark',
				data: data,
				success: suc
			});
		};
		this.checkMobile = function (data, com) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/checkMobile',
				data: {
					mobile: data
				},
				complete: com
			});
		};
		this.listCarDisc = function (data, suc) {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/product/listCarDisc',
				data: data,
				success: suc
			});
		};
	}]);
	appServices.service('ArrayhasObj', function () {
		Array.prototype.hasObj = function (obj) {
			var result = -1;
			this.forEach(function (item, index) {
				if (JSON.stringify(item) == JSON.stringify(obj)) {
					result = index;
				}
			});
			return result;
		};
	});
	appServices.service('dropdownMenuScrollbar', function ($rootScope) {
		$(document).on('shown.bs.dropdown', '.dropdown', function () {
			var $list = $(this).find('ul').parent('div');
			var $bar = $list.find('.ps-scrollbar-y');
			var listHiehgt = $list.find('ul').height();
			var $input = $(this).find('input');
			console.log($list.outerHeight());
			if ($list.find('li').length == 0 || $list.outerHeight() < 205) return;
			if ($input.length > 0) {
				$input.on('input', function () {
					$list.perfectScrollbar('update');
				});
			};
			if ($list.find('.ps-scrollbar-y-rail').length > 0) {
				console.log(666);
				$list.perfectScrollbar('update');
			} else {
				$list.perfectScrollbar({
					suppressScrollX: true
				});
				//	        	if($bar.height()==0&&listHiehgt>205){
				//	        		console.log($list.find('ul').height());
				//					$bar.height((205/listHiehgt)*205);
				//					$list.addClass('ps-active-y');
				//				}
			};
		});
	});
});