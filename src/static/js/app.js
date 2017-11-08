define(['waves','iNoBounce','jquery','bootstrap','Ps','tap'],function(Waves,iNoBounce){
	Waves.init();
	Waves.attach('.aside li a', ['waves-block','waves-green']);
//	Waves.attach('.button', ['waves-block','waves-green']);
	$('.main_container>.left_col').perfectScrollbar({
		suppressScrollX: true
	});
	iNoBounce.enable();
});
