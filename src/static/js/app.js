define(['waves','iNoBounce','jquery','bootstrap','tap'],function(Waves,iNoBounce){
	Waves.init();
	Waves.attach('.aside li a', ['waves-block','waves-green']);
	iNoBounce.enable();
	$('.main-container').height($(window).height() - 316);
});
