import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, Membership, RefreshToken } from '../database/models/index.js';
import { success, error } from '../utils/response.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, membership_id: user.membership_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Generate Refresh Token (stored in DB)
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); 

  await RefreshToken.create({
    user_id: userId,
    token,
    expires_at: expires
  });

  return token;
};

export const register = async (req, res) => {
  try {
    const { email, password, membership_id } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }
    if (!membership_id) {
      return error(res, 'Membership is required', 400);
    }

    // cek email sudah dipakai?
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return error(res, 'Email already registered', 400);
    }

    // cek membership valid?
    const membership = await Membership.findByPk(membership_id);
    if (!membership) {
      return error(res, 'Invalid membership', 400);
    }

    // hash password
    const hashed = await bcryptjs.hash(password, 10);

    // buat user baru
    const user = await User.create({
      email,
      password: hashed,
      membership_id,
      provider: 'local',
      provider_id: null // khusus OAuth baru ada ID
    });

    // generate token
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return success(res, 'Registration successful', {
      accessToken, refreshToken, user
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    // hanya cari user dengan provider local
    const user = await User.findOne({ where: { email, provider: 'local' }, include: [{ model: Membership, as: 'memberships' }]});
    if (!user) return error(res, 'User not found or not registered locally', 404);

    // validasi password
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return error(res, 'Invalid credentials', 401);

    // generate token
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return success(res, 'Login successful', { accessToken, refreshToken, user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// OAuth callback (Google / Facebook)
export const socialCallback = async (req, res) => {
  try {
    const user = req.user; // dari passport
    const accessToken = generateToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    // arahkan ke frontend
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3001";
    res.redirect(
      `${frontendURL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored) return error(res, 'Invalid refresh token', 401);

    if (new Date(stored.expires_at) < new Date()) {
      return error(res, 'Refresh token expired', 401);
    }

    const user = await User.findByPk(stored.user_id);
    if (!user) return error(res, 'User not found', 404);

    const accessToken = generateToken(user);
    return success(res, 'Token refreshed', { accessToken });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Logout (delete refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    await RefreshToken.destroy({ where: { token: refreshToken } });
    return success(res, 'Logout successful', null);
  } catch (err) {
    return error(res, err.message, 500);
  }
};