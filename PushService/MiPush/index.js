var https = require('https');
var querystring = require('querystring');
var assert = require('assert');

var Constants = require('../Constants');

var HOST_SANDBOX = "sandbox.xmpush.xiaomi.com";

var HOST_PUBLISH = "api.xmpush.xiaomi.com";

var PATH_BASE = "/v2";

var PATH_CMD_SINGLE_MSG = "/message";
var PATH_CMD_MULTI_MSG = "/multi_messages";

function MiPush(appKey, platform, packagename) {
	this.appKey = appKey;
	this.platform = platform;
	this.packagename = packagename;
	this.options = {
		method: "POST",
	};
	this.useSandbox();

	console.log(this.options);
	console.log(this.path_base);
}

MiPush.prototype.useSandbox = function() {
	this.options['host'] = HOST_SANDBOX;
}

MiPush.prototype.usePublish = function() {
	this.options['host'] = HOST_PUBLISH;
}

function customMiMessage(option, pmessage) {
	//var keys = Object.keys(this.extra);
	//console.log(keys);
	//if (keys && keys.length > 0) {
	//	for (var i=0; i<keys.length; i++) {
	//		var key = keys[i];
	//		console.log(key);
	//		var extrakey = 'extra.'+key;
	//		console.log(extrakey);
	//		console.log(this.extra[key]);
	//		option[extrakey] = this.extra[key];
	//	}
	//}
	option['extra.custom_id'] = pmessage.id;
}

function convertMessageToMiAndroid(pmessage) {
	var option = {
		notify_type : -1,
	};

	if (pmessage.title) {
		option['title'] = pmessage.title;
	}

	if (pmessage.content) {
		option['description'] = pmessage.content;
	}

	if (this.packagename) {
		option['restricted_package_name'] = this.packagename;
	}

	if (pmessage.silent) {
		//msg.extra.notify_foreground = 0;
		option['pass_through'] = 1;
		option['payload'] = {a:{b:"c"}};
	} else {
		//option['extra.notify_foreground'] = 1;
		option['pass_through'] = 0;
		
		if (pmessage.sound) {
			option['extra.sound_uri'] = pmessage.sound;
		}

		if (pmessage.badge) {
			option['extra.badge'] = pmessage.badge;
		}
	}
	customMiMessage(option, pmessage);

	return option;
}

function convertMessageToMiIOS(pmessage) {
	var option = {};

	if (pmessage.content)
		option['description'] = pmessage.content;
	
	if (pmessage.silent) {
		option['extra.content-available'] = 1;
	} else {
		if (pmessage.sound) {
			option['extra.sound_url'] = pmessage.sound;
		}

		if (pmessage.badge) {
			option['extra.badge'] = pmessage.badge;
		}
	}
	customMiMessage(option, pmessage);

	console.log("IosMessage postContent = ");
	console.log(option);

	return option;
}

MiPush.prototype.post = function(path, content, additionalQuery) {
	var httpsOptions = this.options;
	var query = querystring.stringify(content);
	// var post_data = JSON.stringify(content);

	assert.ok(path);
	assert.ok(content);
	assert.ok(this.appKey);

	var fullpath = path + "?" + query;
	if (additionalQuery) {
		fullpath += "&" + additionalQuery;
	}
	httpsOptions['path'] = fullpath;
	httpsOptions['headers'] = {
		'content-length' : 0,
		Authorization: "key="+this.appKey,
	};

	console.log("request===========================");
	console.log(httpsOptions);
	console.log("---------------------------");

	var req = https.request(httpsOptions, function(res) {
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		res.on('data', function(d) {
			process.stdout.write(d);
		});
	});

	req.end();

	req.on('error', function(err) {
		console.error(err);
	});
}

MiPush.prototype.sendSingleMessageByRegid = function(pmessage, regid) {
	var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/regid";

	if (this.platform == 'android') {
		var content = convertMessageToMiAndroid(pmessage);
	} else if (this.platform == 'ios') {
		var content = convertMessageToMiIOS(pmessage);
	} else {
		return;
	}
	content['regid'] = regid;

	this.post(path, content);
}

MiPush.prototype.sendSingleMessageByAlias = function(pmessage, aliases) {
	var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/alias";

	if (this.platform == 'android') {
		var content = convertMessageToMiAndroid(pmessage);
	} else if (this.platform == 'ios') {
		var content = convertMessageToMiIOS(pmessage);
	} else {
		return;
	}
	var additionalQuery = ""; 
	if (aliases.length > 0) {
		for (var i=0; i<aliases.length; i++) {
			var analias = "alias="+encodeURIComponent(aliases[i]);
			additionalQuery += analias;
			if (i != aliases.length-1)
				additionalQuery += "&";
		}
	}
//	var query = querystring.stringify(additionalQuery);
	console.log(additionalQuery);

	this.post(path, content, additionalQuery);
}

MiPush.prototype.sendSingleMessageByTopic = function(pmessage, topic) {
	var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/topic";

	if (this.platform == 'android') {
		var content = convertMessageToMiAndroid(pmessage);
	} else if (this.platform == 'ios') {
		var content = convertMessageToMiIOS(pmessage);
	} else {
		return;
	}
	content['topic'] = topic;

	this.post(path, content);
}

MiPush.prototype.sendSingleMessage = function(pmessage) {
	if (this.platform == 'android') {
		var content = convertMessageToMiAndroid(pmessage);
	} else if (this.platform == 'ios') {
		var content = convertMessageToMiIOS(pmessage);
	} else {
		return;
	}
	if (pmessage.target_type == Constants.TARGET_TYPE.ALL) {
		var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/topic";
		content['topic'] = "all";
	}
	else if (pmessage.target_type == Constants.TARGET_TYPE.TAG) {
		var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/topic";
		content['topic'] = pmessage.target_name;
	} else if (pmessage.target_type == Constants.TARGET_TYPE.SINGLE_ID) {
		var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/regid";
		content['regid'] = pmessage.target_name;
	} else if (pmessage.target_type == Constants.TARGET_TYPE.SINGLE_ALIAS) {
		var path = PATH_BASE + PATH_CMD_SINGLE_MSG + "/alias";
		content['alias'] = pmessage.target_name;
	}
	this.post(path, content);
}


// 暂未实现
MiPush.prototype.sendMultiMessageByRegid = function(targetMessages) {
	var path = PATH_BASE + PATH_CMD_MULTI_MSG + "/regids";

	var content = "";

	this.post(path, content);
}

// 暂未实现
MiPush.prototype.sendMultiMessageByAlias = function(targetMessages) {
	var path = PATH_BASE + PATH_CMD_MULTI_MSG + "/aliases";

	var content = "";

	this.post(path, content);
}

module.exports = MiPush;
