function start(user_id, callback){

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

	tips.user.following(user_id, 0,function(error, ret){
		if(error){
			console.log(error);
		}
		else{
			var hash = {},
				tipster_list = [],
				final_list = {},
				product_list = {}
			;

			tips.user.followers(user_id, 500, function(error, ret_500){
				if(error){
					console.log(error);
				}
				else{
					foreach(ret.followers, function(actor){
						hash[actor.id] = actor;
					});

					foreach(ret_500.followers, function(actor_500){
						hash[actor_500.id] = actor_500;
					});
					// adding user to hash
					hash[user_id] = user_id;				
				}
			});	
	
			tips.user.tips(user_id, function(error, ret1){
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
		}
	});

}


exports.start= start;
