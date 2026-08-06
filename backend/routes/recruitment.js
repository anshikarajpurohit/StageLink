const router = require('express').Router();
const RecruitmentPost = require('../models/RecruitmentPost');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ ownerId: req.userId });
    if (!group) return res.status(403).json({ error: 'You do not own a theatre group' });

    req.body.group = group._id;
    const post = await RecruitmentPost.create(req.body);
    res.status(201).json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const posts = await RecruitmentPost.find()
      .populate('group', 'name ownerId')
      .populate('interestedUsers', 'name _id');
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/interest', auth, async (req, res) => {
  try {
    const post = await RecruitmentPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.interestedUsers.includes(req.userId)) {
      post.interestedUsers.push(req.userId);
      await post.save();
    }
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await RecruitmentPost.findById(req.params.id).populate('group');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.group.ownerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
