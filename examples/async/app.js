/*!
 *  Example async autoloader.
 *  Derived from examples/mvc
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @author Sergey Egorov <rustler2000@mail.ru>
 *  @created 09/08/2012 NZST
 */

/**
 *  Module dependencies.
 */

var express = require('express')
  , load = require('../../')
  , path = require('path')
  , async = require('async');

/**
 *  Express v3 application instance
 */

var app = express();

/**
 *  Autoload Configuration.
 */

load
  .from(__dirname)
  .load('config')
  .into(app);

for (var environment in app.config) {
  app.configure(environment, function() {
    for (var key in app.config[environment]) {
      app.set(key, app.config[environment][key]);
    }
  });
}

/**
 *  Autoload base models, controllers and routes into application instance.
 */
 
function loadBase(app, done) { 
    load
      .from(path.join(__dirname, 'base'))
      .load('models')
      .then('controllers')
      .then('routes')
      .into(app, done);
}

/**
 *  Autoload custom models, controllers and routes into application instance.
 */
 
function loadCustom(app, done) { 
    load
      .from(path.join(__dirname, 'custom'))
      .load('models')
      .then('controllers')
      .then('routes')
      .into(app, done);
}

/**
 *  Run application
 */ 
 
function runApp(app, done) {
    /**
     *  Listen on the configured port.
     */
    
    app.listen(app.get('port'), app.get('ip'));
    done(null, app);
}

async.waterfall(
    [loadBase.bind(undefined, app), loadCustom, runApp],
    function(err, app) {
        /**
         * In real life we have to handle err here
         */

        /**
         *  Display some stuff from the auto-loaded config.
         */
        console.log('%s running in %s mode on %s:%s' 
          , app.get('title')
          , app.get('env')
          , app.get('ip')
          , app.get('port')
        );
    });

