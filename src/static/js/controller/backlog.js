define(['angular', 'text!tpl/backlog.html', 'waves', 'nprogress','toastr','moment','loading','swiper'], function(angular, tpl, Waves, NProgress,toastr,moment) {
	function controller($scope,appApi,getStatuDisplay,toThousands,watch,dateArray) {
		Waves.init();
		Waves.attach('.button', ['waves-block','waves-light']);
		NProgress.done();
		$scope.dateObj = dateArray();
		console.log($scope.dateObj);
		$scope.$modal = $('.task-modal');
		$scope.title = '完成任务';
		$scope.$table = $('.backlog-table');
		$scope.tableData = {};
		$scope.stageIds = [];
		$scope.postUrl = '';
		$scope.remark = '';
		$scope.pageNum = 1;
		$scope.$dateIndex = 0;
		$scope.isSkip = 1;
		$scope.dateStr = moment().format('YYYY-MM-DD');
		$scope.timeStr = '09:00-09:30';
		$scope.revampData = {};
		$scope.tableScollHeight = $(window).height() - $scope.$table.offset().top - $scope.$table.find('thead').outerHeight() - 100;
		console.log($scope.$modal.find('.modal-dialog').outerHeight());
		let loadData = (fn) =>{
			$('body').loading();
			appApi.searchMatter($scope.stageIds,$scope.pageNum,(data)=>{
				console.log(data);
				$scope.tableData = data;
				$scope.pageNum++;
				if(data.pageNum<=1){
					$scope.dt.fnClearTable();
				};
				if(data.pageNum==data.pages){
					$('.backlog').find('.load-more').hide();
				}else{
					$('.backlog').find('.load-more').show();
				};
				setTimeout(()=>{
					$('body').find('.inline-loading').remove();
				},0);
				if(data.list.length==0) return;
				$scope.dt.fnAddData(data.list);
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
				let top =$('.dataTables_scrollBody').scrollTop();
				loadData(()=>{
					$('.dataTables_scrollBody').scrollTop(top);
				});
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
					data: 'productPrice',
					width: '10%'
				},
				{
					data: 'deliveryStageName',
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
		$scope.rest = (e) => {
			$scope.stageIds = [];
			$scope.pageNum = 1;
			loadData();
		};
		$scope.$table.on('tap','.move-appoint',function(e){
			e.stopPropagation();
			e.preventDefault();
			var data = $scope.dt.api(true)
			.row($(this).parents('tr')).data();
			$scope.$apply(()=>{
				$scope.title = '改约任务';
			});
			$scope.postUrl = 'updateAppoint';
			$scope.$modal.data('data',data).modal('show');
		});
		$scope.$table.on('tap','.done',function(e){
			e.stopPropagation();
			e.preventDefault();
			var data = $scope.dt.api(true)
			.row($(this).parents('tr')).data();
			$scope.$apply(()=>{
				$scope.title = '完成任务';
			});
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
			$scope.submited = true;
			let data = $scope.$modal.data('data');
			if($scope.remark!=undefined&&$scope.remark!=''){
				if($scope.isSkip == 1){
					$scope.revampData = {
						orderId:data.orderId,
						orderDeliveryId:data.orderDeliveryId,
						startTime:null,
						endTime:null,
						remark:$scope.remark,
						isSkip:1
					};
				}else{
					$scope.revampData = {
						orderId:data.orderId,
						orderDeliveryId:data.orderDeliveryId,
						startTime:$scope.dateStr+' '+$scope.timeStr.split('-')[0],
						endTime:$scope.dateStr+' '+$scope.timeStr.split('-')[1],
						remark:$scope.remark,
						isSkip:0
					};
				}
				console.log($scope.revampData)
				updateAppoint($scope.revampData);
			}
		};
		$scope.$modal.on('hidden.bs.modal', () => {
			$scope.$dateIndex = 0;
			$scope.isSkip = 1;
			$scope.dateStr = moment().format('YYYY-MM-DD');
			$scope.timeStr = '09:00-09:30';
			$scope.revampData = {};
			$scope.submited = false;
			$scope.remark = '';
			$scope.$digest();
		});
		$scope.$modal.on('shown.bs.modal', () => {
			if(!$scope.Swiper){
				setTimeout(()=>{
					$scope.Swiper = new Swiper('.swiper-container',{
						freeMode : true,
						slidesPerView: 'auto',
						roundLengths : true,
						prevButton:'.date-time-picker .left-arrow',
						nextButton:'.date-time-picker .right-arrow'
					});
				},0);
			}
		});
		watch((n,o)=>{
			$scope.stageIds = [];
			$scope.pageNum = 1;
			loadData();
		});
		
		$scope.dateFinish = ()=>{
			$scope.wrapperStyle = {
				width:365*106+'px'
			};
			$scope.$modal.find('.modal-dialog').css('margin-top','-'+$scope.$modal.find('.modal-dialog').outerHeight()/2+'px');
			$scope.$modal.hide();
		};
		$scope.dayClick = (e,item,index)=>{
			$scope.$dateIndex = index;
			$scope.dateStr = item.date;
			$scope.isSkip = 0;
		};
		$scope.timeClick = (e,item)=>{
			$scope.timeStr = item;
			$scope.isSkip = 0;
		};
		$scope.skip = ()=>{
			$scope.isSkip = $scope.isSkip==0?1:0;
		}
	};
	return {controller: controller, tpl: tpl};
});