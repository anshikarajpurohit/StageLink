require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/recruitment', require('./routes/recruitment'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5001, () => console.log('Server on 5001')))
  .catch(err => console.log(err));
