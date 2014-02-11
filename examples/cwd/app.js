/**
 *  Module dependencies.
 */

var express = require('express')
  , load = require('../../');

/**
 *  Express v3 application instance
 */

var app = express();

/**
 *  Autoload.
 */

load('controllers', {cwd: 'app'}).into(app);

/**
 *  Listen on 3000.
 */

app.listen(3000);
console.log('express-load app listening on 3000');
