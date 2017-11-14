/*-----------------------
 * Site:  Sales-Tools-PAD - controller
 * Author: Clearlove 7*
 * Updated: 2017-11-15 01:34
 * Version: 1.0.0
 * -----------------------*/
"use strict";define(["angular","waves","nprogress","toastr","moment","loading"],function(angular,Waves,NProgress,toastr,moment){return{controller:function($scope,$rootScope,appApi,getUserLv,getOrderStatu){Waves.init(),Waves.attach(".button",["waves-block","waves-light"]),NProgress.done(),$scope.$table=$(".client-table"),$scope.$detailTable=$(".client-detail-table"),$scope.$remarkTable=$(".remark-table"),$scope.$addModal=$(".add-order-modal"),$scope.$addModal.on("hidden.bs.modal",function(){$(".add-btn").removeClass("active")}),$scope.pageNum=1,$scope.orderpageNum=1,$scope.remarkPageNum=1,$scope.headHide=!0,$scope.showAddClient=!1,$scope.searchParams={},$scope.tableScollHeight=$(window).height()-$scope.$table.offset().top-$scope.$table.find("thead").outerHeight()-100,$scope.userId="";var loadData=function(fn){$scope.searchParams.accountId=$rootScope.loginfo.account.accountId,$scope.searchParams.storeId=$rootScope.loginfo.account.storeId,$("body").loading(),appApi.listUserBackSales($scope.searchParams,$scope.pageNum,function(data){data.userList.pageNum<=1&&$scope.dt.fnClearTable(),$scope.pageNum++,data.userList.pageNum==data.userList.pages?$(".client").find(".load-more").hide():$(".client").find(".load-more").show(),setTimeout(function(){$("body").find(".inline-loading").remove()},0),0!=data.userList.list.length&&($scope.dt.fnAddData(data.userList.list),fn&&setTimeout(function(){fn()},0))})},loadOrderList=function(fn){$("body").loading(),appApi.listOrderByAccount($scope.userId,$scope.orderpageNum,function(data){$scope.orderpageNum++,$("#order").data("load","no"),data.pageNum<=1&&$scope.ddt.fnClearTable(),data.pageNum==data.pages?$("#order").find(".load-more").hide():$("#order").find(".load-more").show(),$("body").find(".inline-loading").remove(),0!=data.list.length&&($scope.ddt.fnAddData(data.list),fn&&setTimeout(function(){fn()},0))})},loadRemark=function(fn){$("body").loading(),appApi.listRemarkBack($scope.userId,$scope.remarkPageNum,function(data){console.log(data),$scope.remarkPageNum++,$("#remark").data("load","no"),data.pageNum<=1&&$scope.remarkDt.fnClearTable(),data.pageNum==data.pages?$("#remark").find(".load-more").hide():$("#remark").find(".load-more").show(),$("body").find(".inline-loading").remove(),0!=data.list.length&&($scope.remarkDt.fnAddData(data.list),fn&&setTimeout(function(){fn()},0))})};$scope.dt=$scope.$table.dataTable({order:[],bFilter:!1,bPaginate:!1,buttons:{},scrollY:$scope.tableScollHeight,columns:[{data:"realname",width:"10%"},{data:"mobile",width:"20%"},{data:"createdTime",width:"20%"},{data:"userLv",width:"20%"},{data:"remarkContent",width:"30%",orderable:!1}],columnDefs:[{targets:2,visible:!0,render:function(data,type,row,meta){return moment(data).format("YYYY-MM-DD HH:mm:ss")}},{targets:3,visible:!0,render:function(data,type,row,meta){return getUserLv(parseInt(data))}},{targets:4,visible:!0,render:function(data,type,row,meta){return data||""}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}});var ddt=function(){$scope.ddt=$scope.$detailTable.dataTable({order:[],bFilter:!1,bPaginate:!1,buttons:{},scrollY:$scope.detailTableScollHeight,columns:[{data:"orderNo",width:"15%"},{data:"createdTime",width:"16%"},{data:"productDetail",width:"20%"},{data:"promotionName",width:"17%"},{data:"status",width:"10%"},{data:"buyerName",width:"10%"},{data:"buyerMobile",width:"12%"}],columnDefs:[{targets:1,visible:!0,render:function(data,type,row,meta){return moment(data).format("YYYY-MM-DD HH:mm:ss")}},{targets:4,visible:!0,render:function(data,type,row,meta){return getOrderStatu(data)}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}})},remarkDt=function(){$scope.remarkDt=$scope.$remarkTable.dataTable({order:[],bFilter:!1,bPaginate:!1,buttons:{},scrollY:$scope.remarkTableScollHeight,columns:[{data:"remarkContent",width:"45%"},{data:"userLv",width:"20%"},{data:"nickname",width:"15%"},{data:"createTime",width:"20%"}],columnDefs:[{targets:1,visible:!0,render:function(data,type,row,meta){return getUserLv(parseInt(data))}},{targets:3,visible:!0,render:function(data,type,row,meta){return moment(data).format("YYYY-MM-DD HH:mm:ss")}}],fnInitComplete:function(s){s.oScroll.sY&&$(s.nTable).after($('<a class="load-more">加载更多...</a>')),Waves.attach(".load-more",["waves-block","waves-green"])}})};loadData(),$scope.goBack=function(){$scope.showDetail=!1},$scope.cancel=function(){$scope.showAddClient=!1},$scope.search=function(){$scope.pageNum=1,loadData()},$scope.rest=function(e){$scope.searchParams={},$(".client-level .dropdown-toggle").find(".val").text("请选择")},$scope.addClient=function(){$scope.showAddClient=!0},$scope.addOrder=function(e){$(e.target).addClass("active"),$scope.$addModal.modal("show")},$(".client-table").on("tap","tbody tr",function(e){var data=$scope.dt.api(!0).row($(this)).data();$(".detail-info").tab("show").addClass("active").siblings("a").removeClass("active"),$scope.$apply(function(){$scope.activeUser=data,$scope.userId=data.userId,$scope.showDetail=!0})}),$(".client-list-wrapper").on("tap",".load-more",function(e){var top=$(".client-list-wrapper .dataTables_scrollBody").scrollTop();loadData(function(){$(".client-list-wrapper .dataTables_scrollBody").scrollTop(top)})}),$("#order").on("tap",".load-more",function(e){var top=$("#order .dataTables_scrollBody").scrollTop();loadOrderList(function(){$("#order .dataTables_scrollBody").scrollTop(top)})}),$("#remark").on("tap",".load-more",function(e){var top=$("#remark .dataTables_scrollBody").scrollTop();loadRemark(function(){$("#remark .dataTables_scrollBody").scrollTop(top)})}),$(".user-order-list").on("shown.bs.tab",function(){$scope.ddt||($scope.detailTableScollHeight=$(window).height()-$scope.$detailTable.offset().top-$scope.$table.find("thead").outerHeight()-160,console.log($scope.detailTableScollHeight),ddt()),$scope.orderpageNum=1,loadOrderList()}),$(".user-remark").on("shown.bs.tab",function(){$scope.remarkDt||($scope.remarkTableScollHeight=$(window).height()-$scope.$remarkTable.offset().top-$scope.$table.find("thead").outerHeight()-160,remarkDt()),$scope.remarkPageNum=1,loadRemark()}),$(".tab-wrapper").on("tap",".tab-item",function(e){e.stopPropagation(),e.preventDefault(),$(this).hasClass("active")||($(this).tab("show"),$(this).addClass("active").siblings("a").removeClass("active"),"#detail"==$(this).data("target")?$scope.$apply(function(){$scope.headHide=!0}):$scope.$apply(function(){$scope.headHide=!1}))});var hideDetail=$scope.$on("hideDetail",function(e){$scope.showDetail=!1}),hideAddClient=$scope.$on("hideAddClient",function(e){$scope.showAddClient=!1}),loadClientList=$rootScope.$on("loadClientList",function(e){$scope.pageNum=1,loadData()});$scope.$on("$destory",function(){hideDetail(),hideAddClient(),loadClientList()})}}});