// const mongoose = require('mongoose');
import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  originalname: {
    type: String,
    required: true
  },
  uniqueUserName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    sparse: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
      type: String,
      default: "",
    },
//   otp: {
//     type: String,
//     default: null
//   },
//   otpExpiry: {
//     type: Date,
//     default: null
//   },
//   gmailConnected: {
//     type: Boolean,
//     default: false
//   },
//   linkedinConnected: {
//     type: Boolean,
//     default: false
//   },
//   paymentQRCode: {
//     type: String,
//     default: null
//   },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

export const user = mongoose.model('User', userSchema);