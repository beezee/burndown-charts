
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Burndown Charts' })
};

exports.charts = function(req, res){
  res.render('charts', { title: 'Your Charts', charts: req.charts});
}