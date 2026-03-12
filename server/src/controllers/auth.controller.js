import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../middleware/asyncHandler.js';

const IS_PROD = process.env.NODE_ENV === 'production';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,           // 15 minutes
  secure: IS_PROD,
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  secure: IS_PROD,
};

const generateAccessToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const setAuthCookies = (res, userId) => {
  res.cookie('accessToken', generateAccessToken(userId), ACCESS_COOKIE_OPTIONS);
  res.cookie('refreshToken', generateRefreshToken(userId), REFRESH_COOKIE_OPTIONS);
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { ...ACCESS_COOKIE_OPTIONS, maxAge: 0 });
  res.clearCookie('refreshToken', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
};

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  setAuthCookies(res, user._id);
  res.status(201).json({ user: userPayload(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  setAuthCookies(res, user._id);
  res.status(200).json({ user: userPayload(user) });
});

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError('No refresh token', 401);

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AppError('User no longer exists', 401);

  // Issue new access token only — refresh token keeps its original expiry
  res.cookie('accessToken', generateAccessToken(user._id), ACCESS_COOKIE_OPTIONS);
  res.status(200).json({ user: userPayload(user) });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/me — protected via protect middleware
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});
