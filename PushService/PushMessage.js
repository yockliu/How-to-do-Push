var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var IdGenerator = new mongoose.Schema({
	modelname	: String,
	currentid	: {
					type	: Number,
					default	: 1,
				  },
});
mongoose.model('IdGenerator', IdGenerator);
var idg = mongoose.model('IdGenerator');
idg.getNewID = function(modelName, callback) {
	this.findOne({modelname : modelName}, function(err, doc) {
		if (doc) {
			doc.currentid += 1;
		} else {
			doc = new idg();
			doc.modelname = modelName;
		}
		doc.save(function(err) {
			if (err)
				throw err("IdGenerator.getNewID.save() error");
			else
				callback(parseInt(doc.currentid.toString()));
		});
	});
}

var PushMessageSchema = new mongoose.Schema({
	id              : {type   : Number, default     : 1},
	platform        : String,
	content         : String,
	title           : {type   : String,		default : null},
	uri             : {type   : String,		default : null},
	sound           : {type   : String,		default : null},
	badge           : {type   : Number,		default : 0},
	silent          : {type   : Boolean,	default : false},
	target_type     : {type   : String,		default : null},
	target_name     : {type   : String,		default : null},
	service_channel : {type   : String,		default : null},
	custom			: mongoose.Schema.Types.Mixed,
});
PushMessageSchema.pre('save', function(next, done) {
	var pmessage = this;
	idg.getNewID('PushMessage', function(newid) {
		if (newid) {
			pmessage.id = newid;
			next();
		} else {
			done();
		}
	});
});
mongoose.model('PushMessage', PushMessageSchema);
var PushMessage = mongoose.model('PushMessage');

module.exports = PushMessage;
