var express = require('express')
	,	load = require('../../');

var app = express();

load('configs', app);

for (var config in app.configs) {
	app.configure(config, function() {
		for (var key in app.configs[config]) {
			app.set(key, app.configs[config][key]);
		}
	});
}

app.listen(app.settings.port);

console.log('%s running in %s mode on port %s' 
	, app.settings.title 
	, app.settings.env
  , app.settings.port
);
