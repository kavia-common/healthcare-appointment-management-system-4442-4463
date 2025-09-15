'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_JWT_EXPIRY = '8h';

/**
 * Hash a plaintext password with bcrypt.
 * PUBLIC_INTERFACE
 */
async function hashPassword(plainPassword) {
  /** Returns a bcrypt hash for a provided password string. */
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare a plaintext password with a stored hash.
 * PUBLIC_INTERFACE
 */
async function comparePassword(plainPassword, hash) {
  /** Returns true if the password matches the hash. */
  return bcrypt.compare(plainPassword, hash);
}

/**
 * Generate a JWT from a payload.
 * PUBLIC_INTERFACE
 */
function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRY) {
  /** Returns signed JWT for the given payload. */
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env not set');
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify JWT token.
 * PUBLIC_INTERFACE
 */
function verifyToken(token) {
  /** Verifies a JWT and returns the decoded payload. */
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env not set');
  return jwt.verify(token, secret);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
