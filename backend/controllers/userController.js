const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          profile: req.user.profile,
          isActive: req.user.isActive,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving profile'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profile } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          profile: updatedUser.profile,
          updatedAt: updatedUser.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    // Verify password before deletion
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Find user and verify password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Account deletion failed.'
      });
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Profile deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile
};
