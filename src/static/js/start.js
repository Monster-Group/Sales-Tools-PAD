(function (win) {
	require(['angular','nprogress','router-config','app','common'], function(angular,NProgress){
		NProgress.start();
	    angular.bootstrap(document, ['webapp']);
	});
})(window);
