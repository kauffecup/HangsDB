// NODE modules
var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Promise = require('bluebird'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
// DB modules
    connection = require('./db_connection/connection'),
    arrangement = require('./db_connection/arrangement');

/** {String} Path to where to put the uploaded files */
var UPLOAD_DIRECTORY_PATH = path.resolve(__dirname, '../files');

// TODO: we're never closing this... so uh... when do we do that
var dbconnection = connection.createConnection();


/**
 * Helper methods for loading song info. Return the promise for database
 * methods that fetch the info given the id. These are pretty self explanatory.
 */
function loadBlankForId (id, funcName) {
    return new Promise(function (resolve, reject) {
      arrangement[funcName](dbconnection, id, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
function loadSongRow (id) {
  return loadBlankForId(id, 'getForId');
}
function loadArrangers (id) {
  return loadBlankForId(id, 'getArrangersForId');
}
function loadDirectors (id) {
  return loadBlankForId(id, 'getDirectorsForId');
}
function loadConcerts (id) {
  return loadBlankForId(id, 'getConcertsForId');
}
function loadSoloists (id) {
  return loadBlankForId(id, 'getSoloistsForId');
}
function loadSemesters (id) {
  return loadBlankForId(id, 'getSemestersForId');
}
function loadArrangedSemester (id) {
  return loadBlankForId(id, 'getArrangedSemesterForId');
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Get some filios */
router.get('/files/*', function (req, res) {
  var filePath = req && req.params && req.params[0];
  res.sendfile(filePath, {root: path.resolve(__dirname, '../files')});
});

/**
 * Load the first page of arrangements.
 * TODO: maybe pass in the page num as an argument and default to 1?
 */
router.get('/arrangements', function (req, res) {
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
 * Endpoint for loading all of a songs info. Resolve the request with
 * a song JSON object.
 */
router.get('/loadsong', function (req, res) {
  var id = req.query && req.query.id;
  if (id) {
    Promise.join(loadSongRow(id), loadArrangers(id), loadDirectors(id), loadConcerts(id), loadSoloists(id), loadSemesters(id), loadArrangedSemester(id),
      function (song, arrangers, directors, concerts, soloists, semesters, arrangedSemester) {
        song = song[0];
        song['arrangers'] = arrangers;
        song['directors'] = directors;
        song['concerts'] = concerts;
        song['soloists'] = soloists;
        song['semesters'] = semesters;
        song['arranged_semester'] = arrangedSemester[0] && arrangedSemester[0].name;
        res.json(song);
    }).then(null, function (e) {
      console.log(e);
      res.status(502);
      res.json(e);
    });
  }
});

/**
 * Upload endpoint. call the megatron of functions.
 */
router.post('/upload', [ multer( {
  dest: UPLOAD_DIRECTORY_PATH,
  rename: function (fieldname, filename, req, res) {
    // make sure that the directory exists first
    mkdirp(UPLOAD_DIRECTORY_PATH + '/' + fieldname);
    return fieldname + '/' + req.body.name;
  }
}), function (req, res) {
  function numberToBoolean (num) {
    if (num === '0')
      return false;
    else if (num === '1')
      return true;
    else
      return '';
  }

  var files = req && req.files;
  var pdfURL, finaleURL, songURL;
  // if files were added, grab the relative filepath to the file to put it in the database
  if (files) {
    finaleURL = files.finale ? path.relative(UPLOAD_DIRECTORY_PATH, files.finale.path) : '';
    songURL = files.song ? path.relative(UPLOAD_DIRECTORY_PATH, files.song.path) : '';
    pdfURL = files.pdf ? path.relative(UPLOAD_DIRECTORY_PATH, files.pdf.path) : '';
  }

  var body = req && req.body;
  if (body) {
    arrangement.insertForAllFields(
      dbconnection,
      body.name,
      body.artist_name,
      body.original_song_year,
      body.arranged_semester,
      body.quality && parseInt(body.quality),
      body.reception && parseInt(body.reception),
      body.genre,
      body.arrangement_type_id && parseInt(body.arrangement_type_id),
      body.nickname,
      numberToBoolean(body.has_syllables),
      pdfURL,
      finaleURL,
      body.youtube_url,
      body.pitch_blown && parseInt(body.pitch_blown),
      body.difficulty && parseInt(body.difficulty),
      numberToBoolean(body.has_choreo),
      body.solo_voice_part_id && parseInt(body.solo_voice_part_id),
      body.notes,
      body.song_key && parseInt(body.song_key),
      songURL,
      numberToBoolean(body.active),
      body.number_of_parts && parseInt(body.number_of_parts),
      // these have to be passed in as arrays, not as strings. if undefined,
      // send an empty string, not an array of an empty string
      body.arrangers && [].concat(body.arrangers),
      body.semesters && [].concat(body.semesters),
      body.soloists && [].concat(body.soloists),
      body.directors && [].concat(body.directors),
      body.concertsIn && [].concat(body.concertsIn),
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
}]);

module.exports = router;
