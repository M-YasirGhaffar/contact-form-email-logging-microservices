require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world! This is Email Verification Service.' });
});

app.post('/validate-email', async (req, res) => {
    const { email } = req.body;
    const apiKey = process.env.HUNTER_API_KEY;
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    if (!email) {
        return res.status(400).json({ valid: false, error: 'Email is required' });
    }
    try {
        const response = await axios.get(url);
        const data = response.data;
        const isValid = data.data.status === 'valid';
        return res.json({ valid: isValid });
    } catch (error) {
        console.error('Error validating email:', error);
        return res.status(500).json({ valid: false, error: 'Error validating email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});