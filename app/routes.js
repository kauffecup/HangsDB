var express = require('express');
var router = express.Router();
var connection = require('./db_connection/connection');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
