'use strict';

const Telegraf = require('telegraf');
const token = '501566533:AAGhJkG9Bnep5uWiYlzsI0oYhmqgancAWgc';
const bot = new Telegraf(token);
const axios = require('axios');
const fs = require('fs');
const path = 'tickers.txt';
const stream = fs.createWriteStream('tickers.txt');


bot.command('/p', (ctx) => {
    // let text = ctx.update.message.text;
    // let ticker = text.slice(3);
    // console.log(ticker);
    axios
        .get(`https://api.coinmarketcap.com/v1/ticker/?limit=1385`)
        .then(res => {
            const data = res.data;
            let tickers = [];
            for(let i=0; i< data.length; i++) {
                tickers[data.symbol] = data.id;
            }
            fs.write(path, tickers, (err) => {
                if (err) console.error(err);
                console.log('Finish');
            });
        })
        .catch(err => {
            console.error(err);
        });
});
bot.startPolling();


