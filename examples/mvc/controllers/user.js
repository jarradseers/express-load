module.exports = function(app) {

  this.isAuthenticated = function(req, res, next) {
    if (true) {
      next();
    } else {
      res.send('Not authenticated');
    }
  };

};
