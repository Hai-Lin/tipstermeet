var TipsClient = require('../');
var product = require('../lib/product');
var tips = new TipsClient({
  key: '932a4e6f898648eca95ee2920fb99c2f',
  secret: '9dd49dc4c9ac4657a0a65605f2c27657',
  debug: true
});

var foreach = function(obj, func) {
	for(var i = 0; i < obj.length; i++) { 
		func(obj[i]); // execute a function and make the obj, objIndex available
	}
}

var user_id = '4f84a219b04953bc34000220';

tips.user.followers(user_id, function(error, ret){
	if(error){
		console.log(error);
	}
	else{
		var hash = {};
		foreach(ret.followers, function(actor){
			hash[actor.head] = actor;
		});
		
		tips.user.tips(user_id, function(error, ret1){
			if(error) {
				console.log(error);
			}
			else {
				var product_list = ret1.tips;
				foreach(ret1.tips, function(tip){
					product.tipsters(tip.head, function(error, ret2){
						if(error) {
							console.log(error);
						}
						else {
							var tipster_list = [];
							foreach(ret2.tipped_by, function(actor1){							
								if(!hash[actor1.head]){
									tipster_list.push(actor1);
								}	
							});
							return( product_list,tip,tipster_list);
						}
					}); 
					
				});
				
			}
		});
	}
});