module.exports = (req, res, next) => {
  if (!req.user) {
    throw new Error('Unauthorized');
  }

  if (req.user.role !== 'admin') {
    throw new Error('Not enough permissions');
  }

  req.adminCheck = true;
  next();
};
