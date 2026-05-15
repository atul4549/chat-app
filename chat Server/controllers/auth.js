
/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */

export const register = async(req, res) => {
    try{
        const { username, phone, email, password, avatar } = req.body;
        
        if (!username) return res.status(400).json({ message: "username is required" });
        if (!password) return res.status(400).json({ message: "password is required" });

        if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const userE = await User.findOne({ username });

    if (userE) return res.status(400).json({ message: "User name already exists, try another username" });
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User.create({
      username,
      email,
      password: hashedPassword,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    
    });

    // Send OTP email
    // await sendOTPEmail(email, otp);

    // Generate token and set cookie
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

    // Send success response (only once!)
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with OTP.',
      user: {
        userId: user._id,
        username: user.name,
        userMail: user.email,
        userAvatar: user.avatar,
        // isVerified: user.isVerified
        token,
        refreshToken,
      },
    });

        } catch(error){
            console.log("Error in signup controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
    }
}


/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ username }).select('+password'); // Explicitly select password
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional: Uncomment if you want to enforce email verification
    // if (!user.isVerified) {
    //   return res.status(401).json({ 
    //     message: 'Please verify your email first',
    //     needsVerification: true 
    //   });
    // }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account has been deactivated",
      });
    }

    // Generate token and set cookie
    // generateToken(user._id, res);

        // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });


    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
        token,
        refreshToken,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Server error during login', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};


// export const logout = async (req, res) => {
//   res.cookie('jwt', '', {
//     httpOnly: true,
//     expires: new Date(0),
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     path: '/'
//   });
  
//   return res.status(200).json({ message: 'Logged out successfully' });
// };


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// TODO: if phone or email then only other wise not
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// controllers/authController.js
import { user as User } from "../models/User.js";
import { generateToken, generateRefreshToken } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password, avatar } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         error: "Please provide name, email and password",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         error: "User with this email already exists",
//       });
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email: email.toLowerCase(),
//       password,
//       avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
//     });

//     // Generate tokens
//     const token = generateToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // Save refresh token to user (optional)
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     res.status(201).json({
//       success: true,
//       data: {
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           avatar: user.avatar,
//         },
//         token,
//         refreshToken,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         error: "Please provide email and password",
//       });
//     }

//     // Find user and include password for comparison
//     const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid credentials",
//       });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid credentials",
//       });
//     }

//     // Check if account is active
//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         error: "Account has been deactivated",
//       });
//     }

//     // Generate tokens
//     const token = generateToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // Save refresh token
//     user.refreshToken = refreshToken;
//     user.lastSeen = new Date();
//     await user.save({ validateBeforeSave: false });

//     res.json({
//       success: true,
//       data: {
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           avatar: user.avatar,
//           bio: user.bio,
//         },
//         token,
//         refreshToken,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user with this refresh token
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }
    next(error);
  }
};

/**
 * @desc    Logout user / clear refresh token
 * @route   POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save({ validateBeforeSave: false });
    }
      res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};