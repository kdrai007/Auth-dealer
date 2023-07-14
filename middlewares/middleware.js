import jwt from 'jsonwebtoken';
import { config } from '../config.js';

//middleware to validate jwt token;
export const validateUser = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['access-token'];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, msg: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Invalid Token' });
  }
  return next();
};
