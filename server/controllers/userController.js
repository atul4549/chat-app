import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Search users by name, email, or uniqueId
 * GET /api/users/search?q=query&page=1&limit=20
 */
export const searchUsers = async (req, res) => {
  try {
    const { 
      q: searchQuery, 
      page = 1, 
      limit = 20,
      excludeCurrentUser = true 
    } = req.query;
    console.log(req.query)    
    // Validate search query
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }
    
    // Sanitize and prepare search query
    const sanitizedQuery = searchQuery.trim().toLowerCase();
    
    // Build search conditions
    const searchConditions = {
      $or: [
        { name: { $regex: sanitizedQuery, $options: 'i' } },
        { email: { $regex: sanitizedQuery, $options: 'i' } },
        { uniqueId: { $regex: sanitizedQuery, $options: 'i' } },
      ]
    };
    
    // Exclude current user if requested
    if (excludeCurrentUser === 'true' && req.user?._id) {
      searchConditions._id = { $ne: req.user._id };
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute search with pagination
    const [users, totalCount] = await Promise.all([
      User.find(searchConditions)
        .select('-password -__v')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(searchConditions)
    ]);
    
    // Get online statuses from socket.io or Redis
    const onlineUserIds = req.onlineUsers || []; // This should come from your socket/redis store
    
    // Add online status to users
    const usersWithStatus = users.map(user => ({
      ...user,
      isOnline: onlineUserIds.includes(user._id.toString()),
      isFollowed: false, // You can implement follow system if needed
    }));
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    res.status(200).json({
      success: true,
      data: usersWithStatus,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
      searchQuery: sanitizedQuery,
    });
    
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get user by ID
 * GET /api/users/:userId
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    
    const user = await User.findById(userId).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

/**
 * Get multiple users by IDs
 * POST /api/users/batch
 */
export const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required',
      });
    }
    
    const users = await User.find({
      _id: { $in: userIds }
    }).select('-password -__v');
    
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Batch get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

/**
 * Get suggested users (for empty search state)
 * GET /api/users/suggestions?limit=10
 */
export const getSuggestedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get random users excluding current user
    const suggestions = await User.aggregate([
      { $match: { _id: { $ne: req.user?._id } } },
      { $sample: { size: limit } },
      { $project: { password: 0, __v: 0 } }
    ]);
    
    const onlineUserIds = req.onlineUsers || [];
    const suggestionsWithStatus = suggestions.map(user => ({
      ...user,
      isOnline: onlineUserIds.includes(user._id.toString()),
    }));
    
    res.status(200).json({
      success: true,
      data: suggestionsWithStatus,
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
    });
  }
};