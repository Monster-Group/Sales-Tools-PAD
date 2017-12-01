define(['angular', 'moment', 'jquery', 'nprogress','upload','toastr'], function(angular, moment, $, NProgress,oss,toastr) {
	'use strict';
	var appDirectives = angular.module('app.directives', []);
	appDirectives.directive('ngScrollbar', function() {
		return {
			link: function($scope, $element) {
				$($element).perfectScrollbar();
			}
		}
	});
	appDirectives.directive('ngScrollbarY', function() {
		return {
			link: function($scope, $element) {
				$($element).perfectScrollbar({
					suppressScrollX: true
				});
			}
		}
	});
	appDirectives.directive('ngFocus', [function() {
		var FOCUS_CLASS = "ng-focused";
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				element.bind('focus',
					function(evt) {
						element.removeClass(FOCUS_CLASS);
						scope.$apply(function() {
							ctrl.$focused = false;
						});
					}).bind('blur',
					function(evt) {
						element.addClass(FOCUS_CLASS);
						scope.$apply(function() {
							ctrl.$focused = true;
						});
					});
			}
		}
	}]);
	appDirectives.directive('tdRepeat', function($timeout) {
		return {
			link: function($scope, $element, $attrs) {
				if($scope.$last == true && $scope.$parent.$last == true) {
					var finish = $attrs.tdRepeat;
					$timeout(function() {
						$scope.$eval(finish);
					}, 0);
				}
			}
		}
	});
	appDirectives.directive('ngInput', function($rootScope, $parse) {
		return {
			template: function(element, attrs) {
				var type = attrs.type ? attrs.type : 'text';
				var iconLeft = attrs.iconLeft ? attrs.iconLeft.indexOf('{') > -1 ? '<i class="icon icon-left ' + attrs.iconLeft + '"></i>' : '<i class="icon icon-left">' + attrs.iconLeft + '</i>' : '';
				var iconRight = attrs.iconRight ? attrs.iconRight.indexOf('{') > -1 ? '<i class="icon icon-right ' + attrs.iconRight + '"></i>' : '<i class="icon icon-right">' + attrs.iconRight + '</i>' : '';
				var placeholder = attrs.placeholder ? 'placeholder="' + attrs.placeholder + '"' : '';
				var errorLable = '';
				var valid = '';
				var name = attrs.name ? 'name="' + attrs.name + '"' : '';
				var model = attrs.model ? 'ng-model="' + attrs.model + '"' : '';
				var focus = attrs.model ? 'ng-focus' : '';
				if(attrs.valid) {
					var required = attrs.required ? attrs.required : '';
					var minlength = attrs.min ? attrs.min : '';
					var maxlength = attrs.max ? attrs.max : '';
					var pattern = attrs.pattern ? attrs.pattern : '';
					switch(type) {
						case 'email':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.email" class="error-lable">请输入正确的电子邮件格式</span>';
							break;
						case 'number':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.number" class="error-lable">请输入正确的数字</span>';
							break;
						case 'url':
							errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.url" class="error-lable">请输入正确的URL</span>';
							break;
						default:
					}
					if(required != '') {
						valid += ' required=' + required;
						errorLable += '<span ng-show="(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.' + attrs.name + '.$touched)||(' + attrs.form + '.' + attrs.name + '.$error.required&&' + attrs.form + '.$submitted)" class="error-lable">内容不可为空</span>';
					}
					if(minlength != '') {
						valid += ' ng-minlength=' + minlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.minlength" class="error-lable">内容不可少于' + minlength + '个字</span>';
					}
					if(maxlength != '') {
						valid += ' ng-maxlength=' + maxlength;
						valid += ' maxlength=' + maxlength;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.maxlength" class="error-lable">内容不可多于' + maxlength + '个字</span>';
					}
					if(pattern != '') {
						valid += ' ng-pattern=' + pattern;
						errorLable += '<span ng-show="' + attrs.form + '.' + attrs.name + '.$error.pattern" class="error-lable">您输入的格式不正确</span>';
					}
				};
				return '<div class="clearfix default-input">' + iconLeft + iconRight + '<input  type="' + type + '" ' + valid + ' ' + model + ' ' + placeholder + ' ' + name + ' ' + focus + ' autocomplete="off" />' + errorLable + '</div>'
			},
			replace: true,
			controller: function($scope, $element, $attrs) {
				var opt = $parse($attrs.opt)($scope);
				var $this = $($element);
				if(opt && opt.class) {
					$this.addClass(opt.class);
				}
			}
		}
	});
	appDirectives.directive('rangeDateValidate', function() {
		return {
			link: function($scope, $elements, $attrs, ) {
				var $start = $($elements).find('.start-date'),
					$end = $($elements).find('.end-date')

				$start.off('change')
					.on('change', function() {
						compare();
					})

				$end.off('change')
					.on('change', function() {
						compare()
					})

				function compare(start, end) {
					var startDate = $start.val();
					var endDate = $end.val();
					console.log(startDate, endDate);
					if((startDate && endDate) && startDate > endDate) {
						$($elements).addClass('error');
					} else {
						$($elements).removeClass('error');
					}
				}
			}
		}
	});

	appDirectives.directive('dropDown', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				display: '=?',//显示名字字段
				renderData: '=',//渲染下拉列表数据  [{},{}]
				model: '=?',//接受数据model   直接为选项的val值
				placeholder: '=?',//默认显示文字
				clickEvent: '=?',//选项点击回调事件，参数$event,item   item为所点击选项的整个对象
				val:'=?'//点击选项取值的字段名
			},
			template: `
				<div class="dropdown">
					<a href="#" data-toggle="dropdown" class="dropdown-toggle clearfix" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
						<span class="val pull-left" ng-bind="displayName"></span>
						<i class="arrow icon pull-right">&#xe792;</i>
					</a>
					<ul class="dropdown-menu animated fadeInUpSmall fast" role="menu">
						<li hm-tap="itemClick($event, '')">请选择</li>
						<li ng-repeat="item in renderData track by $index" ng-bind="item[display]"  hm-tap="itemClick($event, item)"></li>
					</ul>
				</div>
			`,
			link: function($scope, $elements, $attrs, controllers) {
				$($elements).find('.dropdown-toggle').on('tap',function(e){
					$(this).dropdown('toggle');
					e.stopPropagation();
					e.preventDefault();
				});
			},
			controller: function($scope, $element, $attrs) {
				let getDisplayName = (val)=>{
					let name = '';
					for(let item of $scope.renderData){
						if(item[$scope.val] == val){
							name = item[$scope.display];
						}
					}
					return name;
				};
				$scope.val = $scope.val?$scope.val:'value';
				$scope.display = $scope.display ? $scope.display : 'name';
				$scope.placeholder || ($scope.placeholder = '请选择');
				$scope.displayName = ($scope.model===undefined||$scope.model==='')?$scope.placeholder:getDisplayName($scope.model);
				$scope.itemClick = function(e, item) {
					delete item.$$hashKey;
					if(item[$scope.val] == $scope.model) {
						e.preventDefault();
						return false;
					}
					$scope.model = item[$scope.val];
					$scope.clickEvent && $scope.clickEvent(e, item);
				};
				var watch = $scope.$watch('model', function (newVal, oldVal) {
					if (newVal != oldVal) {
						$scope.displayName = ($scope.model===undefined||$scope.model==='')?$scope.placeholder:getDisplayName($scope.model);
					}
				});
				$scope.$on('$destroy', ()=>{
					watch();
				});
			}
		}
	})

	appDirectives.directive('modalContainer', function() {
		return {
			restrict: 'E',
			transclude: {
				'header': 'modalContainerHeader',
				'body': 'modalContainerBody',
				'footer': 'modalContainerFooter'
			},
			replace: true,
			template: `
				<div class="modal fade custom-modal add-order-modal in" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header" ng-transclude="header">		
							</div>
							<div class="modal-body" ng-transclude="body">
							</div>
							<div class="modal-footer" ng-transclude="footer">
							</div>
						</div>
					</div>
				</div>
			`,
			controller: function($scope, $element, $attrs) {}
		}
	});
	//单选
	//<select chosen  placeholder-text-single="'请选择'" ng-model="selectModel.orderType"
	//    ng-options="item.value as item.name for item in $root.enumData.orderType" disable-search="true" width="256" conver-to-number>
	//								<option value="">请选择</option>
	//    							</select>
	//多选
	// <select chosen multiple placeholder-text-multiple="'请选择'"
	//    ng-options="item.name for item in $root.enumData.orderType" disable-search="true" width="256" ng-model="selectModel.product">
	appDirectives.directive('clientUpdate', function($rootScope,appApi) {
		return {
			restrict: 'E',
			scope: {
				id:'=?',
				type:'='
			},
			replace: true,
			template: `
			<form name="clientForm" novalidate>
				<div class="info-block">
					<h3>基本信息:</h3>
					<div class="info-body">
						<div ng-if="type==1">
							<span>ID:<i ng-bind="detailModel.userId"></i></span>
						</div>
						<div>
							<span><i class="color-red">*</i>姓名:</span>
							<input class="default-input" type="text" name="name" ng-model="detailModel.realname" required ng-class="{'error':clientForm.$submitted&&clientForm.name.$invalid}" />
						</div>
						<div>
							<span><i class="color-red">*</i>性别:</span>
							<drop-down render-data="$root.enumData.gender" model="detailModel.sex" ng-class="{'error':clientForm.$submitted&&(detailModel.sex===undefined||detailModel.sex==='')}"></drop-down>
						</div>
						<div>
							<span>年龄:</span>
							<drop-down render-data="$root.enumData.age" model="detailModel.age"></drop-down>
						</div>
						<div>
							<span>生日:</span>
							<input class="default-input" type="date" name="birthdayStr" ng-model="detailModel.birthdayStr"/>
						</div>
						<div>
							<span><i class="color-red">*</i>手机号:</span>
							<input class="default-input mobile" ng-readonly="type==1" type="text" name="mobile" ng-model="detailModel.mobile" required ng-pattern="/^1[3|4|5|7|8][0-9]{9}$/" ng-class="{'error':clientForm.$submitted&&clientForm.mobile.$invalid}"/>
						</div>
						<div>
							<span>QQ:</span>
							<input class="default-input" type="text" name="qq" ng-model="detailModel.qq" />
						</div>
						<div>
							<span>微信:</span>
							<input class="default-input" type="text" name="wechatNumber" ng-model="detailModel.wechatNumber" />
						</div>
						<div>
							<span>邮箱:</span>
							<input class="default-input" type="text" name="email" ng-model="detailModel.email" />
						</div>
						<div>
							<span>户籍:</span>
							<input class="default-input" type="text" name="censusRegister" ng-model="detailModel.censusRegister" />
						</div>
						<div>
							<span><i class="color-red">*</i>省:</span>
							<drop-down render-data="$root.enumData.regionList" model="detailModel.province" display="'provinceName'" val="'provinceId'" click-event="provinceClick" ng-class="{'error':clientForm.$submitted&&!detailModel.province}"></drop-down>
						</div>
						<div>
							<span><i class="color-red">*</i>市:</span>
							<drop-down render-data="cityList" model="detailModel.city" display="'cityName'" val="'cityId'" ng-class="{'error':clientForm.$submitted&&!detailModel.city}"></drop-down>
						</div>
						<div>
							<span>家庭住址:</span>
							<input class="default-input" type="text" name="homeAddress" ng-model="detailModel.homeAddress" />
						</div>
						<div>
							<span>小区:</span>
							<input class="default-input" type="text" name="plot" ng-model="detailModel.plot" />
						</div>
						<div>
							<span>是否已婚:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isMarried"></drop-down>
						</div>
						<div>
							<span>是否有小孩:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isKid"></drop-down>
						</div>
						<div>
							<span>工作单位:</span>
							<input class="default-input" type="text" name="company" ng-model="detailModel.company" />
						</div>
						<div>
							<span>职务:</span>
							<input class="default-input" type="text" name="job" ng-model="detailModel.job" />
						</div>
						<div>
							<span>学历:</span>
							<drop-down render-data="$root.enumData.education" model="detailModel.education"></drop-down>
						</div>
						<div>
							<span>用户状态:</span>
							<drop-down render-data="$root.enumData.userStatus" model="detailModel.userStatus"></drop-down>
						</div>
						<div>
							<span>等级:</span>
							<drop-down render-data="$root.enumData.userLevel" model="detailModel.userLv"></drop-down>
						</div>
						<div>
							<span>是否有赠品:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isGift"></drop-down>
						</div>
						<div>
							<span>是否有投诉:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isComplain"></drop-down>
						</div>
						<div>
							<span>是否要回访:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isVisit"></drop-down>
						</div>
					</div>
				</div>
				<div class="info-block">
					<h3>购买意向:</h3>
					<div class="info-body">
						<div>
							<span>是否有车:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isCar"></drop-down>
						</div>
						<div>
							<span>已有车型:</span>
							<input class="default-input short" type="text" name="haveCar" ng-model="detailModel.haveCar"/>
						</div>
						<div>
							<span>有车年限:</span>
							<input class="default-input short" type="number" name="haveCarYear" ng-model="detailModel.haveCarYear"/>
						</div>
						<div>
							<span>已有车保险价格:</span>
							<input class="default-input short" type="text" name="carInsurancePrice" ng-model="detailModel.carInsurancePrice" />
						</div>
						<div>
							<span>已有车保险种内容:</span>
							<input class="default-input short" type="text" name="carInsuranceContent" ng-model="detailModel.carInsuranceContent" />
						</div>
						<div>
							<span>是否已试驾:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isTestDrive"></drop-down>
						</div>
						<div class="has-textarea">
							<span>试驾反馈:</span>
							<textarea class="default-textarea" ng-model="detailModel.testDriveFeedback" rows="4"></textarea>
						</div>
						<div class="has-textarea">
							<span>产品建议:</span>
							<textarea class="default-textarea" ng-model="detailModel.productProposal" rows="4"></textarea>
						</div>
						<div class="has-textarea">
							<span>购买意向:</span>
							<textarea class="default-textarea" ng-model="detailModel.buyInclination" rows="4"></textarea>
						</div>
						<div>
							<span>几个车位:</span>
							<input class="default-input short" type="text" name="carportNumber" ng-model="detailModel.carportNumber" />
						</div>
						<div>
							<span>车位情况:</span>
							<input class="default-input short" type="text" name="carportCondition" ng-model="detailModel.carportCondition" />
						</div>
						<div>
							<span>是否能充电:</span>
							<drop-down render-data="$root.enumData.yesOrNo" model="detailModel.isRecharge"></drop-down>
						</div>
						<div>
							<span>购车使用人:</span>
							<drop-down class="short" render-data="$root.enumData.carUser" model="detailModel.buyCarUser"></drop-down>
						</div>
						<div>
							<span>接受价格:</span>
							<input class="default-input short" type="text" name="acceptPrice" ng-model="detailModel.acceptPrice" />
						</div>
						<div>
							<span>购车用途:</span>
							<drop-down render-data="$root.enumData.carUse" model="detailModel.buyCarUse"></drop-down>
						</div>
						<div>
							<span>意向车型:</span>
							<input class="default-input short" type="text" name="catTypeInclination" ng-model="detailModel.catTypeInclination"/>
						</div>
						<div>
							<span>意向配置:</span>
							<input class="default-input short" type="text" name="deployInclination" ng-model="detailModel.deployInclination" />
						</div>
						<div>
							<span>意向车色:</span>
							<input class="default-input short" type="text" name="carColorInclination" ng-model="detailModel.carColorInclination" />
						</div>
						<div>
							<span>购车关注因素:</span>
							<drop-down class="short" render-data="$root.enumData.buyFocus" model="detailModel.buyCarFactor"></drop-down>
						</div>
						<div>
							<span>是否需要专属订制:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExclusive"></drop-down>
						</div>
						<div>
							<span>信息来源渠道:</span>
							<drop-down class="short" render-data="$root.enumData.infoSource" model="detailModel.infobahn"></drop-down>
						</div>
						<div>
							<span>是否体验车用户:</span>
							<drop-down class="short" render-data="$root.enumData.yesOrNo" model="detailModel.isExperienceCar"></drop-down>
						</div>
						<div>
							<span>用户接触次数:</span>
							<input class="default-input short" type="text" name="customerCount" ng-model="detailModel.customerCount" />
						</div>
						<div>
							<span>用户接触原因:</span>
							<input class="default-input short" type="text" name="customerReason" ng-model="detailModel.customerReason" />
						</div>
					</div>
				</div>
				<div class="btn-wrapper">
					<i class="error-msg" ng-if="showError&&clientForm.$submitted">请完整且正确的填写客户信息</i>
					<a class="button" hm-tap="affirm()">确定</a>
					<a class="button" hm-tap="detailRest()">重置</a>
				</div>
			</div>`,
			controller: function($scope, $element, $attrs) {
				$scope.detailData = {};
				$scope.detailModel = {};
				let detailIsChange = ()=>{
					return !(JSON.stringify($scope.userDetail) == JSON.stringify($scope.detailModel));
				};
				let getDetail = () => {
					$('body').loading();
					appApi.getUserBack($scope.id, (data) => {
						$('body').find('.inline-loading').remove();
						delete data.user.createdTime;
						delete data.user.updatedTime;
						data.user.birthdayStr = moment(data.user.birthday)._d;
						delete data.user.birthday;
						$scope.detailData = data.user;
						$scope.detailModel = $.extend(true,{},data.user);
						$('body').find('.inline-loading').remove();
						if(data.user.province){
							getCityList(data.user.province);
						}
					});
				};
				let getCityList = (id)=>{
					$scope.cityList = [];
					for(let item of $rootScope.enumData.regionList){
						if(item.provinceId==id){
							$scope.cityList = item.cityList;
						}
					};
				};
				if($scope.type==1){
					getDetail();
				};
				$($element).find('.mobile').on('blur',function(){
					if($(this).hasClass('ng-valid')&&$scope.type!=1){
						appApi.checkMobile($(this).val(),(data)=>{
							console.log(data);
							if(data.data.code==200){
								$(this).removeClass('error');
							}else{
								$(this).addClass('error');
							}
						});
					};
				});
				$scope.provinceClick = (e,i)=>{
					getCityList(i.provinceId);
				};
				$scope.affirm = () => {
					$scope.clientForm.$submitted = true;
					setTimeout(()=>{
						if($($element).find('.error').length==0){
							$scope.showError = false;
							let postData = $.extend(true, {}, $scope.detailModel);
							postData.birthdayStr = moment(postData.birthdayStr).format('YYYY-MM-DD');
							if($scope.type==1){
								console.log('update');
								appApi.updateUserBack(postData,(data)=>{
									console.log(data);
									toastr.success('成功更新用户资料');
									$scope.$emit('hideDetail');
									$rootScope.$broadcast('loadClientList');
								});
							}else{
								appApi.saveUserBack(postData,(data)=>{
									console.log(data);
									toastr.success('成功新建用户');
									$scope.$emit('hideAddClient');
									$rootScope.$broadcast('loadClientList');
								});
							}
						}else{
							$scope.$apply(() => {
								$scope.showError = true;
							});
						}
					});
				};
				$scope.detailRest = ()=>{
					$scope.detailModel = $.extend(true,{},$scope.userDetail);
				};
				
			}
		}
	});
	appDirectives.directive('idcardCheck', function(){
        return{
            require: '?ngModel',
            link: function($scope, $elem, $attrs, ctrl){
                ctrl.$validators.idcardCheck = function(modelValue, viewValue){
                    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                    var reg =  /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i
                    // console.log(reg.test(value))
                    var value = modelValue || viewValue;
                    if(!value||!reg.test(value))return false;

                    if(!city[String(value).substr(0,2)])return false;

                    return true;
                }
              }
        }
    })
});