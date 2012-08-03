function start(callback){

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
	}

	var user_id = '4f84a219b04953bc34000220';

	tips.user.followers(user_id, function(error, ret){
		if(error){
			console.log(error);
		}
		else{
			var hash = {},
				tipster_list = [],
				final_list = {},
				product_list = {}
			;

			tips.user.info('Ashwath', function(error, ret){
				hash[ret.head] = ret;
			});

			foreach(ret.followers, function(actor){
				hash[actor.head] = actor;
			});
		
			tips.user.tips('Ashwath', function(error, ret1){
				if(error) {
					console.log(error);
				}
				else {
					product_list = ret1.tips;
					foreach(ret1.tips, function(tip,i){
						product.tipsters(tip.head, function(error, ret2){
							if(error) {
								console.log(error);
							}
							else {
								tipster_list = [];
								foreach(ret2.tipped_by, function(actor1){							
									if(!hash[actor1.head]){
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
		}
	});

}

function follow(access_token, user_id, callback){
	var TipsClient = require('../');
	var product = require('../lib/product');
	var tips = new TipsClient({
  		//key: '932a4e6f898648eca95ee2920fb99c2f',
  		//secret: '9dd49dc4c9ac4657a0a65605f2c27657',
  		key:'8ba43918d5b04a71aef489de9e2a88b0',
  		secret:'72400e24cca646e6bb56432e16a4ce62',
  		debug: true
	});

	tips.user.follow(access_token, user_id, callback);
}

exports.follow = follow;

exports.start= start;
