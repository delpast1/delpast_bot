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
                        '\nCirculating Supply: '+ numberFomatter.format(data.available_supply) +
                        '\nTotal Supply: '+  numberFomatter.format(data.total_supply) +
                        '\nMarketcap: '+ usdFormatter.format(data.market_cap_usd)
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


