var express = require('express');
var router = express.Router();
var connection = require('./db_connection/connection');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Test DB endpoint */
var dbconnection = connection.createConnection();
router.get('/arrangements', function(req, res) {
  connection.getArrangementPage(dbconnection, function (err, rows) {
    if (err) {
      res.status(502);
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
