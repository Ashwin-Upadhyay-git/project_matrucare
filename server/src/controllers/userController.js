import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -otpHash');
  res.status(200).json({ success: true, user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 3 characters long.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim() },
      { new: true }
    ).select('-password -otpHash');

    res.status(200).json({ success: true, message: 'Profile updated.', user });
  } catch (error) {
    next(error);
  }
};
