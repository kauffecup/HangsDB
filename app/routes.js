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

/**
 * Upload endpoint. call the megatron of functions.
 */
router.post('/upload', function (req, res) {
  var body = req && req.body;
  if (body) {
    connection.addAllToArrangement(dbconnection, body.name, body.opb, body.year, body.arrangedSemester,
      body.quality, body.reception, body.genre, body.arrType, body.nickname, body.hasSyllables,
      '', '', body.youtubeLink, body.pitchBlown, body.difficulty, body.hasChoreo, body.soloRange,
      body.notes, body.key, '', body.isActive, body.numParts, body.arrangedby, body.semestersIn,
      body.soloists, body.mds, body.concertsIn, function (err, something) {
        req.status(200);
        res.json({});
      });
  } else {
    req.status(400);
    res.json({});
  }
});

module.exports = router;
