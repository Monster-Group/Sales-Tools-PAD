define(['angular', 'text!tpl/order.html', 'waves', 'nprogress','toastr'], function(angular, tpl, Waves, NProgress, toastr) {
	function controller($scope, appApi) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		Waves.attach('.load-more', ['waves-block','waves-green']);
		NProgress.done();
		$scope.$table = $('.order-table');
		$scope.$addModal = $('.add-order-modal');
		$scope.$addModal.find('.modal-dialog').css('margin-top','-'+$scope.$addModal.find('.modal-dialog').outerHeight()/2+'px');
		$scope.$addModal.hide();
		$scope.dt = $scope.$table.dataTable({
			order:[],
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
		
		$scope.$table.on('tap','.done',function(){
			console.log(12221)
			
		});
		

		$scope.addOrder = function(){
			$scope.$addModal.modal();
		}
	};
	return {controller: controller, tpl: tpl};
});