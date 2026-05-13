// routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
  updateAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  deleteAccount,
  getSessionInfo,
  updateNotificationSettings,
  getSecuritySettings,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('uniqueId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Unique ID must be between 3 and 20 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Bio cannot exceed 150 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  body('uniqueId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Unique ID must be between 3 and 20 characters'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const verifyEmailValidation = [
  body('token')
    .notEmpty().withMessage('Verification token is required'),
];

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.use(protect);

router.get('/check', checkAuth);
router.post('/logout', logout);
router.get('/session', getSessionInfo);

// Profile management
router.put('/update-profile', updateProfileValidation, validateRequest, updateProfile);
router.post('/update-avatar', upload.single('avatar'), updateAvatar);
router.post('/change-password', changePasswordValidation, validateRequest, changePassword);
router.delete('/delete-account', deleteAccount);

// Security settings
router.get('/security-settings', getSecuritySettings);
router.post('/enable-2fa', enableTwoFactor);
router.post('/verify-2fa', verifyTwoFactor);
router.post('/disable-2fa', disableTwoFactor);

// Notification settings
router.put('/notification-settings', updateNotificationSettings);

export default router;