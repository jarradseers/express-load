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

/**
 *  Create Express 3 app.
 */

var app = express();

/**
 *  Load configuration into app instance.
 */

load('configs').into(app);

/**
 *  Configure for environment.
 */

for (var config in app.configs[app.get('env')]) {
  app.set(config, app.configs[app.get('env')][config]);
}

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
