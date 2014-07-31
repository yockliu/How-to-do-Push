var https = require('https');
var querystring = require('querystring');
var assert = require('assert');
var Constants = require('../Constants');

var HOST = "cn.avoscloud.com";
var PATH = "/1/push";

function AVOSPush(app_id, app_key) {
	this.app_id = app_id;
	this.app_key = app_key;
}

AVOSPush.prototype.sendMessage = function(pushMessage) {
	var httpsOptions = {
		method                            : "POST",
		host                              : HOST,
		path                              : PATH,
		headers                           : {
			"X-AVOSCloud-Application-Id"  : this.app_id,
			"X-AVOSCloud-Application-Key" : this.app_key,
			"Content-Type"                : "application/json",
		}
	};

	var content = {
		data : {}
	};

	if (pushMessage.silent) {
		content.data['content-available'] = 1;
		content.data['action'] = "com.avos.UPDATE_STATUS";
	} else {
		if (pushMessage.content) {
			content.data['alert'] = pushMessage.content;
		}
		if (pushMessage.title) {
			content.data['title'] = pushMessage.title;
		}
		if (pushMessage.sound) {
			content.data['sound'] = pushMessage.sound;
		}
		if (pushMessage.badge) {
			content.data['badge'] = pushMessage.badge;
		}
	}

	var channels = [];
	if (pushMessage.target_type == Constants.TARGET_TYPE.TAG) {
		channels[channles.length] = pushMessage.target_name;
	}

	if (pushMessage.platform == Constants.PLATFORM.ANDROID || pushMessage.platform == Constants.PLATFORM.IOS) {
		content['where'] = {};
		content.where['deviceType'] = pushMessage.platform;
	}

	if (channels.length > 0) {
		content['channels'] = channels;
	}

	if (pushMessage.custom) {
		content.data['custom'] = pushMessage.custom;
	} else {
		content.data['custom'] = {};
	}
	content.data.custom['id'] = pushMessage.id;

	var post_content = JSON.stringify(content);
	console.log(post_content);

	var req = https.request(httpsOptions, function(res) {
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);

		res.on('data', function(d) {
			process.stdout.write(d);
		});
	});

	req.write(post_content);

	req.end();

	req.on('error', function(err) {
		console.error(err);
	});
}

module.exports = AVOSPush;
