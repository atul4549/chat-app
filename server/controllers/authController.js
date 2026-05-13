import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';
import VerificationToken from '../models/VerificationToken.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, uniqueId, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { uniqueId }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Unique ID already taken',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID if not provided
    const finalUniqueId = uniqueId || `${name.toLowerCase().replace(/\s/g, '')}_${Date.now()}`;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      uniqueId: finalUniqueId,
      phoneNumber,
      isEmailVerified: false,
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or uniqueId
    const user = await User.findOne({
      $or: [{ email }, { uniqueId: email }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true,
      });
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      // Generate temporary token for 2FA
      const tempToken = jwt.sign(
        { userId: user._id, requires2FA: true },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      
      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        tempToken,
        message: 'Two-factor authentication required',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.isOnline = true;
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Blacklist the token
    if (token) {
      await BlacklistedToken.create({
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }

    // Update user status
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};

// @desc    Check authentication status
// @route   GET /api/auth/check
// @access  Private
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking authentication',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, phoneNumber, uniqueId } = req.body;
    const userId = req.user._id;

    // Check if uniqueId is taken
    if (uniqueId && uniqueId !== req.user.uniqueId) {
      const existingUser = await User.findOne({ uniqueId });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Unique ID already taken',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        phoneNumber,
        uniqueId,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

// @desc    Update user avatar
// @route   POST /api/auth/update-avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old avatar from cloudinary if exists
    if (user.avatar && user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    // Upload new avatar to cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'avatars',
      width: 500,
      height: 500,
      crop: 'fill',
    });

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar: result.secure_url },
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating avatar',
    });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    await PasswordResetToken.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request',
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    // Mark token as used
    resetToken.isUsed = true;
    await resetToken.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const verificationToken = await VerificationToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user email verification status
    await User.findByIdAndUpdate(verificationToken.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    // Mark token as used
    verificationToken.isUsed = true;
    await verificationToken.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    await VerificationToken.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email resent',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification email',
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Delete avatar from cloudinary
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
    });
  }
};

// @desc    Get session info
// @route   GET /api/auth/session
// @access  Private
export const getSessionInfo = async (req, res) => {
  try {
    const sessionInfo = {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      loginTime: new Date(),
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
    };

    res.status(200).json({
      success: true,
      data: sessionInfo,
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting session info',
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/auth/notification-settings
// @access  Private
export const updateNotificationSettings = async (req, res) => {
  try {
    const {
      messageNotifications,
      groupNotifications,
      callNotifications,
      soundEnabled,
      vibrationEnabled,
      previewEnabled,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        notificationSettings: {
          messageNotifications,
          groupNotifications,
          callNotifications,
          soundEnabled,
          vibrationEnabled,
          previewEnabled,
        },
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Notification settings updated',
      data: user.notificationSettings,
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification settings',
    });
  }
};

// @desc    Get security settings
// @route   GET /api/auth/security-settings
// @access  Private
export const getSecuritySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'isTwoFactorEnabled twoFactorSecret email twoFactorBackupCodes lastLogin lastSeen'
    );

    res.status(200).json({
      success: true,
      data: {
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        email: user.email,
        lastLogin: user.lastLogin,
        lastSeen: user.lastSeen,
        hasBackupCodes: user.twoFactorBackupCodes?.length > 0,
      },
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching security settings',
    });
  }
};

// @desc    Enable 2FA
// @route   POST /api/auth/enable-2fa
// @access  Private
export const enableTwoFactor = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `ChatApp:${req.user.email}`,
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex')
    );

    // Store secret temporarily
    req.user.twoFactorSecret = secret.base32;
    req.user.twoFactorBackupCodes = backupCodes.map(code => 
      bcrypt.hashSync(code, 10)
    );
    await req.user.save();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes,
      },
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enabling 2FA',
    });
  }
};

// @desc    Verify 2FA
// @route   POST /api/auth/verify-2fa
// @access  Private
export const verifyTwoFactor = async (req, res) => {
  try {
    const { token } = req.body;
    
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA token',
      });
    }

    req.user.isTwoFactorEnabled = true;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying 2FA',
    });
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private
export const disableTwoFactor = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Verify password
    const isValid = await bcrypt.compare(password, req.user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    req.user.isTwoFactorEnabled = false;
    req.user.twoFactorSecret = null;
    req.user.twoFactorBackupCodes = null;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling 2FA',
    });
  }
};