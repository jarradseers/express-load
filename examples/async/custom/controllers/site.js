exports.index = function(req, res, next) {
  var User = req.app.models.user;
  User.findById(0, function(user) {
    res.send('Have a user: ' + user.name + ' - ' + user.email);
  });
};

exports.user = function(req, res, next) {
  var User = req.app.models.user;
  User.findById(req.param.id, function(user) {
    res.send('Have a user: ' + user.name + ' - ' + user.email);
  });    
};