/*-----------------------
 * Site:  Sales-Tools-PAD - ./dist - controller
 * Author: Clearlove 7*
 * Updated: 2017-11-13 23:44
 * Version: 1.0.0
 * -----------------------*/
"use strict";define(["angular","waves","nprogress","toastr","loading"],function(angular,Waves,NProgress,toastr){return{controller:function($scope,appApi,getStatuDisplay,toThousands,watch){Waves.init(),Waves.attach(".button",["waves-block","waves-light"]),NProgress.done(),$scope.$modal=$(".task-modal"),$scope.title="完成任务",$scope.$table=$(".backlog-table"),$scope.tableData={},$scope.stageIds=[],$scope.postUrl="",$scope.remark="",$scope.pageNum=1,$scope.$modal.find(".modal-dialog").css("margin-top","-"+$scope.$modal.find(".modal-dialog").outerHeight()/2+"px"),$scope.$modal.hide(),$scope.tableScollHeight=$(window).height()-$scope.$table.offset().top-$scope.$table.find("thead").outerHeight()-100,console.log($scope.$modal.find(".modal-dialog").outerHeight());var loadData=function(fn){$("body").loading(),appApi.searchMatter($scope.stageIds,$scope.pageNum,function(data){console.log(data),$scope.tableData=data,$scope.pageNum++,data.pageNum<=1&&$scope.dt.fnClearTable(),data.pageNum==data.pages?$(".backlog").find(".load-more").hide():$(".backlog").find(".load-more").show(),setTimeout(function(){$("body").find(".inline-loading").remove()},0),0!=data.list.length&&($scope.dt.fnAddData(data.list),fn&&setTimeout(function(){fn()},0))})},updateAppoint=function(obj){appApi.updateAppoint(obj,$scope.postUrl,function(){$scope.remark="",toastr.success("提交成功"),$scope.$modal.modal("hide")})};loadData(),$scope.dt=$scope.$table.dataTable({order:[],bFilter:!1,bPaginate:!1,buttons:{},scrollY:$scope.tableScollHeight,columns:[{data:"buyerName",width:"10%"},{data:"buyerMobile",width:"20%"},{data:"productDetail",width:"20%"},{data:"productPrice",width:"10%"},{data:"status",width:"10%"},{data:null,width:"30%"}],columnDefs:[{targets:3,visible:!0,render:function(data,type,row,meta){return"￥"+data}},{targets:4,visible:!0,render:function(data,type,row,meta){return getStatuDisplay(data)}},{targets:5,visible:!0,orderable:!1,render:function(data,type,row,meta){return'<a class="button move-appoint">改约</a><a class="button done">完成</a>'}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}}),$scope.statusClick=function(e,id){var index=$scope.stageIds.indexOf(id);index>-1?$scope.stageIds.splice(index,1):$scope.stageIds.push(id)},$scope.search=function(){$scope.pageNum=1,loadData()},$scope.$table.on("tap",".move-appoint",function(e){e.stopPropagation(),e.preventDefault();var data=$scope.dt.api(!0).row($(this).parents("tr")).data();$scope.title="改约任务",$scope.postUrl="updateAppoint",$scope.$modal.data("data",data).modal("show")}),$scope.$table.on("tap",".done",function(e){e.stopPropagation(),e.preventDefault();var data=$scope.dt.api(!0).row($(this).parents("tr")).data();$scope.title="完成任务",$scope.postUrl="finishAppoint",$scope.$modal.data("data",data).modal("show")}),$(".backlog").on("tap",".load-more",function(e){var top=$(".dataTables_scrollBody").scrollTop();loadData(function(){$(".dataTables_scrollBody").scrollTop(top)})}),$scope.affirm=function(){var data=$scope.$modal.data("data");console.log(data),updateAppoint({orderId:data.orderId,orderDeliveryId:data.orderDeliveryId,startTime:null,endTime:null,remark:$scope.remark,isSkip:1})},$scope.$modal.on("hidden.bs.modal",function(){$scope.remark="",$scope.$digest()}),watch(function(n,o){$scope.stageIds=[],$scope.pageNum=1,loadData()})}}});