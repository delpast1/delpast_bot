'use strict';

const Telegraf = require('telegraf');
const token = '501566533:AAGhJkG9Bnep5uWiYlzsI0oYhmqgancAWgc';
const bot = new Telegraf(token);
const axios = require('axios');
const Ticker = require('./models/ticker');

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 6
});

const marketcapFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

const numberFomatter = new Intl.NumberFormat('en-US', {
    style: 'decimal'
});

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 8
});

const changeFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2
});

bot.command('/p', (ctx) => {
    let text = ctx.update.message.text;
    let ticker = (text.slice(3)).toUpperCase();
    var reply = [];
    Ticker.findOne({'ticker': ticker}, (err, result) => {
        if (err) {
            ctx.reply('DB error!');
        }
        if (result) {
            axios
                .get(`https://api.coinmarketcap.com/v1/ticker/`+result.name+`/`)
                .then(res => {
                    for (var i=0;i<res.data.length; i++) {
                        const altcoin = res.data[i];
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
                                
                                ctx.reply(
                                    altcoin.name + ': ' + usdFormatter.format(altcoin.price_usd) + '\n' +
                                    priceFormatter.format(altcoin.price_btc) + ' | ' + changeFormatter.format(altcoin.percent_change_24h) + '%\n' +
                                    priceFormatter.format(currentAltETH) + ' | ' + changeFormatter.format(changeETH)+
                                    '%\nRank: ' + altcoin.rank + 
                                    '\nMarketcap: '+ marketcapFormatter.format(altcoin.market_cap_usd) +
                                    '\nVolume: ' + marketcapFormatter.format(altcoin["24h_volume_usd"])
                                    // '\nCirculating Supply: '+ numberFomatter.format(altcoin.available_supply) +
                                    // '\nTotal Supply: '+  numberFomatter.format(altcoin.total_supply) +
                                );
                            })
                            .catch(err => {
                                console.log(err);
                                ctx.reply('Lỗi ở axios thứ 2.');
                            })
                    }
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


