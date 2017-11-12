define(['angular', 'text!tpl/client.html', 'waves', 'nprogress', 'toastr', 'moment', 'loading'], function(angular, tpl, Waves, NProgress, toastr, moment) {
	function controller($scope, $rootScope, appApi, getUserLv, watch,getOrderStatu) {
		Waves.init();
		Waves.attach('.button', ['waves-block', 'waves-light']);
		NProgress.done();
		$scope.$table = $('.client-table');
		$scope.$detailTable = $('.client-detail-table');
		$scope.$remarkTable = $('.remark-table');
		console.log($scope.$detailTable.outerWidth());
		$scope.pageNum = 1;
		$scope.searchParams = {};
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		$scope.userId = '';
		let loadData = (fn) => {
			$scope.searchParams.accountId = $rootScope.loginfo.account.accountId;
			$scope.searchParams.storeId = $rootScope.loginfo.account.storeId;
			$('body').loading();
			appApi.listUserBackSales($scope.searchParams, $scope.pageNum, (data) => {
				if(data.userList.pageNum <= 1) {
					$scope.dt.fnClearTable();
				};
				$scope.pageNum++;
				if(data.userList.pageNum == data.userList.pages) {
					$('.client').find('.load-more').remove();
				};
				setTimeout(() => {
					$('body').find('.inline-loading').remove();
				}, 0);
				if(data.userList.list.length == 0) return;
				$scope.dt.fnAddData(data.userList.list);
				if(!fn) return;
				setTimeout(() => {
					fn();
				}, 0);
			});
		};
		let getDetail = (id) => {
			$('body').loading();
			appApi.getUserBack(id, (data) => {
				$('body').find('.inline-loading').remove();
				$scope.userDetail = data.user;
				$scope.detailModel = $.extend(true,{},data.user);
				console.log($scope.detailModel);
				if(data.user.province){
					getCityList(data.user.province);
				}
			});
		};
		let loadOrderList = (fn) => {
			$('body').loading();
			appApi.searchOrderList({}, $scope.pageNum, (data) => {
				console.log(data);
				$scope.tableData = data;
				$scope.pageNum++;
				if(data.pageNum == 1) {
					$scope.ddt.fnClearTable();
				};
				if(data.pageNum == data.pages) {
					$('#order').find('.load-more').remove();
				};
				if(data.list.length == 0) return;
				$scope.ddt.fnAddData(data.list);
				setTimeout(() => {
					$('body').find('.inline-loading').remove();
				}, 0);
				if(!fn) return;
				setTimeout(() => {
					fn();
				}, 0);
			});
		};
//		getDetail();
		$scope.dt = $scope.$table.dataTable({
			order: [],
			bFilter: false, //Disable search function
			bPaginate: false, //hide pagination,
			buttons: {},
			scrollY: $scope.tableScollHeight,
			columns: [{
					data: 'realname',
					width: '10%'
				},
				{
					data: 'mobile',
					width: '20%'
				},
				{
					data: 'createdTime',
					width: '20%'
				},
				{
					data: 'userLv',
					width: '20%'
				},
				{
					data: 'remarkContent',
					width: '30%',
					orderable: false
				}
			],
			columnDefs: [{
					targets: 2,
					visible: true,
					render: function(data, type, row, meta) {
						return moment(data).format('YYYY-MM-DD HH:mm:ss');
					}
				},
				{
					targets: 3,
					visible: true,
					render: function(data, type, row, meta) {
						return getUserLv(parseInt(data));
					}
				},
				{
					targets: 4,
					visible: true,
					render: function(data, type, row, meta) {
						return data ? data : '';
					}
				}
			],
			fnInitComplete: (s) => {
				if(s.oScroll.sY) {
					$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
				};
				Waves.attach('.load-more', ['waves-block', 'waves-green']);
			}
		});
		let ddt = () => {
			$scope.ddt = $scope.$detailTable.dataTable({
				order: [],
				bFilter: false, //Disable search function
				bPaginate: false, //hide pagination,
				buttons: {},
				scrollY: $scope.tableScollHeight,
				columns: [{
						data: 'orderNo',
						width: '15%'
					},
					{
						data: 'createdTime',
						width: '16%'
					},
					{
						data: 'productDetail',
						width: '20%'
					},
					{
						data: 'promotionName',
						width: '17%'
					},
					{
						data: 'status',
						width: '10%'
					},
					{
						data: 'buyerName',
						width: '10%'
					},
					{
						data: 'buyerMobile',
						width: '12%'
					}
				],
				columnDefs: [{
					targets: 1,
					visible: true,
					render: function(data, type, row, meta) {
						return moment(data).format("YYYY-MM-DD HH:mm:ss");
					}
				}, {
					targets: 4,
					visible: true,
					render: function(data, type, row, meta) {
						return getOrderStatu(data);
					}
				}],
				fnInitComplete: (s) => {
					if(s.oScroll.sY) {
						$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
					};
					Waves.attach('.load-more', ['waves-block', 'waves-green']);
				}
			});
		};
		let remarkDt = () => {
			$scope.remarkDt = $scope.$remarkTable.dataTable({
				order: [],
				bFilter: false, //Disable search function
				bPaginate: false, //hide pagination,
				buttons: {},
//				scrollY: $scope.tableScollHeight,
				columns: [{
						data: 'remark',
						width: '45%'
					},
					{
						data: 'userLv',
						width: '20%'
					},
					{
						data: 'buyName',
						width: '15%'
					},
					{
						data: 'createTime',
						width: '20%'
					}
				],
				columnDefs: [{
					targets: 1,
					visible: true,
					render: function(data, type, row, meta) {
						return getUserLv(parseInt(data));
					}
				}, {
					targets: 3,
					visible: true,
					render: function(data, type, row, meta) {
						return moment(data).format("YYYY-MM-DD HH:mm:ss");
					}
				}],
				fnInitComplete: (s) => {
					if(s.oScroll.sY) {
						$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
					};
					Waves.attach('.load-more', ['waves-block', 'waves-green']);
				}
			});
		}
		let getCityList = (id)=>{
			$scope.cityList = [];
			for(let item of $rootScope.enumData.regionList){
				if(item.provinceId==id){
					$scope.cityList = item.cityList;
				}
			};
		};
		loadData();
		$scope.provinceClick = (e,i)=>{
			getCityList(i.provinceId);
		};
		$scope.search = () => {
			$scope.pageNum = 1;
			loadData();
		};
		$scope.rest = (e) => {
			console.log(e);
			e.stopPropagation();
			e.preventDefault();
		};
		$('.client-table').on('tap','tbody tr',function(e){
			var data = $scope.dt.api(true).row($(this)).data();
			if(data.userId==$scope.userId){
				
			}else{
				getDetail(data.userId);
			}
		});
		$('.client').on('tap', '.load-more', function(e) {
			let top = $('.dataTables_scrollBody').scrollTop();
			loadData(() => {
				$('.dataTables_scrollBody').scrollTop(top);
			});
		});
		watch((n, o) => {
			$scope.searchParams = {};
			$scope.pageNum = 1;
			$('.client-level').find('.val').text('请选择');
			loadData();
		});
		$('.user-order-list').on('shown.bs.tab', function() {
			if(!$scope.ddt) {
				ddt();
				loadOrderList();
			}
		});
		$('.user-remark').on('shown.bs.tab', function() {
			if(!$scope.remarkDt) {
				remarkDt();
//				loadOrderList();
			}
		});
		$('.tab-wrapper').on('tap', '.tab-item', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if($(this).hasClass('active')) return;
			$(this).tab('show');
			$(this).addClass('active').siblings('a').removeClass('active');
		});
	};
	return {
		controller: controller,
		tpl: tpl
	};
});