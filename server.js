
var express = require('express'),
    http = require('http'),
    path = require('path'),
    reload = require('reload'),
    twitter = require('twitter'),
    routes = require('./routes'),
    apicache = require('apicache').options({
      debug:((process.env.APICACHE_DEBUG) && (process.env.APICACHE_DEBUG=='true'))?true:false,
      enabled:((process.env.APICACHE) && (process.env.APICACHE=='false'))?false:true
    }).middleware,
    favicon = require('favicon'),
    exphbs = require('express-handlebars'),
    morgan = require('morgan');



var app = module.exports = express();
var hbs = exphbs.create({
  layoutsDir: __dirname + "/views"
});

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/tweets/', routes.json, routes.tweets);

app.get('/user/', routes.json, routes.user);
app.get('/rate_limit_status', routes.json, routes.rate_limit_status);
app.get('/geo/reverse_geocode', routes.json, routes.reverse_geocode);

app.get('/', routes.index);

if(process.env.DEBUG == 'true') {
  console.log("DEBUG ENABLED");
  app.get('/session', function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.session));
  });
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Twitter proxy server listening on port: " + app.get('port'));
});