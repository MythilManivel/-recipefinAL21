import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import User from '../models/User.js';
import ResetToken from '../models/ResetToken.js';
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

const setAuthCookie = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

router.post('/register',
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email: email.toLowerCase(), password, provider: 'local' });
    setAuthCookie(res, { id: user._id, role: user.role });
    user.lastLogin = new Date();
    await user.save();
    res.json({ message: 'Registered', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    setAuthCookie(res, { id: user._id, role: user.role });
    user.lastLogin = new Date();
    await user.save();
    
    res.json({ 
      message: 'Logged in', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  }
);

// Admin-specific login (verifies role)
router.post('/admin/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.role !== 'admin' || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    setAuthCookie(res, { id: user._id, role: user.role });
    user.lastLogin = new Date();
    await user.save();
    
    // Return user data directly
    res.json({ 
      message: 'Admin logged in', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  }
);

router.post('/forgot-password',
  body('email').isEmail(),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'No account found with this email address',
        success: false 
      });
    }

    res.json({ 
      message: 'Email found! You can now reset your password.',
      success: true 
    });
  }
);

router.post('/reset-password',
  body('email').isEmail(),
  body('newPassword').isLength({ min: 6 }),
  async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword; // will be hashed by pre-save
    await user.save();

    res.json({ message: 'Password updated successfully! You can now login with your new password.' });
  }
);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  async (req, res) => {
    // Issue JWT cookie & redirect to app
    const user = req.user;
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get('/me', async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(200).json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('_id name email role');
    if (!user) return res.status(200).json({ user: null });
    return res.json({ user });
  } catch (e) {
    return res.status(200).json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
