
/*
 * GET home page.
 */
var ash = require('../main/app')
exports.index = function(req, res){
ash.start(function(result){res.render('index', { title: 'Express', tips: result });});
};
