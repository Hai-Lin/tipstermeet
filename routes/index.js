
/*
 * GET home page.
 */


var main = require('../main/app');

exports.index = function(req, res){
main.start(function(result){res.render('index', { title: 'Express', tips: result });});
};
