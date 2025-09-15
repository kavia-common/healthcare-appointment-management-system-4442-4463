'use strict';
const { verifyToken } = require('../utils/auth');

/**
 * Express middleware to authenticate requests with Bearer token.
 * Adds req.user upon success.
 * PUBLIC_INTERFACE
 */
function authenticate(req, res, next) {
  /** Validates Authorization header with Bearer JWT and attaches user payload. */
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, name, ... }
    return next();
  } catch (e) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

/**
 * Role guard middleware. Accepts array of roles: ['admin','doctor','nurse']
 * PUBLIC_INTERFACE
 */
function authorize(roles = []) {
  /** Ensures the authenticated user has one of the allowed roles. */
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || (roles.length && !roles.includes(role))) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
