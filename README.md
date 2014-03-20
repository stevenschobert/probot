Probot
======

String.replace() entire files and directories. Fully asynchronous and promise-ready!

![probot](https://f.cloud.github.com/assets/896486/2437565/23d0cc6e-ade8-11e3-991e-dd2806844843.gif)

## Example

```js
var probot = require('probot');
var bot = probot(/sherbert/g, 'Schobert');

// search and replace an entire directory of .txt files
bot.dir('app/src/', {ext: 'txt'}, function(err) {
  if (err) throw err;
  console.log('Finished!');
});

// search and replace a single file
// (this time using promises instead of callbacks!)
bot.file('README.md').then(function() {
  console.log('done!');
}).catch(function(err) {
  throw err;
});
```

## Installation

Probot is available via through npm:

```sh
npm install --save probot
```

## Usage

Programming a probot looks exactly like the `string.replace()` function signature. The first
argument is the "target" or search term, and the second is the replacement string.

```js
var bot = probot('my search string', 'my replacement');
```

Just like in the `string.replace()` function, you can also give it a regular expression and use
group matching in the replacement string.

```js
var bot = probot(/.*special_(\w)/g, 'newspecial_$1');
```

This allows you to also replace multiple matches using the `/g` flag, or use case-insensitive
searches using the `/i` flag.

## API

Each probot instance gets the following methods for searching and replacing files and directories.

#### .file(path, callback)

Search and replace in a single file. The file will be rewritten to the same path upon completion. If
you omit the callback, the method will return a promise instead.

#### .dir(path, options?, callback)

Search and replace all files in a directory. Subdirectories will be ignored. If you omit the
callback, a promise will be returned instead. You can also optionally provide an options object with the following settings:

- `ext: 'filetype'` - Only process files of a specific file extension.

#### .string(stringToReplace)

Returns a new string with replaced search terms. Maps directly to the `string.replace()` function.
Internally, this is the method that all other API's use to process file contents.
