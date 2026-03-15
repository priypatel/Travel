import AppError from '../utils/AppError.js';

const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') throw new AppError('Admin access required', 403);
  next();
};

export default adminOnly;
