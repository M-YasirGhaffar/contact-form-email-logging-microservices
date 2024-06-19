require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const FormSubmission = require('./models/formSubmission');

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
    const { email,  isEmailValid , ...data } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    const referer = req.get('Referer') || req.get('Referrer');
    const headers = req.headers;
    
    const formSubmission = new FormSubmission({
        email,
        data,
        ipAddress,
        userAgent,
        referer,
        headers,
        validEmail: isEmailValid,
    });
    
    try {
        await formSubmission.save();
        res.json({ message: 'Data logged successfully', success: true});
    } catch (error) {
        console.error('Error logging data:', error);
        res.status(500).json({ message: 'Error logging data' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});