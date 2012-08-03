/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , OAuth = require("oauth").OAuth
  , url = require("url")
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// tos_oauth 
var tos_request_token_url = "https://tips.by/oauth/request_token?oauth_callback=" + encodeURIComponent("http://localhost:3000/try_authorize"),
    tos_access_token_url = "https://tips.by/oauth/access_token",
    tos_api_key = '8ba43918d5b04a71aef489de9e2a88b0',
    tos_api_secret = '72400e24cca646e6bb56432e16a4ce62',
    tos_oauth = new OAuth(tos_request_token_url, tos_access_token_url, tos_api_key, tos_api_secret, "1.0", null, "HMAC-SHA1")
    ;
var session = { "me": {"rt": "", "rts": "", "at": "", "ats": "", "tos_user_id": "", "tos_user_name": ""} };    

// HANDLERS
app.get(/^\/try_authorize/, function(request, response, next){
        if (!request.query.oauth_verifier) {
          return response.send("denied_authorization");
        };
        console.log('asking for authorization');
        var parsed_url = url.parse(request.url, true);
         
        tos_oauth.getOAuthAccessToken(session.me.rt, session.me.rts, parsed_url.query.oauth_verifier, function(error, access_token, access_token_secret, additional_data) {
          session.me.tos_user_id = additional_data.user_id;
          session.me.tos_user_name = additional_data.user_name;
          session.me.at = access_token;
          session.me.ats = access_token_secret;
          response.writeHead(302, {"location": "http://localhost:3000/gameon"});
          response.end();
        });
  });

//get access token then redirects to /gameon
app.get('/', function(request, response){
  if (!session.me.at) {
        tos_oauth.getOAuthRequestToken(function(error, request_token, request_secret) {
          if (error) {
                return next(error);
          };

          session.me.rt = request_token;
          session.me.rts = request_secret;
          response.statusCode = 302;
          response.setHeader("location", "https://tips.by/oauth/authorize?oauth_token=" + request_token);
          return response.end();
        });
    }
  else{
    response.redirect("http://localhost:3000/gameon", 302);
  }
});


// follow 
app.get('/follow/:id', function(request, response, next){
   if (!session.me.at) {
        tos_oauth.getOAuthRequestToken(function(error, request_token, request_secret) {
          if (error) {
                return next(error);
          };

          session.me.rt = request_token;
          session.me.rts = request_secret;
          response.statusCode = 302;
          response.setHeader("location", "https://tips.by/oauth/authorize?oauth_token=" + request_token);
          return response.end();
        });
    }
    else {
		console.log(request.params.id);
      tos_oauth.post("https://tips.by/api/1.0/user/"+ request.params.id + "/follow?access_token=" + session.me.at, session.me.at, session.me.ats, "{}", "application/json", function(error, response) {
        if (error) {
          response.send("Unable to follow");  
          }
      });
    }
});

// starts game
app.get('/gameon', function(request, response, next){
   if (!session.me.at) {
        tos_oauth.getOAuthRequestToken(function(error, request_token, request_secret) {
          if (error) {
                return next(error);
          }
          session.me.rt = request_token;
          session.me.rts = request_secret;
          response.statusCode = 302;
          response.setHeader("location", "https://tips.by/oauth/authorize?oauth_token=" + request_token);
          return response.end();
        });
    }
    else {
        var main = require('./main/app');
        main.start(session.me.tos_user_id, function(result){
           response.render('index',{ title: 'Express', tips: result });
         });
    }
});


// Server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
