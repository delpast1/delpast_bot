'use strict';
var mongoose = require('../config/db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Ticker', new Schema({
        name: String,
        ticker: String
}));
