const router = require('express').Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    
    if (!group.followers) group.followers = [];
    
    const index = group.followers.indexOf(req.userId);
    if (index === -1) {
      group.followers.push(req.userId);
    } else {
      group.followers.splice(index, 1);
    }
    await group.save();
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.ownerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    group.description = req.body.description;
    group.members = req.body.members;
    await group.save();
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
