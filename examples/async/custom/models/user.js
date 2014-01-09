module.exports = function(app) {
  
  // Dummy db.
  var _ = require("underscore")
  , users = [
      {name: 'Jarrad Seers', email: 'jarrad@jarradseers.com'},
      {name: 'Bob Jones', email: 'bob@example.com'},
      {name: 'Mark White', email: 'white@mark.example.com'}
  ];

  var User = _.extend(app.models.user, {
    // Simple find user by id method.
    findById: function(id, callback) {
      callback(users[id]);
    }
  });
  

  return User;
};
