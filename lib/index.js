(function () {
  'use strict';

  var fs = require('fs'),
      Promise = require('bluebird'),
      join = require('path').join,

      readdir = Promise.promisify(fs.readdir),
      readFile = Promise.promisify(fs.readFile),
      writeFile = Promise.promisify(fs.writeFile),

      probotProto = {
        string: function string(searchString) {
          return searchString.replace(this.target, this.weapon);
        },

        file: function file(path, cb) {
          return readFile(path, 'utf-8')
          .bind(this)
          .then(function(contents) {
            return writeFile(path, this.string(contents));
          })
          .nodeify(cb);
        },

        dir: function dir(path, options, cb) {
          var args = [].slice.call(arguments);

          if (typeof args[1] === 'function') {
            cb = options;
            options = {};
          }

          return readdir(path)
          .bind(this)
          .filter(function(filename) {
            var ext = options.ext;

            if (!options.ext) {
              return true;
            }

            if (ext.charAt(0) === '.') {
              ext = ext.substr(1, ext.length - 1);
            }

            return (filename.split('.').pop().toLowerCase() === ext);
          })
          .map(function(file) {
            return this.file(join(path, file));
          })
          .nodeify(cb);
        }
      },

      probot = function probot() {
        var args = [].slice.call(arguments),
            droid = Object.create(probotProto);

        if (args.length === 1 && typeof args[0] !== 'string') {
          droid.target = args[0].target;
          droid.weapon = args[0].weapon;
        } else {
          droid.target = args[0];
          droid.weapon = args[1];
        }

        return droid;
      };

  module.exports = probot;
}());
