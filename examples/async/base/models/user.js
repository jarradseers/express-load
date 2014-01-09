/*
 * base/models/user.js
 * Might be an interface/base implementation
 * In this example will be overrided by custom/models/user.js
 *
 * Additionally, here we use async load feature - in real life it could await 
 * for some resource (ie read database scheme or whatever external). Here,
 * it will just wait for 1 seconds
 */
module.exports = function(app, done) {

  var User = {};
  
  // Simple find user by id method.
  User.findById = function(id, callback) {
    callback(undefined);
  };
  
  // This is simulation of async load
  // The load going to be continued only after we called next
  setTimeout(done, 10000);

  return User;
};
