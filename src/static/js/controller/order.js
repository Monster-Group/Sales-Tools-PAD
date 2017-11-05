define(['angular', 'text!tpl/order.html', 'waves', 'nprogress', 'sweetalert'], function(angular, tpl, Waves, NProgress, swal) {
	function controller($scope, appApi) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		Waves.attach('.load-more', ['waves-block','waves-green']);
		NProgress.done();
		$scope.QueryDate = undefined;
		console.log(123123);
		$scope.$table = $('.order-table');
		$scope.dt = $scope.$table.dataTable({
			bFilter: false, //Disable search function
		    bPaginate: false, //hide pagination,
			buttons: {},
			columns: [{
					data: 'serverName',
					width: '30%'
				},
				{
					data: 'ipPort',
					width: '25%'
				},
				{
					data: 'status',
					width: '20%'
				},
				{
					data: null,
					width: '25%'
				}
			],
			columnDefs: [{
				targets: 2,
				visible: true,
				render: function(data, type, row, meta) {
					return data.status == 0 ? '关闭' : '运行中';
				}
			}, {
				targets: 3,
				visible: true,
				render: function(data, type, row, meta) {
					var btns = '<button class="button done">完成</button>';
					return btns;
				}
			}]
		});
		$scope.data = [
			{
				serverName:'13649879865465',
				ipPort:'2017-10-30 09:00:09',
				status:'Car AE100-700EVA-LV1-P(N)-2座极光银/钢琴黑/灰-绿'
			},
			{
				serverName:'13649879865465',
				ipPort:'2017-10-30 09:00:09',
				status:'Car AE100-700EVA-LV1-P(N)-2座极光银/钢琴黑/灰-绿'
			},
			{
				serverName:'13649879865465',
				ipPort:'2017-10-30 09:00:09',
				status:'Car AE100-700EVA-LV1-P(N)-2座极光银/钢琴黑/灰-绿'
			}
		];
		$scope.$table.on('tap','.done',function(){
			console.log(12221)
			
		});
		$scope.dt.fnClearTable();
		if($scope.data.length==0) return;
		$scope.dt.fnAddData($scope.data);

		$scope.addOrder = function(){
			$('.add-order-modal').modal();
		}
	};
	return {controller: controller, tpl: tpl};
});