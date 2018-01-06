'use strict';

const Telegraf = require('telegraf');
const token = '501566533:AAGhJkG9Bnep5uWiYlzsI0oYhmqgancAWgc';
const bot = new Telegraf(token);
const axios = require('axios');
const Ticker = require('./models/ticker');



bot.command('/info', (ctx) => {
    let text = ctx.update.message.text;
    let ticker = (text.slice(6)).toUpperCase();

    Ticker.findOne({'ticker': ticker}, (err, result) => {
        if (err) {
            ctx.reply('DB error!');
        }
        if (result) {
            axios
                .get(`https://api.coinmarketcap.com/v1/ticker/`+result.name+`/`)
                .then(res => {
                    const data = res.data[0];
                    
                    ctx.reply(
                        data.name + ' - ' + data.symbol +
                        '\nRank: ' + data.rank + 
                        '\nCirculating Supply: '+ data.available_supply +
                        '\nTotal Supply: '+  data.total_supply +
                        '\nMax Supply: '+ data.max_supply
                    );
                })
                .catch(err => {
                    ctx.reply('Không tìm thấy trên CMC!');
                });
        } else {
            ctx.reply('Không tìm thấy trong DB!');
        }
    });
});
bot.startPolling();


