// routes/pincodeRoutes.js
import express from 'express';
import {
  setPincode,
  verifyPincode,
  changePincode,
  resetPincode,
  clearPincode,
} from '../controllers/pincodeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/set-pincode', setPincode);
router.post('/verify-pincode', verifyPincode);
router.post('/change-pincode', changePincode);
router.post('/reset-pincode', resetPincode);
router.post('/clear-pincode', clearPincode);

export default router;