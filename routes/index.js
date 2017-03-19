var twitter = require('twitter');
var util = require('util');
var twitterConfig = JSON.parse(process.env.TWITTER);
var twit = new twitter({
    consumer_key: twitterConfig.consumer_key,
    consumer_secret: twitterConfig.consumer_secret,
    access_token_key: twitterConfig.access_token_key,
    access_token_secret: twitterConfig.access_token_secret
});

exports.index = function(req, res){
  var data = {
    title:"Cooper Union Twitter Proxy",
    description:"Cooper Union Twitter Proxy",
    examples:[{
      url:"/tweets/?q=cooper%20union",
      title:"Search for the words 'cooper union'"
    },
    {          
      url:"/tweets/?q=cooper%20union&since_id=542080665177841660",
      title:"Search for the words 'cooper union', but only return tweets after the tweet id of 542080665177841660"
    },
    {
      url:"/user/?screen_name=everyplace",
      title:"Search for the user 'everyplace'"
    },
    {
      url:"/geo/reverse_geocode?lat=37.7821120598956&long=-122.400612831116",
      title:"Take a latitute and longitude pair, and find the place associated with it"
    },   
    {
      url:"/rate_limit_status",
      title:"Check your current rate_limit_status"
    }]
  };
  res.render('template', data);
};

exports.json = function(req, res, next){
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*'
  });
  next();
};

exports.tweets = function(req, res) {
  
    twit.get('search/tweets', req.query, function(err, response) {
      // console.log(util.inspect(data), res.statusCode);
        // console.log(data, res);
        res.end(JSON.stringify(response));
    });
};

exports.user = function(req, res) {

    twit.get('/users/lookup.json', req.query, function(err, response) {
        // console.log(util.inspect(data), res.statusCode);
        // console.log(data, res);
        res.end(JSON.stringify(response));
    });

};

exports.rate_limit_status = function(req, res) {

  twit.get('/application/rate_limit_status.json', function(err, response) {
    // console.log(util.inspect(data), res.statusCode);
    // console.log(data, res);
    res.end(JSON.stringify(response));
  });

};

exports.reverse_geocode = function(req, res) {

  if(req.query.lat && req.query.long) {

    // var options = {
    //   lat: req.query.lat,
    //   long: req.query.long
    // }

    twit.get('/geo/reverse_geocode.json', req.query, function(err, response) {
      // console.log(util.inspect(data), res.statusCode);
      // console.log(data, res);
      res.end(JSON.stringify(response));
    });

  } else {
    var message = {error:'lat and long are required parameters'};
    console.log(message);
    res.end(JSON.stringify(message));
  }

};