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
  , util = require('util')
  , async = require('async');

/**
 *  Module Globals.
 */

var title   = 'express-load';

/**
 *	Defaults.
 */

var checkext = true
  , extlist = ['.js', '.node', '.json', '.coffee', '.sjs'];

for (var ext in require.extensions) {
  if (require.extensions.hasOwnProperty(ext) && extlist.indexOf(ext) === -1) {
    extlist.push(ext);
  }
}

/**
 *  ExpressLoad constructor.
 */

var ExpressLoad = function(entity, options) {
  options = options || {};
  options.checkext = options.checkext || checkext;
  options.extlist = options.extlist || extlist;
  options.logFormat = options.logFormat || '%s: %s';
  options.logger = options.logger || console;
  options.ignore = options.ignore || false;
  options.cwd = options.cwd || '';

  this.options = options;
  this.scripts = [];
  if (!(options.extlist instanceof RegExp) && options.extlist instanceof Array){
      this.__log('Converting extension list to regular expression');
      options.extlist = new RegExp('(.*)\\.(' + options.extlist.join('$|').replace(/\./g,'') + ')');
  };
  this.__log('Using regular expression' + options.extlist + 'for extenstion matching');
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

  var loc = this.options.cwd ? path.join(this.options.cwd, location) : location;
  var entity = this.__getEntity(loc);
  var queue = [];

  if (entity) {
    if (fs.statSync(entity).isDirectory()) {

      var dir = fs.readdirSync(entity);

      for (var file in dir) {

        var allow = true
          , script = path.normalize(path.join(entity, dir[file]));

        if (dir[file].charAt(0) === '.') {
          this.__log('Ignoring hidden entity: ' + dir[file], 'warn');

          allow = false;
        }

        if (allow && this.options.ignore && script.search(this.options.ignore) != -1) {
          this.__log('Ignoring file: ignore option match ' + script, 'warn');
          allow = false;
        }

        if (allow && fs.statSync(script).isDirectory()) {
          queue.push(this.then.bind(this, path.join(location, dir[file])));
          allow = false;
        }

        for (var s in this.scripts) {
          if (this.scripts[s].fullpath === script) {
            allow = false;
          }
        }

        if(this.options.checkext && fs.statSync(script).isFile() && !this.options.extlist.test(script)) {
            this.__log('Ignoring file: extension not allowed ' + script, 'warn');
            allow = false;
        }

        if (allow) {
          var name = getName(script);

          this.scripts.push({
            fullpath: script,
            location: path.join(location, name),
            name: name
          });
        }

      }

      // If we have directories in queue to process, then process them now.
      if (queue.length) {
        for (var index in queue) {
          queue[index]();
        }
      }
    } else {
      var location = path.dirname(location)
        , name = getName(entity);

      this.scripts.push({
        fullpath: entity,
        location: path.join(location, name),
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
    if (fs.existsSync(entity + '.js')) {
      entity = entity + '.js';
    } else {
      this.__log('No such file or directory found at: ' + entity, 'error');
      return false;
    }
  }

  return entity;
}

/**
 *  Into method, applies script to instance.
 *
 *  @param instance {Object} Express application instance.
 *  @param [done] {Function} Callback function.
 *  @return this {Object} this ExpressLoad instance.
 */

ExpressLoad.prototype.into = function(instance, done) {

  var self = this;
  async.eachSeries(this.scripts, function (script, next) {
    delete require.cache[script.fullpath];
    var parts = script.location.split(path.sep)
      , maps = parts.slice(0)
      , ns = createNamespace(instance, parts)
      , mod = require(script.fullpath)
      , map = [];

    var notAsync = typeof mod !== 'function' || mod.length < 2;

    if (self.options.invoke !== false) {
      if (!notAsync) {
        mod = mod.call(script, instance, function () {
          self.__log('Loaded *.' + map.join('.'));
          next();
        });
      } else if (typeof mod === 'function') {
        mod = mod.call(script, instance);
      }
    }

    ns[script.name] = mod;

    while (maps.length) {
      map.push(
        getName(
          maps.shift()
        )
      );
    }

    if (notAsync) {
      self.__log('Loaded *.' + map.join('.'));
      next();
    }
  }, function () {
    self.__log('All things loaded');
    if(typeof done === 'function')
      done(null, instance);
  });
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

// vim: sw=2 sts=2 ts=2:
