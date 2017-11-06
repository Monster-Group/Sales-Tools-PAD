define(function () {
	var datas = {};

	datas.orderType = [
		{
			name: '车辆',
			value: 0
		},
		{
			name: '周边商品',
			value: 1
		}
	];

	datas.gender = [{ value: 0, name :'保密'},{value: 1, name:'女'},{value:2, name:'男'}];
	// console.log(datas);

	return datas;
})