
exports.index = function(req, res, next) {
  var User = req.app.models.user;

  User.findById(0, function(user) {
    res.send('Here is a user: ' + user.name + ' - ' + user.email);
  });
};
