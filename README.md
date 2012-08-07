
# Express Load

The _express-load_ module provides the ability to load scripts into an Express instance from a specified directory. Make large express MVC applications easier to develop by allowing a logical file separation without having to include a bunch of files, see the examples folder for information.

Despite being a very simple module, it is extremely useful. It can be used to autoload models, routes, schemas, configs, controllers, object maps... etc...

_express-load_ gives you access to the autoloaded files in the Express application instance to keep out of the global namespace. This also allows access to the scripts via the request object.

A script at ./controllers/user.js becomes available as app.controllers.user or req.app.controllers.user in a request.

## Installation

	$ npm install express-load

## Usage

### Multiple Directories

```js
require('express-load')([
	'./models',
	'./controllers',
	'./routes'
], app);
```

### Single Directory

```js
require('express-load')('./routes', app);
```
The first parameter can be an array of directories or a string. The second parameter must be the Express application instance.

## Example

### app.js

```js
var express = require('express')
  , load = require('express-load');

var app = express();

load(['./controllers', './routes'], app);

app.listen(3000)
```
If there were the following files in the controllers folder:

_user.js_
_post.js_
_comment.js_

They would then be available as:
	app.controllers.user
	app.controllers.post
	app.controllers.comment

Or from within a request as:
	req.app.controllers.user
	req.app.controllers.post
	req.app.controllers.comment

The directories are read synchronously, this is only done once when the app starts allowing the directories listed to have the scripts loaded in the order specified, for example you will want to load the controllers before the routes.

More examples will be available in the _examples_ folder.

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
