module.exports = (req, res, next) => {
  if(req.body.user && !req.body.user.is_admin && !req.params.isAdmin) {
    const error = new Error('User must be Admin to change Users data!');
    error.statusCode = 401;
    throw error;
  }
  next();
};