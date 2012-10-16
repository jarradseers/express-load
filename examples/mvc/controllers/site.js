module.exports = function(app) {

  var User = req.app.models.user;

  this.index = function(req, res, next) {
    User.findById(0, function(user) {
      res.send('Have a user: ' + user.name + ' - ' + user.email);
    });
  };

};
