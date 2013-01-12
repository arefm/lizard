var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.on('open', function callback(){
	// console.log('connected!');
});

var mySchema = mongoose.Schema({
	name: String,
	surname: String
});

mySchema.methods.info = function(){
	var greeting = "Name: " + ((this.name)?this.name:"-");
	greeting += "\nSurname: " + ((this.surname)?this.surname:"-");
	console.log(greeting);
};

var user = mongoose.model('things', mySchema);
var newUser = new user({
	name: 'aref',
	surname: 'mirhoseini'
});

/*newUser.save(function(err, newUser){
	if(err) throw err;
	newUser.info();
});*/

user.find({name: newUser.name}, function(err, newUser){
	if(err) throw err;
	console.log(newUser);
});