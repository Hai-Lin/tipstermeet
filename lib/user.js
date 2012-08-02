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
  var url = this.client.baseUrl + 'user/' + username + '/tips?limit=50';
  this.client.get(url, cb);
};

User.followers = function (username, cb) {
  if (!username) {
    throw new Error('Must supply username to user function');
  }
  var url = this.client.baseUrl + 'user/'+ username + '/followers?limit=500';
  this.client.get(url, cb);
};

User.following = function (username, cb) {
  if (!username) {
    throw new Error('Must supply username to user function');
  }
  var url = this.client.baseUrl + 'user/' + username + '/following';
  this.client.get(url, cb);
};

User.follow = function (origin, target, cb) {
  if (!origin || !target) {
    throw new Error('Must supply origin and target to user function');
  }
  var url = this.client.baseUrl + 'user/' + target + '/follow?acces_token=' + origin; //f0e3ef09-7624-43e7-84ca-359dee8943cd
  var data = {};
  this.client.post(url, data, cb);
};

User.unfollow = function (origin, target, cb) {
  if (!origin || !target) {
    throw new Error('Must supply origin and target to user function');
  }
  // TODO
  throw new Error('Not implemented');
};

