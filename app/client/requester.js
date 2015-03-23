var http = require('http'),
    querystring = require('querystring'),
    Promise = require('bluebird');

module.exports = {
  /**
   * Load the first "page" of songs.
   * @return a bluebird promise that resolves with an array of songs
   */
  loadInitialSongs: function () {
    return new Promise(function (resolve, reject) {
      http.get('/arrangements', function (res) {
        var stringified = '';
        res.on('data', function (data) {
          stringified += data;
        });
        res.on('end', function () {
          var songs;
          try {
            songs = JSON.parse(stringified);
            // TODO: is this a reliable error condition?
            if (songs.code)
              // TODO: reject with something
              reject();
          } catch (e) {
            songs = [];
          }
          resolve(songs);
        });
        res.on('error', function () {
          // TODO: reject with something
          reject();
        });
      });
    });
  },

  /**
   * Load all of a song's infos.
   * Return a Promise that resolves with a song JSON object
   * TODO should really document what this looks like somewhere
   */
  loadSong: function (id) {
    return new Promise(function (resolve, reject) {
      http.get('/loadsong?id=' + id, function (res) {
              var stringified = '';
        res.on('data', function (data) {
          stringified += data;
        });
        res.on('end', function () {
          var song;
          try {
            song = JSON.parse(stringified);
            // TODO: is this a reliable error condition?
            if (song.code)
              // TODO: reject with something
              reject();
          } catch (e) {
            song = {};
          }
          resolve(song);
        });
        res.on('error', function () {
          // TODO: reject with something
          reject();
        });
      });
    });
  },

  /**
   * Add a song to the database
   * @return a bluebird promise that resolves with the server success response
   */
   uploadSong: function (songOptions) {
    return new Promise(function (resolve, reject) {
      var postData = querystring.stringify(songOptions);
      var options = {
        path: '/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };
      var req = http.request(options, function (res) {
        if (res.statusCode === 200) {
          var stringified = '';
          res.on('data', function (data) {
            stringified += data;
          });
          res.on('end', function () {
            var resolveData;
            try {
              resolveData = JSON.parse(stringified);
            } catch (e) {
              resolveData = {};
            }
            resolve(resolveData);
          });
        } else {
          reject();
        }
      });
      req.on('error', function(e) {
        reject(e);
      });
      // write data to request body
      req.write(postData);
      req.end();
    });
   }
}