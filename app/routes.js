var express = require('express'),
    router = express.Router(),
    connection = require('./db_connection/connection'),
    arrangement = require('./db_connection/arrangement');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Test DB endpoint */
var dbconnection = connection.createConnection();
router.get('/arrangements', function(req, res) {
  arrangement.getPage(dbconnection, 1, function (err, rows) {
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
  function stringToBoolean (string) {
    if (string === 'true')
      return true;
    else if (string === 'false')
      return false;
    else
      return '';
  }

  var body = req && req.body;
  if (body) {
    arrangement.insertForAllFields(
      dbconnection,
      body.name,
      body.opb,
      body.year,
      body.arrangedSemester,
      body.quality,
      body.reception,
      body.genre,
      body.arrType,
      body.nickname,
      stringToBoolean(body.hasSyllables),
      '',  // pdf URL, blank for now
      '',  // finale URL, blank for now
      body.youtubeLink,
      body.pitchBlown,
      body.difficulty,
      stringToBoolean(body.hasChoreo),
      body.soloRange,
      body.notes,
      body.key,
      '',  // song URL, blank for now
      stringToBoolean(body.isActive),
      body.numParts,
      // these have to be passed in as arrays, not as strings
      [].concat(body.arrangedby),
      [].concat(body.semestersIn),
      [].concat(body.soloists),
      [].concat(body.mds),
      [].concat(body.concertsIn),
      function (err, result) {
        if (err) {
          res.status(502);
          res.json(err);
        } else {
          res.status(200);
          res.json(result);
        }
      });
  } else {
    res.status(400);
    res.json({});
  }
});

module.exports = router;
