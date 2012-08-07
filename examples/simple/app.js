var express = require('express');
var load = require('../../');

var app = express();

load(['./controllers', './routes'], app);

app.listen(3000);
console.log('express-load app listening on 3000');
