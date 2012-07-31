var TipsClient = require('../');
var product = require('../lib/product');
var tips = new TipsClient({
  key: '932a4e6f898648eca95ee2920fb99c2f',
  secret: '9dd49dc4c9ac4657a0a65605f2c27657',
  debug: true
});

var foreach = function(obj, func) {
	for(var i = 2; i < obj.length; i++) { 
		func(obj[i], i); // execute a function and make the obj, objIndex available
	}
}


tips.user.tips('Ashwath', function(error, tips){
	if(error) {
		console.log(error);
	}
	else {
		foreach(tips, function(tip){
			product.tipsters(tip.id, console.log);
		});
	}

});
