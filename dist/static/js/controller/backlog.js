/*-----------------------
 * Site:  Sales-Tools-PAD - controller
 * Author: Clearlove 7*
 * Updated: 2017-11-18 00:06
 * Version: 1.0.0
 * -----------------------*/
"use strict";define(["angular","waves","nprogress","toastr","moment","loading","swiper"],function(angular,Waves,NProgress,toastr,moment){return{controller:function($scope,$rootScope,appApi,getStatuDisplay,toThousands,watch,dateArray,$timeout){Waves.init(),Waves.attach(".button",["waves-block","waves-light"]),NProgress.done(),$scope.dateObj=dateArray(),console.log($scope.dateObj),$scope.$modal=$(".task-modal"),$scope.title="完成任务",$scope.$table=$(".backlog-table"),$scope.$payModal=$(".add-pay-modal"),$scope.tableData={},$scope.stageIds=[],$scope.postUrl="",$scope.remark="",$scope.pageNum=1,$scope.$dateIndex=0,$scope.isSkip=1,$scope.dateStr=moment().format("YYYY-MM-DD"),$scope.timeStr="09:00-09:30",$scope.revampData={},$scope.tableScollHeight=$(window).height()-$scope.$table.offset().top-$scope.$table.find("thead").outerHeight()-100,console.log($scope.$modal.find(".modal-dialog").outerHeight()),$timeout(function(){$scope.$payModal.find(".modal-dialog").css("margin-top","-"+$scope.$payModal.find(".modal-dialog").outerHeight()/2+"px"),$scope.$payModal.hide()},0),appApi.countMatterSum(function(data){$rootScope.countMatterSum=data});var loadData=function(fn){$("body").loading(),appApi.searchMatter($scope.stageIds,$scope.pageNum,function(data){console.log(data),$scope.tableData=data,$scope.pageNum++,data.pageNum<=1&&$scope.dt.fnClearTable(),data.pageNum==data.pages?$(".backlog").find(".load-more").hide():$(".backlog").find(".load-more").show(),setTimeout(function(){$("body").find(".inline-loading").remove()},0),0!=data.list.length&&($scope.dt.fnAddData(data.list),fn&&setTimeout(function(){fn()},0))})},updateAppoint=function(obj){appApi.updateAppoint(obj,$scope.postUrl,function(){$scope.remark="",toastr.success("提交成功"),$scope.$modal.modal("hide");var top=$(".dataTables_scrollBody").scrollTop();loadData(function(){$(".dataTables_scrollBody").scrollTop(top)}),appApi.countMatterSum(function(data){$rootScope.countMatterSum=data})})};loadData(),$scope.dt=$scope.$table.dataTable({order:[],bFilter:!1,bPaginate:!1,buttons:{},scrollY:$scope.tableScollHeight,columns:[{data:"buyerName",width:"10%"},{data:"buyerMobile",width:"20%"},{data:"productDetail",width:"20%"},{data:"productPrice",width:"10%"},{data:"deliveryStageName",width:"10%"},{data:null,width:"30%"}],columnDefs:[{targets:3,visible:!0,render:function(data,type,row,meta){return"￥"+data}},{targets:5,visible:!0,orderable:!1,render:function(data,type,row,meta){return'<a class="button move-appoint">改约</a><a class="button done">完成</a>'}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}}),$scope.statusClick=function(e,id){var index=$scope.stageIds.indexOf(id);index>-1?$scope.stageIds.splice(index,1):$scope.stageIds.push(id)},$scope.search=function(){$scope.pageNum=1,loadData()},$scope.rest=function(e){$scope.stageIds=[],$scope.pageNum=1,loadData()},$scope.$table.on("tap",".move-appoint",function(e){e.stopPropagation(),e.preventDefault();var data=$scope.dt.api(!0).row($(this).parents("tr")).data();$scope.$apply(function(){$scope.title="改约任务"}),$scope.postUrl="updateAppoint",$scope.$modal.data("data",data).modal("show")}),$scope.$table.on("tap",".done",function(e){e.stopPropagation(),e.preventDefault();var data=$scope.dt.api(!0).row($(this).parents("tr")).data();$scope.$apply(function(){$scope.title="完成任务"}),$scope.postUrl="finishAppoint",$scope.$modal.data("data",data).modal("show")}),$(".backlog").on("tap",".load-more",function(e){var top=$(".dataTables_scrollBody").scrollTop();loadData(function(){$(".dataTables_scrollBody").scrollTop(top)})}),$scope.$table.on("tap","tbody tr",function(e){e.preventDefault(),e.stopPropagation();var data=$scope.dt.api(!0).row($(this)).data();data&&$scope.$apply(function(){$scope.showOrderDetail=!0,$scope.$broadcast("showDetail",data)})}),$scope.affirm=function(){$scope.submited=!0;var data=$scope.$modal.data("data");void 0!=$scope.remark&&""!=$scope.remark&&(1==$scope.isSkip?$scope.revampData={orderId:data.orderId,orderDeliveryId:data.orderDeliveryId,startTime:null,endTime:null,remark:$scope.remark,isSkip:1}:$scope.revampData={orderId:data.orderId,orderDeliveryId:data.orderDeliveryId,startTime:$scope.dateStr+" "+$scope.timeStr.split("-")[0],endTime:$scope.dateStr+" "+$scope.timeStr.split("-")[1],remark:$scope.remark,isSkip:0},console.log($scope.revampData),updateAppoint($scope.revampData))},$scope.$modal.on("hidden.bs.modal",function(){$scope.$dateIndex=0,$scope.isSkip=1,$scope.dateStr=moment().format("YYYY-MM-DD"),$scope.timeStr="09:00-09:30",$scope.revampData={},$scope.submited=!1,$scope.remark="",$scope.$digest()}),$scope.$modal.on("shown.bs.modal",function(){$scope.Swiper||setTimeout(function(){$scope.Swiper=new Swiper(".swiper-container",{freeMode:!0,slidesPerView:"auto",roundLengths:!0,prevButton:".date-time-picker .left-arrow",nextButton:".date-time-picker .right-arrow"})},0)}),watch(function(n,o){$scope.stageIds=[],$scope.pageNum=1,loadData()}),$scope.dateFinish=function(){$scope.wrapperStyle={width:"38690px"},$scope.$modal.find(".modal-dialog").css("margin-top","-"+$scope.$modal.find(".modal-dialog").outerHeight()/2+"px"),$scope.$modal.hide()},$scope.dayClick=function(e,item,index){$scope.$dateIndex=index,$scope.dateStr=item.date,$scope.isSkip=0},$scope.timeClick=function(e,item){$scope.timeStr=item,$scope.isSkip=0},$scope.skip=function(){$scope.isSkip=0==$scope.isSkip?1:0};var detailOrderClose=$scope.$on("detailClose",function(){$scope.showOrderDetail=!1}),addPay=$scope.$on("addPay",function(e,orderNo){$scope.orderNo=orderNo,$timeout(function(){$scope.$broadcast("showAddPay",$scope.orderNo)},0)});$scope.$on("$destory",function(){detailOrderClose(),addPay()})}}});