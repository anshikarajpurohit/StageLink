# StageLink — 2-Day Build Spec

## Models (Mongoose)

### User.js
```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['actor', 'theatre_group', 'audience'], default: 'audience' },
  city: String,
  bio: String,
  skills: [String],
  languages: [String],
  profilePic: String // just a URL
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
```

### Group.js
```js
const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  logoUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [String] // just names for now, keep simple
}, { timestamps: true });
module.exports = mongoose.model('Group', groupSchema);
```

### Event.js
```js
const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  date: { type: Date, required: true },
  time: String,
  venue: String,
  city: { type: String, required: true },
  ticketLink: String,
  posterUrl: String,
  description: String
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);
```

### RecruitmentPost.js
```js
const mongoose = require('mongoose');
const recruitmentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  role: { type: String, required: true },
  description: String,
  city: String,
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('RecruitmentPost', recruitmentSchema);
```

---

## Auth Routes (routes/auth.js)
```js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, city } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, city });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
```

## Auth Middleware (middleware/auth.js)
```js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};
```

## Event Routes (routes/events.js)
```js
const router = require('express').Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { city, date } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (date) filter.date = { $gte: new Date(date) };
  const events = await Event.find(filter).populate('group', 'name logoUrl').sort({ date: 1 });
  res.json(events);
});

router.post('/', auth, async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('group');
  res.json(event);
});

module.exports = router;
```

## Group Routes (routes/groups.js) — same CRUD pattern
```js
const router = require('express').Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const group = await Group.create({ ...req.body, owner: req.userId });
  res.status(201).json(group);
});

router.get('/', async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

router.get('/:id', async (req, res) => {
  const group = await Group.findById(req.params.id);
  res.json(group);
});

module.exports = router;
```

## Recruitment Routes (routes/recruitment.js)
```js
const router = require('express').Router();
const RecruitmentPost = require('../models/RecruitmentPost');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const post = await RecruitmentPost.create(req.body);
  res.status(201).json(post);
});

router.get('/', async (req, res) => {
  const posts = await RecruitmentPost.find().populate('group', 'name logoUrl');
  res.json(posts);
});

router.post('/:id/interest', auth, async (req, res) => {
  const post = await RecruitmentPost.findById(req.params.id);
  if (!post.interestedUsers.includes(req.userId)) {
    post.interestedUsers.push(req.userId);
    await post.save();
  }
  res.json(post);
});

module.exports = router;
```

## server.js
```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/recruitment', require('./routes/recruitment'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server on 5000')))
  .catch(err => console.log(err));
```

## .env
```
MONGO_URI=your_atlas_connection_string
JWT_SECRET=any_random_string_here
```

---

## Setup Checklist
1. `npm init -y` then `npm i express mongoose bcryptjs jsonwebtoken cors dotenv`
2. Create free MongoDB Atlas cluster → get connection string → paste in `.env`
3. Test every route in Postman/Thunder Client BEFORE building frontend
4. Frontend: `npx create-vite frontend --template react` + `npm i axios react-router-dom`
