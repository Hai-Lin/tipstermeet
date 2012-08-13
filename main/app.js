var events = require("events");
var TipsClient = require('../');
var product = require('../lib/product');
var tips = new TipsClient({
  	//key: '932a4e6f898648eca95ee2920fb99c2f',
  	//secret: '9dd49dc4c9ac4657a0a65605f2c27657',
  	key:'8ba43918d5b04a71aef489de9e2a88b0',
  	secret:'72400e24cca646e6bb56432e16a4ce62',
  	debug: true
});

var foreach = function(obj, func) {
	for(var i = 0; i < obj.length; i++) { 
		func(obj[i],i); // execute a function and make the obj, objIndex available
	}
};


function start(user_id, callback){

	var dp = new events.EventEmitter();
	////////EventEmitter's listeners definitions
	var count = 0;	
	// Processes an User's record
	dp.on("processRecord", function() {
		tips.user.following(user_id, offset,function(error, ret){
			if(error){
				console.log(error);
				return callback(error);
			}
			else{			
				foreach(ret.following, function(actor){
					hash[actor.id] = actor;
				});
				count = count + 500;
				if (count < ret.total) {
					offset = offset + 500; // limit on following list associated each call (500)
					dp.emit("processRecord");
				}
				else{
					dp.emit("exit");
				}
			}
		});	
	});

	// Exits the load-products script
	dp.on("exit", function(error) {
		if (error) {
			console.log(error);
			return callback(error);
		}
		else{
			processing(user_id, hash, callback);
		}
	});

//////////////////// Definitions over/////////////////////

	var offset = 0; 
		hash = {};
	
	// adding user to hash
	hash[user_id] = user_id;

	dp.emit("processRecord"); // Call for creation of hash using event emitters

};	
	
function processing(user_id, hash, callback){

var tipster_list = [],
	final_list = {},
	product_list = {}
	;

tips.user.tips(user_id, function(error, ret1){
	if(error) {
		console.log(error);
		return callback(error);
	}
	else{
		product_list = ret1.tips;
		foreach(ret1.tips, function(tip,i){
			product.tipsters(tip.head, function(error, ret2){
				if(error) {
					console.log(error);
				}
				else {
					tipster_list = [];
					foreach(ret2.tipped_by, function(actor1){							
						if(!hash[actor1.id]){
							tipster_list.push(actor1);
						}	
					});
					final_list[tip.head] = tipster_list;							
				}
				if(!ret1.tips[++i]) {
					return callback([final_list,product_list]);		
				}
			});

		});
	}					
});

};


exports.start = start;
exports.processing = processing;