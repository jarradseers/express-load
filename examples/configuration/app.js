/*!
 *  Example configuration autoloader.
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @created 09/08/2012 NZST
 */

/**
 *  Module dependencies.
 */

var express = require('express')
  , load = require('../../');

var app = express();

load('configs', app)
  .autoConfigure(app.configs);

app.listen(app.settings.port);

console.log('%s running in %s mode on port %s' 
  , app.settings.title 
  , app.settings.env
  , app.settings.port
);
