// controllers/pincodeController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Set pincode
export const setPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    const userId = req.user._id;
    
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must be 6 digits',
      });
    }
    
    // Hash pincode before storing
    const hashedPincode = await bcrypt.hash(pincode, 10);
    
    await User.findByIdAndUpdate(userId, {
      pincode: hashedPincode,
      isPincodeEnabled: true,
      pincodeAttempts: 0,
      pincodeLockUntil: null,
    });
    
    res.status(200).json({
      success: true,
      message: 'Pincode set successfully',
    });
  } catch (error) {
    console.error('Set pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting pincode',
    });
  }
};

// Verify pincode
export const verifyPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    const user = req.user;
    
    // Check if account is locked
    if (user.pincodeLockUntil && new Date() < new Date(user.pincodeLockUntil)) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked due to too many failed attempts',
        lockUntil: user.pincodeLockUntil,
      });
    }
    
    const isValid = await bcrypt.compare(pincode, user.pincode);
    
    if (isValid) {
      // Reset attempts on successful verification
      await User.findByIdAndUpdate(user._id, {
        pincodeAttempts: 0,
        pincodeLockUntil: null,
        lastPincodeVerified: new Date(),
      });
      
      res.status(200).json({
        success: true,
        message: 'Pincode verified successfully',
      });
    } else {
      // Increment failed attempts
      const newAttempts = (user.pincodeAttempts || 0) + 1;
      let lockUntil = null;
      
      if (newAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60000); // Lock for 15 minutes
      }
      
      await User.findByIdAndUpdate(user._id, {
        pincodeAttempts: newAttempts,
        pincodeLockUntil: lockUntil,
      });
      
      res.status(401).json({
        success: false,
        message: 'Invalid pincode',
        remainingAttempts: 5 - newAttempts,
        lockUntil,
      });
    }
  } catch (error) {
    console.error('Verify pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying pincode',
    });
  }
};

// Change pincode
export const changePincode = async (req, res) => {
  try {
    const { oldPincode, newPincode } = req.body;
    const user = req.user;
    
    const isValid = await bcrypt.compare(oldPincode, user.pincode);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current pincode is incorrect',
      });
    }
    
    const hashedNewPincode = await bcrypt.hash(newPincode, 10);
    
    await User.findByIdAndUpdate(user._id, {
      pincode: hashedNewPincode,
      pincodeAttempts: 0,
    });
    
    res.status(200).json({
      success: true,
      message: 'Pincode changed successfully',
    });
  } catch (error) {
    console.error('Change pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing pincode',
    });
  }
};

// Reset pincode (forgot)
export const resetPincode = async (req, res) => {
  try {
    const { email, newPincode } = req.body;
    
    // Generate OTP and send to email
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP temporarily (use Redis or temporary collection)
    await TempOTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000), // 10 minutes
    });
    
    // Send OTP via email
    await sendOTPEmail(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Reset pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting pincode',
    });
  }
};

// Clear pincode
export const clearPincode = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      pincode: null,
      isPincodeEnabled: false,
      pincodeAttempts: 0,
      pincodeLockUntil: null,
    });
    
    res.status(200).json({
      success: true,
      message: 'Pincode cleared successfully',
    });
  } catch (error) {
    console.error('Clear pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing pincode',
    });
  }
};