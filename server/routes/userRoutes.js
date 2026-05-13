import express from 'express';
import {
  searchUsers,
  getUserById,
  getUsersByIds,
  getSuggestedUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateSearchQuery } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Search users with validation
// router.get('/search', validateSearchQuery, searchUsers);
router.get('/search', searchUsers);

// Get suggested users
router.get('/suggestions', getSuggestedUsers);

// Batch get users
router.post('/batch', getUsersByIds);

// Get single user
router.get('/:userId', getUserById);

export default router;