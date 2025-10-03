import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { paginationMiddleware } from "../utils/pagination.js";
import { getContent } from '../controllers/contentController.js';
import { getUserContents } from '../controllers/userContentController.js';
import { redisCache } from '../middleware/cache.js'

const router = express.Router();

// Middleware: generate key berdasarkan query params + user
const generateCacheKey = (req) => {
  const userId = req.user?.id || 'anon'
  const { page = 1, limit = 10, search = '', filterBy = '', filterValue = '' } = req.query

  return `contents:user:${userId}:page=${page}:limit=${limit}:search=${search}:filterBy=${filterBy}:filterValue=${filterValue}`
}

router.get('/', authenticate, paginationMiddleware, getContent);
router.get('/users', authenticate, redisCache(generateCacheKey, 300), paginationMiddleware, getUserContents);

export default router;
