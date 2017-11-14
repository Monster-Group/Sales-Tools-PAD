/*-----------------------
 * Site:  Sales-Tools-PAD - ./dist - controller
 * Author: Clearlove 7*
 * Updated: 2017-11-13 23:44
 * Version: 1.0.0
 * -----------------------*/
"use strict";define(["angular","waves","nprogress","toastr","moment","loading"],function(angular,Waves,NProgress,toastr,moment){return{controller:function($scope,$rootScope,appApi,getOrderStatu,getMillisecond,$timeout){Waves.init(),Waves.attach(".button",["waves-block","waves-light"]),Waves.attach(".load-more",["waves-block","waves-green"]),NProgress.done(),$scope.$table=$(".order-table"),$scope.showAddPay=!1,$timeout(function(){$scope.$addModal=$(".add-order-modal"),$scope.$payModal=$(".add-pay-modal"),$scope.$addModal.find(".modal-dialog").css("margin-top","-"+$scope.$addModal.find(".modal-dialog").outerHeight()/2+"px"),$scope.$payModal.find(".modal-dialog").css("margin-top","-"+$scope.$payModal.find(".modal-dialog").outerHeight()/2+"px"),$scope.$addModal.hide(),$scope.$payModal.hide(),$scope.$addModal.on("hidden.bs.modal",function(){$(".add-btn").removeClass("active")})},0),$scope.tableScollHeight=$(window).height()-$scope.$table.offset().top-$scope.$table.find("thead").outerHeight()-100,$scope.searchParams={},$scope.pageNum=1,$scope.orderStatus="",$scope.dt=$scope.$table.dataTable({order:[],bFilter:!1,bPaginate:!1,scrollY:$scope.tableScollHeight,buttons:{},columns:[{data:"orderNo",width:"15%"},{data:"createdTime",width:"16%"},{data:"productDetail",width:"20%"},{data:"promotionName",width:"17%"},{data:"status",width:"10%"},{data:"buyerName",width:"10%"},{data:"buyerMobile",width:"12%"}],columnDefs:[{targets:1,visible:!0,render:function(data,type,row,meta){return moment(data).format("YYYY-MM-DD HH:mm:ss")}},{targets:4,visible:!0,render:function(data,type,row,meta){return getOrderStatu(data)}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}});var loadData=function(fn){$("body").loading(),appApi.searchOrderList($scope.searchParams,$scope.pageNum,function(data){console.log(data),$scope.tableData=data,$scope.pageNum++,1==data.pageNum&&$scope.dt.fnClearTable(),data.pageNum==data.pages?$(".order").find(".load-more").hide():$(".order").find(".load-more").show(),0!=data.list.length&&($scope.dt.fnAddData(data.list),$timeout(function(){$("body").find(".inline-loading").remove()},0),fn&&$timeout(function(){fn()},0))})};loadData(),appApi.listAllPromotion(function(data){console.log(data),$scope.allPromotion=data.list}),$(".order").on("tap",".load-more",function(e){var top=$(".dataTables_scrollBody").scrollTop();loadData(function(){$(".dataTables_scrollBody").scrollTop(top)})}),$scope.$table.on("tap","tbody tr",function(e){var data=$scope.dt.api(!0).row(e.target).data();$scope.$apply(function(){$scope.orderId=data.orderId,$scope.orderNo=data.orderNo,$scope.showDetail=!0}),$scope.$broadcast("showDetail",data)}),$scope.stateClick=function(e,i){console.log(i),$scope.searchParams.orderStatus=i.state},$scope.tuanClick=function(e,i){$scope.searchParams.promotionId=i.promotionId},$scope.search=function(){$(".form-header").find(".error-msg").is(":visible")||($scope.searchParams.startTime=$scope.startTime?getMillisecond($scope.startTime):"",$scope.searchParams.endTime=$scope.endTime?getMillisecond($scope.endTime):"",$scope.pageNum=1,loadData())},$scope.rest=function(){$scope.searchParams={},$(".dropdown-toggle").find(".val").text("请选择")},$scope.addOrder=function(e){$(e.target).addClass("active"),$scope.$addModal.modal("show")};var detailClose=$scope.$on("detailClose",function(){$scope.showDetail=!1}),addPay=$scope.$on("addPay",function(e){$scope.showAddPay=!0,$timeout(function(){$scope.$broadcast("showAddPay",$scope.orderNo)},0)});$scope.$on("$destory",function(){detailClose(),addPay()})}}});