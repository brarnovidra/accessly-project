import express from 'express';
import passport from 'passport';
import { register, login, socialCallback, refresh, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Manual register & login
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  socialCallback
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login.html' }),
  socialCallback
);

router.get('/me', authenticate, (req, res) => {
  return res.json({
    status: 'success',
    message: 'User profile',
    data: req.user
  });
});

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
