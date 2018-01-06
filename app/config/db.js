var mongoose = require('mongoose');

mongoose.connect('mongodb://delpast1:123456@ds143907.mlab.com:43907/coinmarketcap');

exports = module.exports = mongoose;