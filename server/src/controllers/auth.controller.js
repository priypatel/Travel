import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../middleware/asyncHandler.js';

const COOKIE_OPTIONS = {
  httpOnly: true,          // not accessible via JS
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({ name, email, password: hashedPassword });

  setAuthCookie(res, generateToken(user._id));

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  setAuthCookie(res, generateToken(user._id));

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/me  — protected, reads cookie via protect middleware
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});
