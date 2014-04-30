/*!
 *  Example simple autoloader.
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @created 09/08/2012 NZST
 */

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
 *  Autoload Configuration.
 */

load('config').into(app);

for (var environment in app.config) {
  if (environment == app.get('env')) {
    for (var key in app.config[environment]) {
      app.set(key, app.config[environment][key]);
    }
  }
}

/**
 *  Autoload models, controllers and routes into application instance.
 */

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

/**
 *  Listen on the configured port.
 */

app.listen(app.get('port'));

/**
 *  Display some stuff from the auto-loaded config.
 */

console.log('%s running in %s mode on port %s' 
  , app.get('title')
  , app.get('env')
  , app.get('port')
);
