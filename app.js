
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , port = process.env.PORT || 3000
  , dbm = require('./node_modules/bdc_db_mgr/dbm')
  , _ = require('underscore');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false })
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('howcandevonlyonehandt'));
  app.use(express.session({secret: 'buthowcandevonlyonehand'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

function authenticate(req, res, next) {
  if (req.session.loggedIn !== "yes" && req.path !== "/") {
    res.redirect("/");
    return;
  }
  next();
};

app.get('/', routes.index);

app.get('/charts', authenticate, function(req, res, next) {
  dbm.collection.find({email: req.session.user}).toArray(function(err, results) {
    req.charts = (results[0] && results[0].charts && results[0].charts.length) ? results[0].charts : [{name: 'No charts yet, add one now.'}];
    routes.charts(req, res);
  });
});

app.get('/chart/delete/:id', authenticate, function(req, res, next) {
  dbm.collection.find({email: req.session.user}).toArray(function(err, results) {
    results[0].charts = _.reject(results[0].charts, function(i) { return i.id == req.params.id; });
    dbm.collection.save(results[0], function(err, docs) {
      res.redirect('/charts');
    });
  });
});

app.post('/chart/new', authenticate, function(req, res, next) {
  dbm.collection.find({email: req.session.user}).toArray(function(err, results) {
    var chart = {};
    chart.name = req.body.name.replace(/(<([^>]+)>)/ig,"");
    chart.id = (results[0] && results[0].charts && results[0].charts.length) ? results[0].charts.length + 1 : 1;
    chart.series = [];
    charts = (results[0] && results[0].charts && results[0].charts.length) ? results[0].charts : [];
    charts.push(chart);
    results[0].charts = charts;
    dbm.collection.save(results[0], function(err, docs) {
      res.end(JSON.stringify(chart));
    });
  });
});

app.post('/users/login', function(req, res, next) {
  dbm.collection.find({email: req.body.u}).toArray(function(err, results) {
    if (err || results.length <= 0 || results[0].password !== req.body.p) { res.end(JSON.stringify({status: 'Invalid username or password'})); return; }
    req.session.loggedIn = 'yes';
    req.session.user = req.body.u;
    res.end(JSON.stringify({status: 'success'}));
  });
});

app.get('/users/logout', function(req, res, next) {
  delete req.session.loggedIn;
  delete req.session.user;
  res.redirect('/');
});

app.post('/users/new', function(req, res, next) {
  dbm.collection.find({email: req.body.u}).toArray(function(err, results) {
    if (!err && results.length > 0) res.end(JSON.stringify({status: 'Sorry, looks like that email address is already registered.'}));
    else dbm.collection.insert({email: req.body.u, password: req.body.p}, function(err, docs) {
      var response = (err) ? {status: err} : {status: 'success'};
      res.end(JSON.stringify(response));
    });
  });
});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
