module.exports = function(app) {

/**
 *	Load Controllers.
 */

  var site = app.controllers.site;
  var user = app.controllers.user;

/**
 *	Route to controllers.
 */

  app.get('/',
    user.isAuthenticated,
    site.index
  );
  app.get('/user/:id',
    user.isAuthenticated,
    site.index
  );
  
};
