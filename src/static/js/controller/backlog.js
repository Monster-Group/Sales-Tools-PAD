define(['angular', 'text!tpl/backlog.html', 'waves', 'nprogress', 'sweetalert'], function(angular, tpl, Waves, NProgress, swal) {
	function controller($scope, appApi) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		NProgress.done();
		$scope.$modal = $('.modal');
		$scope.$table = $('.backlog-table');
		$scope.$modal.css('margin-top','-'+$scope.$modal.outerHeight()/2 + 'px')
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
					var btns = '<button class="btn btn-primary btn-reboot">重启</button>';
					var onOrOff = data.status == 0 ? '<button class="btn btn-success btn-on">启动</button>' : '<button class="btn btn-danger btn-off">关闭</button>';
					var edit = '<button class="btn btn-info btn-edit">修改</button><button class="btn btn-danger btn-del">删除</button>';
					return(btns + onOrOff + edit);
				}
			}]
		});
		$scope.show = (e)=>{
			$scope.$modal.modal({
//				backdrop:false,
				show:true
			});
		};
		
	};
	return {controller: controller, tpl: tpl};
});