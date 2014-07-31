var Console = require('./Console');
var console = new Console();

var PushMessage = require('./PushMessage');
var Constants = require('./Constants');

var pmsg = new PushMessage({
	platform	: Constants.PLATFORM.ALL,
	target_type	: Constants.TARGET_TYPE.ALL,
	content		: "this is a push message content",
	title		: "this is a push message title",
});

pmsg.silent = true;
pmsg.custom = {type:"message_arrive"};

console.sendPushMessageAllChannel(pmsg);
//console.sendPushMessageSingleRandomChannel(pmsg);
//console.sendPushMessageChannelMiPush(pmsg);
//console.sendPushMessageChannelAVOSPush(pmsg);
