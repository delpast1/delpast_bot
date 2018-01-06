'use strict';

const Ticker = require('../models/ticker');
const axios = require('axios');
const bot = require('../config/bot');

var addTickers = (req, res) => {
    console.log('check');
    axios
        .get(`https://api.coinmarketcap.com/v1/ticker/?limit=1385`)
        .then(res => {
            const data = res.data;
            for(let i=0; i< data.length; i++) {
                var newTicker = new Ticker();
                newTicker.name = data[i].id;
                newTicker.ticker = data[i].symbol;
                newTicker.save();
            }

            return res.json('finish');
        })
        .catch(err => {
            return res.json(err);
        });
};

exports = module.exports = {
    addTickers: addTickers
}