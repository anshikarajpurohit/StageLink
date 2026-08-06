const router = require('express').Router();
const Event = require('../models/Event');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { city, date, q } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (date) filter.date = { $gte: new Date(date) };
    
    if (q) {
      filter.title = new RegExp(q, 'i');
    }
    
    let events = await Event.find(filter).populate('group', 'name ownerId').sort({ date: 1 });
    
    if (q) {
      const allEvents = await Event.find().populate('group', 'name ownerId');
      const filteredByGroup = allEvents.filter(e => e.group && e.group.name.toLowerCase().includes(q.toLowerCase()));
      const eventIds = new Set(events.map(e => e._id.toString()));
      for (const e of filteredByGroup) {
        if (!eventIds.has(e._id.toString())) {
          events.push(e);
          eventIds.add(e._id.toString());
        }
      }
    }
    
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ ownerId: req.userId });
    if (!group) return res.status(403).json({ error: 'You do not own a theatre group' });

    req.body.group = group._id;
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('group');
    res.json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('group');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.group.ownerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await event.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
