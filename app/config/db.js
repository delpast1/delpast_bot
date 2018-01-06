var mongoose = require('mongoose');

mongoose.connect('mongodb://delpast1:123456@ds048368.mlab.com:48368/bittrex');

exports = module.exports = mongoose;