define(['angular', 'text!tpl/order.html', 'waves', 'nprogress','toastr','moment','loading'], function(angular, tpl, Waves, NProgress, toastr,moment) {
	function controller($scope, appApi,getOrderStatu) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		Waves.attach('.load-more', ['waves-block','waves-green']);
		NProgress.done();
		$scope.$table = $('.order-table');
		$scope.$addModal = $('.add-order-modal');
		$scope.$addModal.find('.modal-dialog').css('margin-top','-'+$scope.$addModal.find('.modal-dialog').outerHeight()/2+'px');
		$scope.$addModal.hide();
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		$scope.searchParams = {};
		$scope.pageNum = 1;
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
					width: '20%'
				},
				{
					data: 'productDetail',
					width: '20%'
				},
				{
					data: 'promotionName',
					width: '15%'
				},
				{
					data: 'buyerName',
					width: '10%'
				},
				{
					data: 'buyerMobile',
					width: '10%'
				},
				{
					data: 'status',
					width: '10%'
				}
			],
			columnDefs: [{
				targets: 1,
				visible: true,
				render: function(data, type, row, meta) {
					return moment(data).format("YYYY-MM-DD HH:mm:ss");
				}
			}, {
				targets: 6,
				visible: true,
				render: function(data, type, row, meta) {
					return getOrderStatu(data);
				}
			}],
			fnInitComplete:(s)=>{
				if(s.oScroll.sY){
					$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
				};
				Waves.attach('.load-more', ['waves-block','waves-green']);
			}
		});
		let loadData = (fn) =>{
			$('body').loading();
			appApi.searchOrderList($scope.searchParams,$scope.pageNum, (data)=>{
				console.log(data);
				$scope.tableData = data;
				$scope.pageNum++;
				if(data.pageNum==1){
					$scope.dt.fnClearTable();
				};
				if(data.pageNum==data.pages){
					$('.order').find('.load-more').remove();
				};
				if(data.list.length==0) return;
				$scope.dt.fnAddData(data.list);
				setTimeout(()=>{
					$('body').find('.inline-loading').remove();
				},0);
				if(!fn) return;
				setTimeout(()=>{
					fn();
				},0);
			});
		};
		loadData();
		$('.order').on('tap','.load-more',(e)=>{
			let top =$('.dataTables_scrollBody').scrollTop();
			loadData(()=>{
				$('.dataTables_scrollBody').scrollTop(top);
			});
		});
		
		$scope.$table.on('tap', 'tbody tr', (e) =>{
			// var data = $scope.$dt.row(this).data();
			var data = {
				orderNo: 111111111,
				buyerName: 'xxx',
				sex: 1 
			}
			$scope.detailData = data;
		});

		$scope.addOrder = function(){
			$scope.$addModal.modal();
		}
	};
	return {controller: controller, tpl: tpl};
});