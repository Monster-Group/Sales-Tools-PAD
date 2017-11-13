//# Sales-Tools-PAD
//# 销售工具PAD端



var project = './src',
	projectDev = './dev',
	projectDist = './dist',
	postServer = 'http://baojun.saojie.me',
	postPort = '';
	outDir = '';



var getWrapper = function(name) {
	return "define(['angular'], function(angular) {\n" +
		"try {\n" +
		"  var module = angular.module('" + name + "');\n" +
		"} catch (e) {\n" +
		"  var module = angular.module('" + name + "', []);\n" +
		"};\n";
};
var wrapperEnd = "\n})";

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
	minifycss = require('gulp-clean-css'), //css压缩
	amdOptimize = require('amd-optimize'), //requirejs打包
	jshint = require('gulp-jshint'), //js语法检查          
	uglify = require('gulp-uglify'), //压缩混淆
	rename = require('gulp-rename'), //重命名
	concat = require('gulp-concat'), //文件合并
	clean = require('gulp-clean'), //清理文件
	insert = require('gulp-insert'), //插入内容
	package = require('./package.json'), //package.json
	through = require('through2'), //获取文件名
	htmlmin = require('gulp-htmlmin'), //HTML压缩
	htmlreplace = require('gulp-html-replace'),
	ngHtml2Js = require('gulp-ng-html2js'), //angular模板打包
	replace = require('gulp-replace'), //替换字符
	rev = require('gulp-rev'), //
	revHash = require('rev-hash'), //
	revCollector = require('gulp-rev-collector'),
	autoprefixer = require('gulp-autoprefixer');


var header = '/*-----------------------\n' +
	' * Site:  Sales-Tools-PAD - {{ name }}\n' +
	' * Author: Clearlove 7*\n' +
	' * Updated: {{ date }}\n' +
	' * Version: {{ version }}\n' +
	' * -----------------------*/\n';
var nowTime = new Date().getTime();


var getOutDir = (argv)=>{
	if(argv.slice(3,4) == '--mode'){
		return './'+argv.slice(4,5)
	}; 
};

function getDate(time, format) {
	var t = new Date(time);
	var tf = function(i) {
		return(i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g,
		function(a) {
			switch(a) {
				case 'yyyy':
					return tf(t.getFullYear());
					break;
				case 'MM':
					return tf(t.getMonth() + 1);
					break;
				case 'mm':
					return tf(t.getMinutes());
					break;
				case 'dd':
					return tf(t.getDate());
					break;
				case 'HH':
					return tf(t.getHours());
					break;
				case 'ss':
					return tf(t.getSeconds());
					break;
			};
		});
};
var tplHeader = '<script type="text/ng-template" id="{{ name }}">';
var tplFooter = '</script>';

// 清空图片、样式、js
gulp.task('clean', function() {
	gulp.src(['./dist/*'], {
			read: false
		})
		.pipe(clean());
});
gulp.task('test', function() {
	console.log(getOutDir(process.argv));
});


gulp.task('update', function() {
	return gulp.src(['./' + project + '/static/**/**.**'])
		.pipe(gulp.dest('./' + projectDist + '/static/'))
});

gulp.task('cssmin', function() {
	var name = 'main.min.css';
	return gulp.src(['./' + project + '/static/css/**/**.css',
			'!./' + project + '/static/css/login.css',
			'!./' + project + '/static/css/main.min.css'
		])
		.pipe(concat(name))
		.pipe(minifycss({
			keepSpecialComments: 0
		}))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(replace('../../', '../'))
		.pipe(gulp.dest('./' + projectDist + '/static/css/'))
});

var scss;
gulp.task('addScss', function() {
	scss = [];
	return gulp.src('./src/static/css/scss/**.scss')
		.pipe(through.obj(function(file, enc, cb) {
			scss.push(file.relative.replace('.scss', ''));
			this.push(file);
			cb();
		}));
});

gulp.task('scss', function() {
	return gulp.src('./' + project + '/static/css/scss/base.scss')
		.pipe(sass())
		.pipe(rename('base.css'))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', 'base'))
		.pipe(gulp.dest('./src/static/css/'));
});

gulp.task('sass',['addScss'],function(){
	var name,stream;
	for(var i = 0; i < scss.length; i++) {
		name = scss[i];
		stream = gulp.src('./' + project + '/static/css/scss/'+name+'.scss')
			.pipe(sass())
			.pipe(rename(name+'.css'))
			.pipe(autoprefixer({
	            browsers: ['last 2 versions', 'Android >= 5.5','last 3 Safari versions','last 3 Chrome versions','iOS 	>= 9.0'],
	            cascade: true,
	            remove:true
	        }))
			.pipe(insert.prepend(header))
			.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
			.pipe(replace('{{ version }}', package.version))
			.pipe(replace('{{ name }}', name))
			.pipe(gulp.dest('./src/static/css/'));
	};
	return stream;
});

gulp.task('ES6Service',function() {
	return gulp.src('./' + project + '/static/js/service/*.js')
	.pipe(babel({
      presets: ['es2015']
    }))
	.pipe(gulp.dest('./src/static/js/service/ES5/'));
});

gulp.task('watch', function() {
	gulp.watch('./' + project + '/static/css/scss/**.scss', ['sass']);
	gulp.watch('./' + project + '/static/js/service/**.js', ['ES6Service']);
});



gulp.task('css', ['cssmin'], function() {
	return gulp.src(['./' + project + '/static/rev/fonts/*.json', './' + project + '/static/css/main.min.css'])
		.pipe(revCollector())
		.pipe(gulp.dest('./' + projectDist + '/static/css/'));
});

gulp.task('baseSet', function() {
	var stream;
	stream = gulp.src('./' + project + '/static/js/libs/default/baseSet.js')
//		.pipe(replace('\''+postServer+'/\'', 'window.location.origin+\'/\''))
		.pipe(gulp.dest('./' + project + '/static/js/libs/default/'));
	return stream;
});

gulp.task('returnBaseSet', ['startJs'],function() {
	var stream;
	stream = gulp.src('./' + project + '/static/js/libs/default/baseSet.js')
		.pipe(replace('window.location.origin+\'/\'','\''+postServer+'/\''))
		.pipe(gulp.dest('./' + project + '/static/js/libs/default/'));
	return stream;
});

gulp.task('router', function() {
	return gulp.src('./' + project + '/static/js/router-config.js')
		.pipe(replace('ret.tpl', '$templateCache.get(getTplName(key)+\'.html\')'))
		.pipe(gulp.dest('./' + project + '/static/js/'));
});

gulp.task('routerClean', ['returnBaseSet'], function() {
	return gulp.src('./' + project + '/static/js/router-config.js')
		.pipe(replace('$templateCache.get(getTplName(key)+\'.html\')', 'ret.tpl'))
		.pipe(gulp.dest('./' + project + '/static/js/'));
});

gulp.task('ctrMini', function() {
	var name = 'controller';
	return gulp.src(['./' + project + '/static/js/controller/**.js'
		])
		.pipe(replace(/ 'text!tpl\/([a-zA-Z]+-)*[a-zA-Z]+.html',/, ''))
		.pipe(replace(' tpl,', ''))
		.pipe(replace(', tpl: tpl', ''))
		.pipe(babel({
	      presets: ['es2015']
	    }))
		.pipe(uglify({
			mangle:false
		}))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(gulp.dest('./' + projectDist + '/static/js/controller/'));
});

gulp.task('tpl', function() {
	return gulp.src(['./' + project + '/static/js/tpl/*.html'])
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(ngHtml2Js({
			declareModule: false,
			moduleName: 'app.template'
		}))
		.pipe(concat('app-templates.js'))
		.pipe(insert.prepend(getWrapper('app.template')))
		.pipe(insert.append(wrapperEnd))
		//.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('./' + project + '/static/js/service/'));
});

gulp.task('configJs', function() {
	var stream, name;
	name = 'config';
	stream = gulp.src('./' + project + '/static/js/config.js')
		.pipe(replace('(new Date).getTime()', "'" + randomString(10) + "'"))
		.pipe(gulp.dest('./' + projectDist + '/static/js/'));
	return stream;
});

gulp.task('indexJs', ['ctrMini', 'routerClean', 'configJs'], function() {
	var stream, name;
	name = 'main.min';
	stream = gulp.src(['./' + projectDist + '/static/js/config.js',
			'./' + projectDist + '/static/js/start.js'
		])
		.pipe(concat(name + '.js'))
//		.pipe(babel({
//	      presets: ['es2015']
//	    }))
		.pipe(uglify({
			mangle:false
		}))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(gulp.dest('./' + projectDist + '/static/js/'));
	return stream;
});

gulp.task('startJs', ['router', 'tpl','baseSet'], function() {
	var name = 'start';
	return gulp.src('./' + project + '/static/js/*.js')
		.pipe(amdOptimize(name, {
			baseUrl: './' + project + '/static/js/',
			configFile: './' + project + '/static/js/config.js',
			findNestedDependencies: false,
			include: false,
			//exclude: ['router-config']
		}))
		.pipe(concat('start.js'))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(gulp.dest('./' + projectDist + '/static/js/'));
});

gulp.task('index', ['indexJs', 'cssmin'], function() {
	return gulp.src('./' + project + '/index.html')
		.pipe(htmlreplace({
			'css': './static/css/main.min.css?v={{ version }}',
			'js': {
				src: [
					['./static/js/require.min.js', './static/js/main.min.js?v={{ version }}']
				],
				tpl: '<script src="%s" data-main="%s"></script>'
			}
		}))
		.pipe(replace('{{ version }}', randomString(10)))
		.pipe(htmlmin({
			collapseWhitespace: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('./' + projectDist + '/'));
});


gulp.task('loginJs',['baseSet'],function() {
	var jsDst = './' + projectDist + '/static/js/',
		stream, name;
	name = 'login';
	stream = gulp.src('./' + project + '/static/js/**/*.js')
		.pipe(amdOptimize(name, {
			baseUrl: './' + project + '/static/js/',
			configFile: './' + project + '/static/js/config.js',
			findNestedDependencies: true,
			include: false,
			//exclude: ['common']
		}))
		.pipe(concat(name + '.js'))
		.pipe(gulp.dest(jsDst));
	return stream;
});
gulp.task('loginCssmin', function() {
	var name = 'login.min.css';
	gulp.src(['./' + project + '/static/css/base/bootstrap.css',
			'./' + project + '/static/css/base/sweetalert2.css',
			'./' + project + '/static/css/app.css',
			'./' + project + '/static/css/login.css'
		])
		.pipe(concat(name))
		.pipe(minifycss({
			keepSpecialComments: 0
		}))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(replace('../../', '../'))
		.pipe(gulp.dest('./' + projectDist + '/static/css/'))
});

gulp.task('loginCss', ['fontrev', 'loginCssmin'], function() {
	return gulp.src(['./' + project + '/static/rev/fonts/*.json', './' + projectDist + '/static/css/login.min.css'])
		.pipe(revCollector())
		.pipe(gulp.dest('./' + projectDist + '/static/css/'));
});

gulp.task('loginHtml', function() {
	gulp.src('./' + project + '/login.html')
		.pipe(htmlreplace({
			'css': './static/css/login.min.css?v={{ version }}',
			'js': {
				src: [
					['./static/js/require.min.js', './static/js/login.min.js?v={{ version }}']
				],
				tpl: '<script src="%s" data-main="%s"></script>'
			}
		}))
		.pipe(replace('{{ version }}', randomString(10)))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./' + projectDist + '/'));
});
gulp.task('loginBaseSet', ['loginJs'], function() {
	var stream, name;
	name = 'baseSet';
	stream = gulp.src('./' + project + '/static/js/libs/default/baseSet.js')
		.pipe(replace('window.location.origin+\'/\'','\''+postServer+':'+postPort+'/\''))
		.pipe(gulp.dest('./' + project + '/static/js/libs/default/'));
	return stream;
});
gulp.task('login', ['loginBaseSet', 'loginCssmin', 'loginHtml'], function() {
	var jsDst = './' + projectDist + '/static/js/',
		stream, name;
	name = 'login.min';
	stream = gulp.src(['./' + project + '/static/js/config.js', './' + projectDist + '/static/js/login.js'])
		.pipe(concat(name + '.js'))
		.pipe(uglify())
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(gulp.dest(jsDst));
	return stream;
});



function randomString(len) {　　
	len = len || 32;　　
	var $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';　　
	var maxPos = $chars.length;　　
	var pwd = '';　　
	for(i = 0; i < len; i++) {　　　　
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
	};　　
	return pwd;
};