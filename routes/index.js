
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Burndown Charts' })
};

exports.index = function(req, res){
  res.render('charts', { title: 'Your Charts'});
}