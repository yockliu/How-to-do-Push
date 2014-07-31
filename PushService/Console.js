var assert = require("assert");

var Constants = require('./Constants');

var AVOSPush = require("./AVOSPush");
var avospush = new AVOSPush("jp2thdg0xv8c4war9b3rwyf0na6tttemwxnfh7qxkbspk7q8", "zz6d9hd9tu6hmjc1yorajw7uxz15y8immde1q9bifua05556");

var MiPush = require("./MiPush");

var mipush_android = new MiPush("+R/GzFaGeFVLpLPJQBIWTQ==", "android", "com.xisue.pushservicedemo");
mipush_android.usePublish();

var mipush_ios = new MiPush("BUWYK1IamQwjiM4dBZI9qg==", "ios");

// var msg = new AndroidMessage("node js and test", "content");
// mipush.sendSingleMessageByTopic(msg, "all");

// var msg_ios = new IosMessage("Push from MiPush");
// msg_ios.badge = 123;
// msg_ios.extra['content-available'] = 1;
// msg_ios.postContent();
// mipush_ios.sendSingleMessageByTopic(msg_ios, "all");

// var aliases = ["a", "b", "c"];
// mipush_ios.sendSingleMessageByAlias(msg_ios, aliases);

function mipushSend(pmessage) {
	if (pmessage.platform == Constants.PLATFORM.ALL || pmessage.platform == Constants.PLATFORM.ANDROID) {
		mipush_android.sendSingleMessage(pmessage);
	}
	if (pmessage.platform == Constants.PLATFORM.ALL || pmessage.platform == Constants.PLATFORM.IOS) {
		mipush_ios.sendSingleMessage(pmessage);
	}
}

function Console() {}

Console.prototype.sendPushMessageAllChannel = function(pmessage) {
	pmessage.service_channel = "All";
	pmessage.save(function(err) {
		if (err) {
			console.log("save message error");
			console.log(err);
		} else {
			console.log("save message success");
			
			mipushSend(pmessage);
			avospush.sendMessage(pmessage);
		}
	});
}

Console.prototype.sendPushMessageChannelMiPush = function(pmessage) {
	pmessage.service_channel = "MiPush";
	pmessage.save(function(err) {
		if (err) {
			console.log("save message error");
			console.log(err);
		} else {
			console.log("save message success");

			mipushSend(pmessage);
		}
	});
}

Console.prototype.sendPushMessageChannelAVOSPush = function(pmessage) {
	pmessage.service_channel = "AVOSPush";
	pmessage.save(function(err) {
		if (err) {
			console.log("save message error");
			console.log(err);
		} else {
			console.log("save message success");

			avospush.sendMessage(pmessage);
		}
	});
}

Console.prototype.sendPushMessageSingleRandomChannel = function(pmessage) {
	var random = Math.floor(Math.random() * 2);

	console.log("single random channel value = " + random);

	if (random == 0) {
		this.sendPushMessageChannelMiPush(pmessage);
	} else if (random == 1) {
		this.sendPushMessageChannelAVOSPush(pmessage);
	}
}	

module.exports = Console;
