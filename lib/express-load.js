/*!
 *  ExpressLoad.
 *  Autoload config, models, controllers etc...
 *
 *  @author Jarrad Seers <jarrad@jarradseers.com>
 *  @created 07/08/2012 NZST
 */

/**
 *  Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , util = require('util');

/**
 *  Module Globals.
 */

var title   = 'express-load';

/**
 *	Defaults.
 */

var extlist = ['.js', '.node', '.json', '.coffee', '.sjs'];
var checkext = true;

/**
 *  ExpressLoad constructor.
 */

var ExpressLoad = function(entity, options) {
  var options = options || {};
  options.checkext = options.checkext || checkext;
  options.extlist = options.extlist || extlist;
  options.logFormat = options.logFormat || '%s: %s';
  options.logger = options.logger || console;

  this.options = options;
  this.scripts = [];
  this.then(entity);

  return this;
};

/**
 *  Then method - creates a list of scripts in order.
 *
 *  @param location {String} Directory/file to load.
 *  @return this {Object} this ExpressLoad instance.
 */

ExpressLoad.prototype.then = function(location) {

  var entity = this.__getEntity(location);

  if (entity) {
    if (fs.statSync(entity).isDirectory()) {

      var dir = fs.readdirSync(entity);

      for (var file in dir) {

        var allow = true
          , script = path.join(entity, dir[file]);

        if (dir[file].charAt(0) === '.') {
          this.__log('Ignoring hidden entity: ' + dir[file], 'warn');

          allow = false;
        }

        if (allow && fs.statSync(script).isDirectory()) {
          this.then(path.join(location, dir[file]));
          allow = false;
        }

        for (var s in this.scripts) {
          if (this.scripts[s].fullpath === script) {
            allow = false;
          }
        }

        if(this.options.checkext && (this.options.extlist.indexOf(path.extname(dir[file]))==-1)) {
          this.__log('Ignoring file: extension not allowed ' + dir[file], 'warn');
          allow = false;
        }


        if (allow) {
          var name = getName(script);

          this.scripts.push({
            fullpath: script,
            location: location + path.sep + name,
            name: name
          });
        }

      }
    } else {
      var location = path.dirname(location)
        , name = getName(entity);

      this.scripts.push({
        fullpath: entity,
        location: location + path.sep + name,
        name: name
      });
    }
  }

  return this;
};

/**
 *  Create Namespace function - creates a namespace map.
 *
 *  @param parent {Object} Current register.
 *  @param parts {Array} Namespace location map.
 *  @return parent {Object} current namespace.
 */

function createNamespace(parent, parts) {

  var part = getName(parts.shift());

  if (!parent[part]) {
    parent[part] = {};
  }

  if (parts.length) {
    parent = createNamespace(parent[part], parts);
  }

  return parent;
}

/**
 *  Get Name - formats name into method-friendly version from script path.
 *
 *  @param script {String} Script location.
 *  @return name {String} Name of script.
 */

function getName(script) {
  var script = path.basename(script, path.extname(script)).replace(/[^a-zA-Z0-9]/g, '.')
    , parts = script.split('.')
    , name = parts.shift();

  if (parts.length) {
    for (var p in parts) {
      name += parts[p].charAt(0).toUpperCase() + parts[p].substr(1, parts[p].length);
    }
  }

  return name;
}

/**
 *  Get Entity Method - gets the formatted file or folder location.
 *
 *  @param location {String} Script location.
 *  @return entity {String} Normalised path.
 */

ExpressLoad.prototype.__getEntity = function(location) {
  if (typeof location !== 'string') {
    this.__log('File or Folder must be a string: ' + location, 'error');
    return false;
  }

  var entity = path.resolve(
    path.normalize(location)
  );

  if (!fs.existsSync(entity)) {
    this.__log('No such file or directory found at: ' + entity, 'error');
    return false;
  }

  return entity;
}

/**
 *  Into method, applies script to instance.
 *
 *  @param instance {Object} Express application instance.
 *  @return this {Object} this ExpressLoad instance.
 */

ExpressLoad.prototype.into = function(instance) {

  for (var s in this.scripts) {

    var script = this.scripts[s]
      , parts = script.location.split(path.sep)
      , maps = parts.slice(0)
      , ns = createNamespace(instance, parts)
      , mod = require(script.fullpath)
      , map = [];

    if (typeof mod === 'function') {
      mod = mod.apply(script, arguments);
    }

    ns[script.name] = mod;

    while (maps.length) {
      map.push(
        getName(
          maps.shift()
        )
      );
    }

    this.__log('Loaded *.' + map.join('.'));
  }

  return this;
};

/**
 *  Log method, Logs to console if verbose option is true.
 *
 *  @param message {String} Message to display.
 *  @param type {String} Type of message ('error', 'warn', 'info') defaults to info.
 *  @return this {Object} this ExpressLoad instance.
 */

ExpressLoad.prototype.__log = function(message, type) {
  if (this.options.verbose) {
    type = type || 'info';
    this.options.logger[type](this.options.logFormat, title, message);
  }
  return this;
};

/**
 *  Expose the ExpressLoad class.
 *
 *  @param entity {String} File or folder to load.
 *  @param app {Object} Express application instance.
 *  @return new ExpressLoad {Object} new ExpressLoad instance.
 */

module.exports = function(entity, options) {
  return new ExpressLoad(entity, options);
};
