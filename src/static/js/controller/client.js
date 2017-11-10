define(['angular', 'text!tpl/client.html', 'waves', 'nprogress','toastr','moment','loading'], function(angular, tpl, Waves, NProgress,toastr,moment) {
	function controller($scope,$rootScope, appApi,getUserLv,watch) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		NProgress.done();
		$scope.$table = $('.client-table');
		$scope.pageNum = 1;
		$scope.searchParams = {};
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		let loadData = (fn) =>{
			$scope.searchParams.accountId = $rootScope.loginfo.account.accountId;
			$scope.searchParams.storeId = $rootScope.loginfo.account.storeId;
			console.log($scope.searchParams);
			$('body').loading();
			appApi.listUserBackSales($scope.searchParams,$scope.pageNum,(data)=>{
				console.log()
				if(data.userList.pageNum<=1){
					$scope.dt.fnClearTable();
					console.log(data);
				};
				$scope.pageNum++;
				if(data.userList.pageNum==data.userList.pages){
					$('.client').find('.load-more').remove();
				};
				setTimeout(()=>{
					$('body').find('.inline-loading').remove();
				},0);
				if(data.userList.list.length==0) return;
				$scope.dt.fnAddData(data.userList.list);
				if(!fn) return;
				setTimeout(()=>{
					fn();
				},0);
			});
		};
		$scope.dt = $scope.$table.dataTable({
			order:[],
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
			columnDefs: [
				{
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
						return data?data:'';
					}
				}
			],
			fnInitComplete:(s)=>{
				if(s.oScroll.sY){
					$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
				};
				Waves.attach('.load-more', ['waves-block','waves-green']);
			}
		});
		loadData();
		$scope.search = ()=>{
			$scope.pageNum = 1;
			loadData();
		};
		$scope.rest = (e)=>{
			console.log(e);
			e.stopPropagation();
			e.preventDefault();
		};
		$('.client').on('tap','.load-more',function(e){
			let top =$('.dataTables_scrollBody').scrollTop();
			loadData(()=>{
				$('.dataTables_scrollBody').scrollTop(top);
			});
		});
		watch((n,o)=>{
			$scope.searchParams = {};
			$scope.pageNum = 1;
			$('.client-level').find('.val').text('请选择');
			loadData();
		});
		$('.tab-wrapper').on('tap','.tab-item',function(){
			console.log(123)
			$(this).tab('show');
		});
	};
	return {controller: controller, tpl: tpl};
});