require('mootools');
var request = require('request');
var mongo = require('./mongodb/class.js');

var dbConfigs = {
	host: 'localhost',
	db: 'mydb',
	collection: 'nerkhdoon'
};
var db = new mongo(dbConfigs);

var nerkhdoonApi = new Class({
	initialize: function(configs){
		var https = (configs.https)?"https":"http";
		this.uri = https + "://" + configs.host + configs.path + configs.section;
	},
	getData: function(callback){
		request({uri: this.uri}, function(err, response, body){
			if(err || response.statusCode != 200){
				callback("Error: " + err.message);
			} else {
				var prepare = (this.obj).prepareData(body);
				callback(prepare);
			}
		}.bind({obj:this}));
	},
	prepareData: function(data){
		data = JSON.parse(data);
		result = [];
		result['schema'] = {
					_id: Number,
					uname: String,
					title: String,
					tags: Array,
					price: Number
		};
		for(var i=0; i<data.length; i++){
			result.push({
				_id: (i + 1),
				uname: data[i].uname,
				title: data[i].title,
				tags: data[i].tags,
				price: (data[i].prices.price)?data[i].prices.price.original:0
			});
		}
		return result;
	},
	saveData: function(data){
		db._model(data['schema']);
		var result = 0;
		for(var i=0; i<data.length; i++){
			db.insert(data[i], function(cb){
				if(cb){
					console.log(result);
					result++;
				}
			});
		}
		// return result;
	}
});

var configs = {
	https: false,
	host: "api.nerkhdoon.com",
	path: "/rest/pedram/json/products/",
	section: "tag/giftcard"
}
var api = new nerkhdoonApi(configs);
api.getData(function(data){
	api.saveData(data);
});


