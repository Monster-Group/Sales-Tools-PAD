define(['angular', 'text!tpl/backlog.html', 'waves', 'nprogress','toastr','loading'], function(angular, tpl, Waves, NProgress,toastr) {
	function controller($scope, appApi,getStatuDisplay,toThousands) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		NProgress.done();
		$scope.$modal = $('.task-modal');
		$scope.title = '完成任务';
		$scope.$table = $('.backlog-table');
		$scope.tableData = {};
		$scope.stageIds = [];
		$scope.postUrl = '';
		$scope.remark = '';
		$scope.pageNum = 1;
		$scope.$modal.find('.modal-dialog').css('margin-top','-'+$scope.$modal.find('.modal-dialog').outerHeight()/2+'px');
		$scope.$modal.hide();
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		console.log($scope.$modal.find('.modal-dialog').outerHeight());
		let loadData = (fn) =>{
			$('body').loading();
			appApi.searchMatter($scope.stageIds,$scope.pageNum,(data)=>{
				console.log(data);
				$scope.tableData = data;
				$scope.pageNum++;
				if(data.pageNum==1){
					$scope.dt.fnClearTable();
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
		let updateAppoint = (obj)=>{
			appApi.updateAppoint(obj,$scope.postUrl,()=>{
				$scope.remark = '';
				toastr.success('提交成功');
				$scope.$modal.modal('hide');
			});
		};
		loadData();
		$scope.dt = $scope.$table.dataTable({
			order:[],
			bFilter: false, //Disable search function
		    bPaginate: false, //hide pagination,
			buttons: {},
			scrollY: $scope.tableScollHeight,
			columns: [{
					data: 'buyerName',
					width: '10%'
				},
				{
					data: 'buyerMobile',
					width: '20%'
				},
				{
					data: 'productDetail',
					width: '20%'
				},
				{
					data: 'priductPrice',
					width: '10%'
				},
				{
					data: 'status',
					width: '10%'
				},
				{
					data: null,
					width: '30%'
				}
			],
			columnDefs: [
			{
				targets: 3,
				visible: true,
				render: function(data, type, row, meta) {
					return '￥'+data;
				}
			},{
				targets: 4,
				visible: true,
				render: function(data, type, row, meta) {
					return getStatuDisplay(data);
				}
			}, {
				targets: 5,
				visible: true,
				orderable:false,
				render: function(data, type, row, meta) {
					let btns = '<a class="button move-appoint">改约</a><a class="button done">完成</a>';
					return btns;
				}
			}],
			fnInitComplete:(s)=>{
				if(s.oScroll.sY){
					$(s.nTable).after($('<a class="load-more">加载更多...</a>'));
				};
				Waves.attach('.load-more', ['waves-block','waves-green']);
			}
		});
		$scope.statusClick = (e,id)=>{
			let index = $scope.stageIds.indexOf(id);
			if(index>-1){
				$scope.stageIds.splice(index,1);
			}else{
				$scope.stageIds.push(id);
			};
		};
		$scope.search = ()=>{
			$scope.pageNum = 1;
			loadData();
		};
		$scope.$table.on('tap','.move-appoint',function(e){
			var data = $scope.dt.api(true)
			.row($(this).parents('tr')).data();
			$scope.title = '改约';
			$scope.postUrl = 'updateAppoint';
			$scope.$modal.data('data',data).modal('show');
		});
		$scope.$table.on('tap','.done',function(e){
			var data = $scope.dt.api(true)
			.row($(this).parents('tr')).data();
			$scope.title = '完成任务';
			$scope.postUrl = 'finishAppoint';
			$scope.$modal.data('data',data).modal('show');
		});
		$('.backlog').on('tap','.load-more',function(e){
			let top =$('.dataTables_scrollBody').scrollTop();
			loadData(()=>{
				$('.dataTables_scrollBody').scrollTop(top);
			});
		});
		$scope.affirm = ()=>{
			let data = $scope.$modal.data('data');
			updateAppoint({
				orderId:data.orderId,
				startTime:'',
				endTime:'',
				remark:$scope.remark,
				isSkip:1
			});
		};
		$scope.test = (e)=>{
			$(e.target).closest('a').toggleClass('active');
		}
	};
	return {controller: controller, tpl: tpl};
});