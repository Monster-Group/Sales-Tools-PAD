define(['waves','js.cookie','jquery','bootstrap','Ps','tap'],function(Waves,Cookies){
	Waves.init();
	Waves.attach('.aside li a', ['waves-block','waves-green']);
//	Waves.attach('.button', ['waves-block','waves-green']);
	$('.main_container>.left_col').perfectScrollbar({
		suppressScrollX: true
	});
	var userInfo =Cookies.getJSON('user')?Cookies.getJSON('user'):{};
	$('.top_nav').find('.user').text(userInfo.userName);
});
