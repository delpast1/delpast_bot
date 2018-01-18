'use strict';

const Telegraf = require('telegraf');
const token = '501566533:AAGhJkG9Bnep5uWiYlzsI0oYhmqgancAWgc';
const bot = new Telegraf(token);
const axios = require('axios');
const Ticker = require('./models/ticker');

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3
});

const numberFomatter = new Intl.NumberFormat('en-US', {
    style: 'decimal'
});


bot.startPolling();

Ticker.findOne({'ticker': 'LEND'}, (err, result) => {
    if (err) {
        ctx.reply('DB error!');
    }

    if (result) {
        axios
            .get(`https://api.coinmarketcap.com/v1/ticker/`+result.name+`/`)
            .then(res => {
                
                const altcoin = res.data[0];

                axios
                    .get(`https://api.coinmarketcap.com/v1/ticker/ethereum/`)
                    .then(res => {
                        const eth = res.data[0];

                        //tính giá cũ của ETH
                        var changeETH = Number(eth.percent_change_24h);
                        var currentETH = Number(eth.price_btc);
                        var oldETH = currentETH/(1+changeETH/100);

                        //tính giá cũ của altcoin
                        var changeAlt = Number(altcoin.percent_change_24h);
                        var currentAlt = Number(altcoin.price_btc);
                        var oldAlt = currentAlt/(1+changeAlt/100);

                        //giá cũ của altcoin theo ETH
                        var oldAltETH = oldAlt/oldETH;

                        //giá mới của altcoin theo ETH
                        var currentAltETH = currentAlt/currentETH;

                        //change 24h của altcoin theo ETH
                        var changeETH = (currentAltETH - oldAltETH)*100/oldAltETH;
                        
                        console.log(eth);
                        console.log(changeETH);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                // ctx.reply('Không tìm thấy trên CMC!');
                console.log(err);
            });
    } else {
        // ctx.reply('Không tìm thấy trong DB!');
        console.log('error 3');
    }
});

