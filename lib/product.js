var Product = module.exports = {};

Product.tipsters = function (id, cb) {
  if (!id) {
    throw new Error('Must supply ID to product function');
  }
  var url = this.client.baseUrl + 'product/' + id + '/tipped-by?limit=25';
  this.client.get(url, cb);
};
