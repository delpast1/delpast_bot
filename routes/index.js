var express = require('express');
var router = express.Router();
var ticker = require('../app/controllers/ticker');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add-tickers', ticker.addTickers);

module.exports = router;
