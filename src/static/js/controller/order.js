define(['angular', 'text!tpl/order.html', 'waves', 'nprogress','toastr','moment','loading'], function(angular, tpl, Waves, NProgress, toastr,moment) {
	function controller($scope,$rootScope, appApi,getOrderStatu,getMillisecond,$timeout) {
		Waves.init();
		Waves.attach('.button', ['waves-light']);
		Waves.attach('.load-more', ['waves-green']);
		NProgress.done();
		$scope.$table = $('.order-table');
		$scope.showAddPay = false;
		$timeout(()=>{
			$scope.$addModal = $('.add-order-modal');
			$scope.$payModal = $('.add-pay-modal');
//			$scope.$addModal.find('.modal-dialog').css('margin-top','-'+$scope.$addModal.find('.modal-dialog').outerHeight()/2+'px');
			$scope.$payModal.find('.modal-dialog').css('margin-top','-'+$scope.$payModal.find('.modal-dialog').outerHeight()/2+'px');
			$scope.$addModal.hide();
			$scope.$payModal.hide();
			$scope.$addModal.on('hidden.bs.modal',()=>{
				$('.add-btn').removeClass('active');
			});
		},0);
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		$scope.searchParams = {};
		$scope.pageNum = 1;
		$scope.orderStatus = '';
		appApi.countMatterSum(function(data){
			$rootScope.countMatterSum = data;
		});
		$scope.dt = $scope.$table.dataTable({
			order:[],
			bFilter: false, //Disable search function
		    bPaginate: false, //hide pagination,
		    scrollY: $scope.tableScollHeight,
			buttons: {},
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
			},{
				targets: 4,
				visible: true,
				render: function(data, type, row, meta) {
					return getOrderStatu(data);
				}
			}],
			fnInitComplete:(s)=>{
				if(s.oScroll.sY){
					$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
				};
				Waves.attach('.load-more', ['waves-green']);
			}
		});
		let loadData = (fn) =>{
			if($('body').find('.inline-loading').length==0){
				$('body').loading();
			}
			appApi.searchOrderList($scope.searchParams,$scope.pageNum, (data)=>{
				console.log(data);
				$scope.tableData = data;
				$scope.pageNum++;
				if(data.pageNum==1){
					$scope.dt.fnClearTable();
				};
				if(data.pageNum==data.pages){
					$('.order').find('.load-more').hide();
				}else{
					$('.order').find('.load-more').show();
				};
				$timeout(()=>{
					$('body').find('.inline-loading').remove();
				},0);
				if(data.list.length==0) return;
				$scope.dt.fnAddData(data.list);
				if(!fn) return;
				$timeout(()=>{
					fn();
				},0);
			});
		};
		loadData();
		appApi.listAllPromotion((data)=>{
			console.log(data);
			$scope.allPromotion = data.list;
		});
		$('.order').on('tap','.load-more',(e)=>{
			let top =$('.dataTables_scrollBody').scrollTop();
			loadData(()=>{
				$('.dataTables_scrollBody').scrollTop(top);
			});
		});
		$scope.$table.on('tap', 'tbody tr', (e) =>{
			var data = $scope.dt.api(true).row(e.target).data();
			// var orderType = data.orderType;
			if(data){
				$scope.$apply(() => {
					$scope.orderId = data.orderId;
					$scope.orderNo = data.orderNo;
					$scope.showDetail = true;
					$scope.$broadcast('showDetail', data);
				});
			}
		});
		
		$scope.stateClick = (e,i)=>{
			console.log(i);
			$scope.searchParams.orderStatus = i.state;
		};
		$scope.tuanClick = (e,i)=>{
			$scope.searchParams.promotionId = i.promotionId;
		};
		$scope.search = ()=>{
			if($('.form-header').find('.error-msg').is(':visible')) return;
			$scope.searchParams.startTime = $scope.startTime?moment($scope.startTime).format("YYYY-MM-DD HH:mm:ss"):'';
			$scope.searchParams.endTime = $scope.endTime?moment($scope.endTime).format("YYYY-MM-DD HH:mm:ss"):'';
			$scope.pageNum = 1;
			loadData();
		};
		$scope.rest = ()=>{
			$scope.searchParams = {};
			$('.dropdown-toggle').find('.val').text('请选择');
			$scope.pageNum = 1;
			loadData();
		};
		$scope.addOrder = function(e){
			$(e.target).addClass('active');
			$rootScope.$broadcast('addOrder');
		};
		let detailClose = $scope.$on('detailClose', function(){
			$scope.showDetail = false;
		});
		//添加订单后
		let addOrderClose = $scope.$on('addOrderClose', (e) => {
			$scope.pageNum = 1;
			loadData();
		});
		$scope.$on('$destroy', function() {
			addOrderClose();
			detailClose();
		});
	};
	return {controller: controller, tpl: tpl};
});