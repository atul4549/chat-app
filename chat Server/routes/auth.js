// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { originalname, uniqueUserName, phone, email, password } = req.body;
    
//     // Check if user exists
//     const existingUser = await User.findOne({ 
//       $or: [{ uniqueUserName }, { email }, { phone }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     const user = new User({
//       originalname,
//       uniqueUserName,
//       phone,
//       email,
//       password: hashedPassword
//     });
    
//     await user.save();
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.status(201).json({ token, user: { ...user._doc, password: undefined } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { identifier, password } = req.body;
    
//     const user = await User.findOne({
//       $or: [{ uniqueUserName: identifier }, { email: identifier }, { phone: identifier }]
//     });
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.json({ token, user: { ...user._doc, password: undefined } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Send OTP
// router.post('/send-otp', async (req, res) => {
//   try {
//     const { phone, email } = req.body;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes
    
//     const user = await User.findOne({ $or: [{ phone }, { email }] });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();
    
//     // Integrate with SMS/Email service here
//     // For now, just return OTP (for development)
//     res.json({ message: 'OTP sent', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   try {
//     const { identifier, otp } = req.body;
    
//     const user = await User.findOne({
//       $or: [{ phone: identifier }, { email: identifier }],
//       otp,
//       otpExpiry: { $gt: new Date() }
//     });
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid or expired OTP' });
//     }
    
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.json({ token, user: { ...user._doc, password: undefined } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update payment QR code
// router.put('/update-payment-qr', async (req, res) => {
//   try {
//     const { userId, paymentQRCode } = req.body;
//     await User.findByIdAndUpdate(userId, { paymentQRCode });
//     res.json({ message: 'Payment QR code updated' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;