/*!
 *  Example simple autoloader.
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @created 07/08/2012 NZST
 */

/**
 *  Module dependencies.
 */

var express = require('express')
  , load = require('../../');

/**
 *  Express v3 application instance.
 */

var app = express();

/**
 *  Autoload with verbose option.
 */

load('controllers', {verbose: true})
  .then('routes')
  .into(app);

/**
 *  Listen on 3000.
 */

app.listen(3000);
console.log('express-load app listening on 3000');
