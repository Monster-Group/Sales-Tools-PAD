define(['angular', 'text!tpl/client.html', 'waves', 'nprogress', 'toastr', 'moment', 'loading'], function(angular, tpl, Waves, NProgress, toastr, moment) {
	function controller($scope, $rootScope, appApi, getUserLv,getOrderStatu) {
		Waves.init();
		Waves.attach('.button', ['waves-block', 'waves-light']);
		NProgress.done();
		$scope.$table = $('.client-table');
		$scope.$detailTable = $('.client-detail-table');
		$scope.$remarkTable = $('.remark-table');
		$scope.pageNum = 1;
		$scope.orderpageNum = 1;
		$scope.remarkPageNum = 1;
		$scope.headHide = true;
		$scope.showAddClient = false;
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
					$('.client').find('.load-more').hide();
				}else{
					$('.client').find('.load-more').show();
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
		let loadOrderList = (fn) => {
			$('body').loading();
			appApi.listOrderByAccount($scope.userId, $scope.orderpageNum, (data) => {
				$scope.orderpageNum++;
				$('#order').data('load','no');
				if(data.pageNum <= 1) {
					$scope.ddt.fnClearTable();
				};
				if(data.pageNum == data.pages) {
					$('#order').find('.load-more').hide();
				}else{
					$('#order').find('.load-more').show();
				};
				$('body').find('.inline-loading').remove();
				if(data.list.length == 0) return;
				$scope.ddt.fnAddData(data.list);
				if(!fn) return;
				setTimeout(() => {
					fn();
				}, 0);
			});
		};
		
		let loadRemark = (fn)=>{
			$('body').loading();
			appApi.listRemarkBack($scope.userId,$scope.remarkPageNum,(data)=>{
				console.log(data);
				$scope.remarkPageNum++;
				$('#remark').data('load','no');
				if(data.pageNum <= 1) {
					$scope.remarkDt.fnClearTable();
				};
				if(data.pageNum == data.pages) {
					$('#remark').find('.load-more').hide();
				}else{
					$('#remark').find('.load-more').show();
				};
				$('body').find('.inline-loading').remove();
				if(data.list.length == 0) return;
				$scope.remarkDt.fnAddData(data.list);
				if(!fn) return;
				setTimeout(() => {
					fn();
				}, 0);
			});
		}
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
				scrollY: $scope.detailTableScollHeight,
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
				scrollY: $scope.remarkTableScollHeight,
				columns: [{
						data: 'remarkContent',
						width: '45%'
					},
					{
						data: 'userLv',
						width: '20%'
					},
					{
						data: 'nickname',
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
		loadData();
		$scope.goBack = ()=>{
			$scope.showDetail = false;
		};
		$scope.cancel = ()=>{
			$scope.showAddClient = false;
		};
		$scope.search = () => {
			$scope.pageNum = 1;
			loadData();
		};
		$scope.rest = (e) => {
			$scope.searchParams = {};
			$('.client-level .dropdown-toggle').find('.val').text('请选择');
		};
		$scope.addClient = ()=>{
			$scope.showAddClient = true;
		};
		$('.client-table').on('tap','tbody tr',function(e){
			var data = $scope.dt.api(true).row($(this)).data();
			$('.detail-info').tab('show').addClass('active').siblings('a').removeClass('active');
			$scope.$apply(() => {
				$scope.activeUser = data;
				$scope.userId = data.userId;
				$scope.showDetail = true;
			})
		});
		$('.client-list-wrapper').on('tap', '.load-more', function(e) {
			let top = $('.client-list-wrapper .dataTables_scrollBody').scrollTop();
			loadData(() => {
				$('.client-list-wrapper .dataTables_scrollBody').scrollTop(top);
			});
		});
		$('#order').on('tap', '.load-more', function(e) {
			let top = $('#order .dataTables_scrollBody').scrollTop();
			loadOrderList(() => {
				$('#order .dataTables_scrollBody').scrollTop(top);
			});
		});
		$('#remark').on('tap', '.load-more', function(e) {
			let top = $('#remark .dataTables_scrollBody').scrollTop();
			loadRemark(() => {
				$('#remark .dataTables_scrollBody').scrollTop(top);
			});
		});
		$('.user-order-list').on('shown.bs.tab', function() {
			if(!$scope.ddt) {
				$scope.detailTableScollHeight = $(window).height() - $scope.$detailTable.offset().top - $scope.$table.find('thead').outerHeight() - 160;
				console.log($scope.detailTableScollHeight);
				ddt();
			};
			$scope.orderpageNum = 1;
			loadOrderList();
		});
		$('.user-remark').on('shown.bs.tab', function() {
			if(!$scope.remarkDt) {
				$scope.remarkTableScollHeight = $(window).height() - $scope.$remarkTable.offset().top - $scope.$table.find('thead').outerHeight() - 160;
				remarkDt();
			};
			$scope.remarkPageNum = 1;
			loadRemark();
		});
		$('.tab-wrapper').on('tap', '.tab-item', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if($(this).hasClass('active')) return;
			$(this).tab('show');
			$(this).addClass('active').siblings('a').removeClass('active');
			if($(this).data('target')=='#detail'){
				$scope.$apply(() => {
					$scope.headHide = true;
				});
			}else{
				$scope.$apply(() => {
					$scope.headHide = false;
				});
			}
		});
		let hideDetail  = $scope.$on('hideDetail', (e)=> {
			$scope.showDetail = false;
		});
		let hideAddClient  = $scope.$on('hideAddClient', (e)=> {
			$scope.showAddClient = false;
		});
		let loadClientList  = $rootScope.$on('loadClientList',(e)=> {
			$scope.pageNum = 1;
			loadData();
		});
		$scope.$on('$destory', function() {
	        hideDetail(); // 退订事件
	        hideAddClient();
	        loadClientList();
	    });
	};
	return {controller: controller, tpl: tpl};
});