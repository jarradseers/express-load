# Express Load

The _express-load_ module provides the ability to load scripts into an Express instance from specified directories or files. 
Make large express MVC applications easier to develop by allowing a logical file separation without having to require your scripts. 
See the examples folder for information.

Express Load can be used to autoload models, routes, schemas, configs, controllers, object maps... etc...

You get access to the autoloaded files in the Express application instance to keep out of the global namespace. 
This also allows access to the scripts via the request object. `req.app`

A script at `controllers/user.js` becomes available as `app.controllers.user` or `req.app.controllers.user` in a request.

## Installation

	$ npm install express-load

## Usage

```js
var load = require('express-load');

load('config')
  .then('routes')
  .into(app);
```

## Simple Express Load Example

### controllers/site.js

```js
exports.index = function(req, res, next) {
  res.send('Hello world!');
};
```

### routes/site.js

```js
module.exports = function(app) {

  var site = app.controllers.site;
  
  app.get('/',
    site.index
  );

};
```

### app.js

```js
var express = require('express')
  , load = require('express-load');

var app = express();

load('controllers')
  .then('routes')
  .into(app);

app.listen(3000)
```

## Load Order

The basic load order is the order that is specified in code, for example, you will want to load models before controllers and controllers before routes:

```js
load('models')
  .then('controllers')
  .then('routes')
  .into(app);
```

This would simply load all models, all controllers, all routes in that order (alphabetical order within the directories).

### Specifying Complex Order

If you have two files in the foo folder _a.js_ and _z.js_ and you need _z.js_ loaded BEFORE _a.js_ you would simply do the following:

```js
load('foo/z.js').then('foo').into(app);
```

_express-load_ will recognise the order and will not add it again later down the chain.

### Async load

If you have an async script to load, _express-load_ will pass a `callback` function to your script and wait this function be called to load remain scripts.

```js
load('syncFoo.js').then('asyncBar.js').then('syncBar.js');

// asyncBar.js
module.exports = function (app, callback) {
    setTimeout(function () {
        console.log('After 5 seconds');
        callback();
    }, 5000);
};
```

If you need to know when async load is complete, you may pass the callback function as a second argument to ```into```. The callback get called when async load is completed.

```js
load('models')
    .then('collections')
    .then('controllers')
    .into(app, function(err, instance) {
        if(err) throw err;
        app.listen(app.get('port'));
    });
```

## Logging

Logging is off by default but can be enabled in the following way:

```js
load('controllers', {verbose:true}).into(app);
```

See the verbose example in the examples folder.

## Files and folders

_express-load_ will ignore hidden files and folders (by leading period) unless you explicitly define them to be loaded.

_express-load_ will by default only load files ending with `.js`, `.node`, `.coffee`, `.sjs`, `.json` extensions, unless you set checkext option to false : no file extension check at all. You can also change the list of allowed extension (in extlist option).

```js
load('controllers', {checkext:true, extlist:['.js','.myextension']}).into(app);
```

### Nested Folders

If you had nested folders like the following example: 

	models
		humans
			cool.js
			not.js
		animals
			dog.js
			cat.js

You would end up with the scripts being available in the following structure:

```js
app.models.humans.cool
app.models.humans.not
app.models.animals.dog
app.models.animals.cat
```

### Base directory

Express-load load scripts based on relative directory, however you can use `cwd` option if you want to load based on the other directory. see [example](https://github.com/jarradseers/express-load/tree/master/examples/cwd). 

### Getting the Express Application instance

This can be done in one of two ways:

#### In a script that is auto-loaded...

```js
module.exports = function(app) {
  console.log(app);
};
```

A script will only be loaded with parameters if module.exports is a function. Multiple parameters can be passed to the script in the `into` method, for example:

```js
load('controllers').into(app, parameter, another);
```

#### From a request object...

```js
app.get('/', function(req, res, next) {
  console.log(req.app);
});
```

### File and Folder names vs Object namespace examples

The names of files and folders are used to create the namespace therefore rules have been put in place. dashes `-` and periods `.` are removed and the following character is uppercased. For example:

	some-controllers/my.controller.js -> *.someControllers.myController

Please see the examples folder for working examples of _express-load_ in action.

# License 

(The MIT License)

Copyright (c) 2012 Jarrad Seers &lt;jarrad@jarradseers.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
