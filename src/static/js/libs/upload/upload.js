/*
 * 使用之前：
 * 接入 plupload 及 jquery 文件库
 *
 *
 * 使用方法：
 * 1. 将此 js 文件中的 oss.apiUrl 值设定为获取签名的 api 地址;
 * 2. 在原页面定义oss对象后，调用oss.init([obj1, obj2, ...])方法，其中：
 * browserBtn，必填，触发文件选择元素的 html DOM 对象
 * container，必填，browserBtn的包含容器(父元素)，多个plupload对象以此作为区分
 * success_fn，必填，上传成功后的回调函数
 * fileType，选填，默认为picture图片类型
 * uploading_fn，选填，上传过程中的回调函数，返回值为上传进度百分比
 * picPrefix，选填，为上传的文件设定前缀
 * dir，选填，将文件传到相应的目录下，不存在时默认创建
 *
 *
 * 关于html：
 * 可将页面任意元素作为文件上传的触发按钮，只需将这个 DOM 元素正确传入即可
 *
 *
 * 使用样例：
 * var $container = $('#container');
 * var obj = {};
 * obj.container = $container[0];
 * obj.browserBtn = $container.find('button')[0];
 * obj.dir = 'test/newdir';
 * obj.prefix = 'test_myprefix_';
 * obj.fileType = 'picture';
 * obj.uploading_fn = function (per) {
 *     console.log(per + '%');
 * }
 * obj.success_fn = function (data) {
 *     console.log('Finished');
 * }
 * oss.init([obj]);
 */
define(['baseSet','plupload','jquery'], function(baseSet) {
	var oss = {};
	oss.apiUrl = baseSet.postServer + '/api/v2/common/upFile';
	oss.host = '';
	oss.policyBase64 = '';
	oss.accessid = '';
	oss.signature = '';
	oss.expire = 0;
	oss.g_object_name = '';
	oss.g_object_name_type = 'random_name'; // 可选类型为 local_name 或 random_name

	oss.init = function(objArr) {
		if(objArr.length) {
			objArr.forEach(function(item) {
				var container = item.container;
				var browserBtn = item.browserBtn;
				var fileType = item.fileType ? item.fileType : '';
				var beforeUpload = item.beforeUpload_fn;
				var uploading = item.uploading_fn;
				var success = item.success_fn;
				var ossItem = {};
				ossItem.key = item.prefix ? item.prefix : '';
				ossItem.dir = item.dir ? item.dir + '/' : '';

				var uploader = new plupload.Uploader({
					runtimes: 'html5,flash,silverlight,html4',
					browse_button: browserBtn,
					container: container,
					flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
					silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
					url: 'http://oss.aliyuncs.com',

					filters: set_upload_filter(fileType),

					init: {
						PostInit: function() {
							$(container).find('input').on('change', function() {
								set_upload_param(uploader, '', false, ossItem);
								return false;
							})
						},

						BeforeUpload: function(up, file) {
							g_object_name = oss.g_object_name;
							g_object_name_type = oss.g_object_name_type;
							set_upload_param(up, file.name, true, ossItem);
							beforeUpload();
						},

						UploadProgress: function(up, file) { //上传中，显示进度条
							if(uploading) {
								var percent = file.percent;
								uploading(percent);
							}
						},

						FileUploaded: function(up, file, info) {
							if(info.status == 200) {
								oss.data = {};
								oss.data.fileName = file.name;
								oss.data.fileUrl = oss.host + '/' + ossItem.dir + get_uploaded_object_name(file.name)
								success(oss.data);
							} else {
								console.log(info.response);
							}
						},

						Error: function(up, err) {
							if(err.code == -600) {
								alert("\n文件大小超过限制！");
							} else if(err.code == -601) {
								alert("\n文件类型错误！");
							} else if(err.code == -602) {
								alert("\n这个文件已经上传过一遍了！");
							} else {
								console.log("\nError xml:" + err.response);
							}
							item.error_fn();
						}
					}
				});
				uploader.init();
			});
		}
	};
	oss.ajax = function(params) {
		var defaults = {
			url: params.url,
			type: params.type ? params.type : "post",
			contentType: false,
			processData: false,
			"Content-Type": "multipart/form-data"
		};

		for(var key in defaults) {
			params[key] = defaults[key];
		}
		var _successFn = params.success;
		params.success = function(result, status, xhr) {
			if(false) {

			}
			_successFn(result, status, xhr)
		}
		if(typeof params.error !== "function") {
			params.error = function(err) {
				console.log(err);
			}
		}

		$.ajax(params);
	};

	function send_request() {
		var xmlhttp = null;
		if(window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		if(xmlhttp != null) {
			var data = null;
			oss.ajax({
				url: oss.apiUrl,
				success: function(res) {
					data = res.data;
				},
				async: false
			});
			return data;
		} else {
			alert("Your browser does not support XMLHTTP.");
		}
	};

	function get_signature() {
		//可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
		var now = timestamp = Date.parse(new Date()) / 1000;
		if(oss.expire < now + 3) {
			var obj = send_request();
			oss.host = obj.host;
			oss.policyBase64 = obj.policy
			oss.accessid = obj.accessid
			oss.signature = obj.signature
			oss.expire = parseInt(obj.expire)
			return true;
		}
		return false;
	};

	function random_string(len) {　　
		len = len || 32;　　
		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
		var maxPos = chars.length;　　
		var pwd = '';　　
		for(i = 0; i < len; i++) {　　
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		pwd += new Date().getTime();
		return pwd;
	}

	function get_suffix(filename) {
		pos = filename.lastIndexOf('.')
		suffix = ''
		if(pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix;
	}

	function calculate_object_name(filename, ossItem) {
		if(g_object_name_type == 'local_name') {
			g_object_name += "${filename}"
		} else if(g_object_name_type == 'random_name') {
			suffix = get_suffix(filename)
			g_object_name = ossItem.key + random_string(10) + suffix
		}
		return ''
	}

	function get_uploaded_object_name(filename) {
		if(g_object_name_type == 'local_name') {
			tmp_name = g_object_name
			tmp_name = tmp_name.replace("${filename}", filename);
			return tmp_name
		} else if(g_object_name_type == 'random_name') {
			return g_object_name
		}
	}

	function set_upload_param(up, filename, ret, ossItem) {
		if(ret == false) {
			ret = get_signature()
		}
		g_object_name = ossItem.key;
		if(filename != '') {
			suffix = get_suffix(filename)
			calculate_object_name(filename, ossItem);
		}
		new_multipart_params = {
			'key': ossItem.dir + g_object_name,
			'policy': oss.policyBase64,
			'OSSAccessKeyId': oss.accessid,
			'success_action_status': '200', //让服务端返回200,不然，默认会返回204
			'signature': oss.signature,
		};

		up.setOption({
			'url': oss.host,
			'multipart_params': new_multipart_params
		});

		up.start();
	}

	function set_upload_filter(fileType) {
		var filters = {
			mime_types: [],
			prevent_duplicates: false   
		};

		var picture = {
			title: 'Image files',
			extensions: 'jpg,gif,png,bmp',
		};
		var video = {
			title: 'files',
			extensions: 'mp4',
		};

		var type = fileType ? fileType : 'picture';
		switch(type) {
			case 'picture':
				filters.mime_types.push(picture);
				filters.max_file_size = '10mb';
				break;
			case 'video':
				filters.mime_types.push(video);
				filters.max_file_size = '2gb';
				break;
			default:
				console.log('Wrong file type.')
				return;
		}
		return filters;
	};
	return oss;
});