//---------------------------------
//Site:  Kingnet - login
//Author: Clearlove 7*
//Updated: 2016.11.3
//Version: 1.0 
//---------------------------------
require(['domReady', 'baseSet', 'validate', 'validateMethods', 'jquery', 'particles'], function(domReady, baseSet) {
	var login = {
		ground: function() {
			/* ---- particles.js config ---- */
			particlesJS('login-wrapper', {
				particles: {
					number: {
						value: 20,
						density: {
							enable: !0,
							value_area: 1E3
						}
					},
					color: {
						value: "#2a3f54"
					},
					shape: {
						type: "circle",
						stroke: {
							width: 0,
							color: "#000000"
						},
						polygon: {
							nb_sides: 5
						},
						image: {
							src: "img/github.svg",
							width: 100,
							height: 100
						}
					},
					opacity: {
						value: .3,
						random: !1,
						anim: {
							enable: !1,
							speed: 1,
							opacity_min: .1,
							sync: !1
						}
					},
					size: {
						value: 15,
						random: !0,
						anim: {
							enable: !1,
							speed: 180,
							size_min: .1,
							sync: !1
						}
					},
					line_linked: {
						enable: !0,
						distance: 650,
						color: "#cfcfcf",
						opacity: .26,
						width: 1
					},
					move: {
						enable: !0,
						speed: 2,
						direction: "none",
						random: !0,
						straight: !1,
						out_mode: "out",
						bounce: !1,
						attract: {
							enable: !1,
							rotateX: 600,
							rotateY: 1200
						}
					}
				},
				interactivity: {
					detect_on: "canvas",
					events: {
						onhover: {
							enable: 1,
							mode: "repulse"
						},
						onclick: {
							enable: !1,
							mode: "push"
						},
						resize: !0
					},
					modes: {
						grab: {
							distance: 400,
							line_linked: {
								opacity: 1
							}
						},
						bubble: {
							distance: 400,
							size: 100,
							duration: 2,
							opacity: 8,
							speed: 3
						},
						repulse: {
							distance: 200,
							duration: .4
						},
						push: {
							particles_nb: 4
						},
						remove: {
							particles_nb: 2
						}
					}
				},
				retina_detect: !0
			});
		},
		init: function() {
			var blockCenter = $('.block-center');
			var blockHeight = blockCenter.outerHeight();
			var marginTop = ($(window).height() - blockHeight - $('.copyright').outerHeight()) <= 0 ? ($(window).height() - blockHeight) / 2 : ($(window).height() - blockHeight - $('.copyright').outerHeight()) / 2;
			
		},
		inputValidation: function() {
			$('.login-form').validate({
				debug: true,
				rules: {
					loginName: {
						required: true
					},
					password: {
						required: true
					}
				},
				messages: {
					loginName: {
						required: '用户名不能为空'
					},
					password: {
						required: '密码不能为空'
					}
				},
				onfocusout: function(element) {
					$(element).valid();
				}
			});
		},
		loginSub: function() {
			var logInfo = {};
			function login() {
				var $span = $('.btn-login').find('span');
				var $icon = $('.btn-login').find('.icon');
				if($('.login-form').validate().form()) {
					$span.addClass('ld-hide');
					$icon.addClass('ld-show');
					logInfo.name = $('#user-name').val();
					logInfo.password = $('#password').val();
					$.ajax({
						type:'POST',
						url:baseSet.postServer+'api/v2/account/newLogin',
						headers:{
							'Content-Type':'application/x-www-form-urlencoded'
						},
						data: $.param(logInfo),
						success:function(data){
							if(data.code==200){
								window.location.href = 'ipad.html#order';
								localStorage.setItem('loginfo',JSON.stringify(data.data));
							}else{
								$('.error-msg').text(data.msg);
							}
							console.log(data);
						},
						complete:function(){
							$span.removeClass('ld-hide');
							$icon.removeClass('ld-show');
						}
					});
				};
			};
			$('#user-name,#password').on('keydown', function(e) {
				if(e.keyCode == 13) {
					login();
				}
			});
			$('.btn-login').on('click', function() {
				login();
			});
		}
	};
	domReady(function() {
		login.ground();
		login.init();
		//login.imgInit();
		login.loginSub();
		login.inputValidation();
	});
});