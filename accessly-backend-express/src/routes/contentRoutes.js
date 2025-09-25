import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getContent } from '../controllers/contentController.js';

const router = express.Router();

router.get('/', authenticate, getContent);

export default router;
