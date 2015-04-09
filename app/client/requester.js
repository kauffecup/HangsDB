var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request').defaults({
  baseUrl: 'http://' + window.location.host,
  json: true
}));

module.exports = {
  /**
   * Load the first "page" of songs.
   * @return a bluebird promise that resolves with an array of songs
   */
  loadInitialSongs: function () {
    return new Promise(function (resolve, reject) {
      request.getAsync('/arrangements').then(function (res) {
        resolve(res[1]);
      }, function (e) {
        reject(e);
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
      request.getAsync('/loadsong?id=' + id).then(function (res) {
        resolve(res[1]);
      }, function (e) {
        reject(e);
      });
    });
  },

  /**
   * Add a song to the database
   * @return a bluebird promise that resolves with the server success response
   */
   uploadSong: function (songOptions) {
    return new Promise(function (resolve, reject) {
      request.postAsync({url: '/upload', form: songOptions}).then(function (res) {
        resolve(res[1]);
      }, function (e) {
        reject(e);
      });
    });
   }
}