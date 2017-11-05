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
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		$scope.dt = $scope.$table.dataTable({
			order:[],
			bFilter: false, //Disable search function
		    bPaginate: false, //hide pagination,
		    scrollY: $scope.tableScollHeight,
			buttons: {},
			columns: [{
					data: 'orderNo',
					width: '30%'
				},
				{
					data: 'createdTime',
					width: '25%'
				},
				{
					data: 'productDetail',
					width: '20%'
				},
				{
					data: 'promotionName',
					width: '25%'
				},
				{
					data: 'buyerName',
					width: '25%'
				},
				{
					data: 'buyerMobile',
					width: '25%'
				},
				{
					data: 'status',
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
		
		
		

		$scope.addOrder = function(){
			$scope.$addModal.modal();
		}
	};
	return {controller: controller, tpl: tpl};
});