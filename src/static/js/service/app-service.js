define(['angular','baseSet', 'jquery', 'sweetalert','Ps'], function(angular,baseSet,$,swal) {
	'use strict';
	var appServices = angular.module('app.services', []);
	appServices.service('appHttp', function($http){
		this.appPost = function(obj) {
			var suc = obj.success ? obj.success : function(e) {
				console.log(e);
			};
			var com = obj.complete ? obj.complete : function(e) {
//				console.log(e);
			};
			var err = obj.error ? obj.error : function(e) {
				console.log(e);
			};
			delete obj.success;
			delete obj.complete;
			delete obj.error;
			var getModel = {
				url: '',
				method: 'POST',
				data: '',
				headers: {
				}
			};
			getModel = angular.merge({},getModel, obj);
			$http(getModel).then(function(response) {
				if(response.data.code == 200) {
					suc(response.data.data);
				} else {
					if(response.data.code == 422) {
						$('.inline-loading').remove();
						swal({
							title: '登录信息异常,请重新登录',
							confirmButtonText: '确定',
							onClose: function() {
								window.location.href = 'login.html';
							}
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
			}, function(response){
				console.log(response);
				swal({
					title: '错误信息',
					text: '服务器/网络错误，请稍后再试。',
					type: 'error',
					confirmButtonText: '确定',
					debug:true,
					errorInfo:JSON.stringify(response)
				}).then(function (){
					$('.inline-loading').remove();
				});
				err(response);
			});
		}
	});
	appServices.service('appApi', ['$q','appHttp','$rootScope', function($q,appHttp,$rootScope) {
		this.regionList = (suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/city/listBySelect',
				success: suc
			});
		};
		this.countMatterSum = (suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/countMatterSum',
				success: suc
			});
		};
		this.searchMatter = (ids,num,suc,com,err) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/searchMatter',
				data:{
					storeId:$rootScope.storeId,
					deliveryStageIds:ids.join(),
					pageSize:$rootScope.pageSize,
					page:num
				},
				success: suc
			});
		};
		this.updateAppoint = (data,u,suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/'+u,
				data:data,
				success: suc
			});
		};
		this.searchOrderList = (data,page,suc) => {
			var obj = Object.assign({}, data);
			obj.page = page;
			obj.pageSize = $rootScope.pageSize;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/searchOrderList',
				data:obj,
				success: suc
			});
		};
		this.detailOrder = (id,suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/detailOrder',
				data:{
					orderId:id
				},
				success: suc
			});
		};
		this.cretaeProductOrderBack = (data,suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/cretaeProductOrderBack',
				data:data,
				success: suc
			});
		};
		this.getPayment = (no,suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/cretaeProductOrderBack',
				data:{
					orderNo:no
				},
				success: suc
			});
		};
		this.listAllPromotion = (suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/promotion/listAllPromotion',
				data:{
					pageSize:100
				},
				success: suc
			});
		};
		this.listStoreBack = (suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/store/listStoreBack',
				success: suc
			});
		};
		this.getOrderDetail = (data, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/detailOrder',
				data: data,
				success: suc
			});
		}
		this.getCarInfo = (data, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/showCarInfo',
				data: data,
				success: suc
			});
		}
		this.getAppointById = (data, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/matter/showAppointById',
				data: data,
				success: suc
			})
		}
		this.getPayment = (data, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/getPayment',
				data: data,
				success: suc
			})
		}
		this.savePaymentOrder = (data, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/order/savePaymentOrder',
				data: data,
				success: suc
			})
		}
		this.listUserBackSales = (data,page, suc) => {
			var obj = Object.assign({}, data);
			obj.page = page;
			obj.pageSize = $rootScope.pageSize;
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/listUserBackSales',
				data: obj,
				success: suc
			})
		}
		this.getUserBack = (id, suc) => {
			appHttp.appPost({
				url: baseSet.postServer + 'api/v2/user/getUserBack',
				data:{
					userId:id
				},
				success: suc
			})
		}
	}]);
	appServices.service('ArrayhasObj',function() {
		Array.prototype.hasObj = function(obj){
			var result = -1;
			this.forEach((item,index)=>{
				if(JSON.stringify(item)==JSON.stringify(obj)){
					result = index;
				}
			});
			return result;
		};
	});
	appServices.service('dropdownMenuScrollbar',function($rootScope){
		$(document).on('shown.bs.dropdown','.dropdown',function(){
			var $list = $(this).find('ul').parent('div');
			var $bar = $list.find('.ps-scrollbar-y');
			var listHiehgt = $list.find('ul').height();
			var $input = $(this).find('input');
			console.log($list.outerHeight());
			if($list.find('li').length==0||$list.outerHeight()<205) return;
			if($input.length>0){
				$input.on('input',function(){
					$list.perfectScrollbar('update');
				});
			};
			if($list.find('.ps-scrollbar-y-rail').length>0){
				console.log(666)
				$list.perfectScrollbar('update');
			}else{
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