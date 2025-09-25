import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticate, (req, res) => {
  return res.json({
    status: 'success',
    message: 'User profile',
    data: req.user
  });
});

router.get('/membership', authenticate, (req, res) => {
  return res.json({
    status: 'success',
    message: 'User profile',
    data: req.user
  });
});

export default router;
