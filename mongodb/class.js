require('mootools');
var mongoose = require('mongoose');

var mongo = new Class({
	initialize: function(configs){
		mongoose.connect('mongodb://' + configs.host + '/' + configs.db);
		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		this.collection = configs.collection;
	},
	_model: function(schema){
		var schema = (schema)?(mongoose.Schema(schema)):(mongoose.Schema());
		var model = mongoose.model(this.collection, schema);
		this.model = model;
	},
	show: function(cb){
		this._model(false);
		(this.model).find(function(err, data){
			if(err) throw err;
			data = (data.length > 0)?data:"not found any records";
			cb(data);
		});
	},
	insert: function(data, cb){
		var obj = {};
		for(key in data){
			if(key != 'schema'){
				obj[key] = data[key]
			}
		}
		var newRecord = new this.model(obj);
		newRecord.save(function(err, newRecord){
			if(err) throw err;
			cb(true);
		});
	},
	find: function(data, cb){
		//
	}
});

module.exports = mongo;