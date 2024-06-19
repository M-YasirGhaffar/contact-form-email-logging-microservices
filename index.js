require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const formController = require('./controllers/formController');
const homeController = require('./controllers/homeController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', homeController.helloWorld);

app.post('/submit', formController.submitForm);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
