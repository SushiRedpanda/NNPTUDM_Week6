const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

// simple async wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// create user
router.post('/', asyncHandler(async (req, res) => {
  const user = new User(req.body);
  const saved = await user.save();
  res.status(201).json(saved);
}));

// get all users (excluding soft-deleted)
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find({ isDeleted: false }).populate('role');
  res.json(users);
}));

// get user by id
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role');
  if (!user || user.isDeleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}));

// update user
router.put('/:id', asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('role');
  if (!user || user.isDeleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}));

// soft delete user
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted' });
}));

// enable user by email/username
router.post('/enable', asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username, isDeleted: false });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.status = true;
  await user.save();
  res.json({ message: 'User enabled', user });
}));

// disable user by email/username
router.post('/disable', asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username, isDeleted: false });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.status = false;
  await user.save();
  res.json({ message: 'User disabled', user });
}));

module.exports = router;