/*!
 *  ExpressLoad for the Express framework.
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @created 07/08/2012
 */

/**
 *  Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , util = require('util');

/**
 *  Configuration.
 */

var title = 'express-load';

/**
 *  ExpressLoad constructor.
 *
 *  @param dir {String|Array} Directory or list of directories to autoload from.
 *  @param app {Object} Express application instance.
 *  @return {Object} this ExpressLoad instance.
 */

var ExpressLoad = function(dir, app) {
  if (!app) {
    console.error('%s: Express application instance must be passed in', title);
    return false;
  }
  this.app = app;
  if (util.isArray(dir)) {
    for (var i in dir) {
      this.load(dir[i]);
    }
  } else {
    this.load(dir);
  }
  
  return this;
};

/**
 *  ExpressLoad script loader.
 *
 *  @param dir {String|Array} Directory to autoload from.
 *  @return {Object} this ExpressLoad instance.
 */

ExpressLoad.prototype.load = function(dir) {
  var that = this
    , dir = path.resolve(path.normalize(dir))
    , name = path.basename(dir);

  if (!this.app[name]) {
    this.app[name] = [];
  }

  var files = fs.readdirSync(dir);

  if (!files) {
    console.error('%s: Directory does not exist %s', title, dir);
  } else {
    files.forEach(function(file) {
      var filename = path.basename(file, path.extname(file))
		, fullpath = path.join(dir, file)

      if (!fs.statSync(fullpath).isDirectory()) {
        var script = require(fullpath);

      	if (typeof script === 'function') {
      	  script = script(that.app);
      	}
      	that.app[name][filename] = script;
      	console.log('%s: Loaded app.%s.%s', title, name, filename);
      }
    });
  }

  return this;
};

/**
 *  Expose the ExpressLoad class.
 */

module.exports = function(dir, app) {
  return new ExpressLoad(dir, app);
};
