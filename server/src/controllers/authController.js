import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signupSchema, loginSchema, otpSchema } from '../utils/validation.js';
import { generateOtp, isOtpExpired } from '../utils/otpHelpers.js';
import { sendMail } from '../utils/emailService.js';

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

const safeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const signup = async (req, res, next) => {
  try {
    const payload = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      otpHash,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpAttempts: 0,
      otpResendAt: new Date(Date.now())
    });

    await sendMail({
      to: user.email,
      subject: 'Your MatruCare AI OTP',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;color:#0f172a;">
          <h2 style="color:#111827;margin-bottom:16px;">MatruCare AI</h2>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:6px;padding:18px 0;color:#0f172a;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
          <p>Do not share this code with anyone.</p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your OTP to continue.'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const payload = otpSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (isOtpExpired(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(payload.otp, user.otpHash || '');
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP.' });
    }

    user.isVerified = true;
    user.otpHash = '';
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now log in.'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.otpResendAt && Date.now() - new Date(user.otpResendAt).getTime() < 30000) {
      return res.status(429).json({ success: false, message: 'Please wait before requesting another OTP.' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otpHash = otpHash;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    user.otpResendAt = new Date();
    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Your MatruCare AI OTP',
      text: `Your new OTP is ${otp}. It expires in 10 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;color:#0f172a;"><h2>MatruCare AI</h2><p>Your new verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:6px;padding:18px 0;">${otp}</div><p>It expires in 10 minutes.</p></div>`
    });

    res.status(200).json({ success: true, message: 'A fresh OTP has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your account before logging in.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'matrucare-dev-secret', {
      expiresIn: '7d'
    });

    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: safeUser(user)
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const me = async (req, res) => {
  res.status(200).json({ success: true, user: safeUser(req.user) });
};
