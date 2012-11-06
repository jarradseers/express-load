exports.isAuthenticated = function() {
  if (true) {
    next();
  } else {
    res.send('Not authenticated');
  }
};
