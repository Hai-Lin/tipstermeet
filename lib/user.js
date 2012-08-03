var request = require('request')
    User = module.exports = {}
    ;

User.info = function (username, cb) {
  if (!username) {
    throw new Error('Must supply username to user function');
  }
  var url = this.client.baseUrl + 'user/' + username;
  this.client.get(url, cb);
};

User.tips = function (username, cb) {
  if (!username) {
    throw new Error('Must supply username to user function');
  }
  var url = this.client.baseUrl + 'user/' + username + '/tips?limit=25';
  this.client.get(url, cb);
};

User.followers = function (username, offset, cb) {
  if (!username) {
    throw new Error('Must supply username to user function');
  }
var url = this.client.baseUrl + 'user/'+ username + '/followers?limit=500&offset=' + offset;
  this.client.get(url, cb);
};


User.follow = function (access_token, user, cb) {
  if (!access_token || !user) {
    throw new Error('Must supply access_token and username to user function');
  }
  var url = this.client.baseUrl + 'user/' + user + '/follow?access_token=' + access_token; //f0e3ef09-7624-43e7-84ca-359dee8943cd
  var data = {};
  this.client.post(url,data,cb);
};
