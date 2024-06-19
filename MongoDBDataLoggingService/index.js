require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world! This is MongoDB Data Logging Service.' });
});

app.post('/log-data', async (req, res) => {
    
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});