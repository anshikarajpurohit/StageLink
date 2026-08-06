const router = require('express').Router();
const User = require('../models/User');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.get('/actors', async (req, res) => {
  try {
    const actors = await User.find({ role: 'actor' }).select('-password');
    res.json(actors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });

    let group = null;
    let events = [];
    let recruitmentPosts = [];
    
    if (user.role === 'theatre_group') {
      group = await Group.findOne({ ownerId: user._id });
      if (group) {
        const Event = require('../models/Event');
        const RecruitmentPost = require('../models/RecruitmentPost');
        events = await Event.find({ group: group._id }).sort({ date: -1 });
        recruitmentPosts = await RecruitmentPost.find({ group: group._id })
          .populate('interestedUsers', 'name city _id')
          .sort({ createdAt: -1 });
      }
    } else if (user.role === 'actor') {
      const RecruitmentPost = require('../models/RecruitmentPost');
      recruitmentPosts = await RecruitmentPost.find({ interestedUsers: user._id })
        .populate('group', 'name')
        .sort({ createdAt: -1 });
    }
    
    res.json({ user, group, events, recruitmentPosts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
