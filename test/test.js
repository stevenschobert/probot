(function () {
  'use strict';

  var expect = require('expect.js'),
      fs = require('fs'),
      join = require('path').join,
      equal = require('assert-dir-equal'),
      Promise = require('bluebird'),
      cp = Promise.promisify(require('fs-extra').copy),
      rm = Promise.promisify(require('rimraf')),

      probot = require('..');

  describe('factory', function() {
    it('should take string arguments', function() {
      var instance = probot('myteststring', 'myreplacestring');
      expect(instance.target).to.be('myteststring');
      expect(instance.weapon).to.be('myreplacestring');
    });

    it('should take an object argument', function() {
      var regex = /.*/,
          instance = probot({
            target: regex,
            weapon: 'replacement'
          });
      expect(instance.target).to.be(regex);
      expect(instance.weapon).to.be('replacement');
    });
  });

  describe('instance', function() {
    var bot = probot(/%([\w\-]+)/g, '.$1');

    describe('#string', function() {
      it('should process a string', function() {
        var testString = '%class { width: 50%; } %placeholder { width: 50%; }',
            expected = '.class { width: 50%; } .placeholder { width: 50%; }';
        expect(bot.string(testString)).to.be(expected);
      });
    });

    describe('#file', function() {
      beforeEach(function(done) {
        rm(join(__dirname, 'fixtures/file/target'))
        .then(function() {
          return cp(join(__dirname, 'fixtures/file/src/single.scss'), join(__dirname, 'fixtures/file/target/single.scss'));
        })
        .then(done)
        .catch(done);
      });

      it('should process a single file', function(done) {
        bot.file(join(__dirname, 'fixtures/file/target/single.scss'), function(err) {
          if (err) {
            throw err;
          }
          equal(join(__dirname, 'fixtures/file/target/'), join(__dirname, 'fixtures/file/expected'));
          done();
        });
      });
    });

    describe('#dir', function() {
      beforeEach(function(done) {
        rm(join(__dirname, 'fixtures/dir/target'))
        .then(function() {
          return cp(join(__dirname, 'fixtures/dir/src'), join(__dirname, 'fixtures/dir/target'));
        })
        .then(done)
        .catch(done);
      });

      beforeEach(function(done) {
        rm(join(__dirname, 'fixtures/dir2/target'))
        .then(function() {
          return cp(join(__dirname, 'fixtures/dir2/src'), join(__dirname, 'fixtures/dir2/target'));
        })
        .then(done)
        .catch(done);
      });

      it('should process all files in a directory', function(done) {
        bot.dir(join(__dirname, 'fixtures/dir2/target'), function(err) {
          if (err) {
            throw err;
          }
          equal(join(__dirname, 'fixtures/dir2/expected'), join(__dirname, 'fixtures/dir2/target'));
          done();
        });
      });

      it('should process files of a specific extension in a directory', function(done) {
        bot.dir(join(__dirname, 'fixtures/dir/target'), {ext: '.scss'}, function(err) {
          if (err) {
            throw err;
          }
          equal(join(__dirname, 'fixtures/dir/expected'), join(__dirname, 'fixtures/dir/target'));
          done();
        });
      });
    });
  });
}());
