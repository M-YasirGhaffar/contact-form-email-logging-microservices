const axios = require('axios');
const FormSubmission = require('../models/formSubmission');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to validate email using Hunter API
async function validateEmail(email) {
    const apiKey = process.env.HUNTER_API_KEY; // Add your API key in .env file
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.data.status === 'valid';
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
}

// Function to save form submission to the database
async function saveFormSubmission(email, data, ipAddress, userAgent, referer, headers) {
    const newFormSubmission = new FormSubmission({ email, data, ipAddress, userAgent, referer, headers });

    try {
        await newFormSubmission.save();
        console.log('Form submission saved successfully');
        return { success: true };
    } catch (err) {
        console.error('Error saving form submission:', err);
        return { success: false, error: err };
    }
}

// Function to send admin email
async function sendAdminEmail(email, data, ipAddress, userAgent, referer, headers) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Form Submission',
        text: `You have received a new form submission.\nEmail: ${email}\nData: ${JSON.stringify(data)}\nIP Address: ${ipAddress}\nUser Agent: ${userAgent}\nReferer: ${referer}\nHeaders: ${JSON.stringify(headers)}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Admin email sent successfully');
        return { success: true };
    } catch (err) {
        console.error('Error sending email to admin:', err);
        return { success: false, error: err };
    }
}

// Function to send auto-reply email
async function sendAutoReply(email) {
    const autoReplyOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for your submission',
        text: `Hi, thank you for reaching out to us. We have received your message and will get back to you soon.`,
    };

    try {
        await transporter.sendMail(autoReplyOptions);
        console.log('Auto-reply email sent successfully');
        return { success: true };
    } catch (err) {
        console.error('Error sending auto-reply email:', err);
        return { success: false, error: err };
    }
}

exports.submitForm = async (req, res) => {
    const { email, ...data } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    const referer = req.get('Referer') || req.get('Referrer');
    const headers = req.headers;

    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Save the form submission to the database
    const saveResult = await saveFormSubmission(email, data, ipAddress, userAgent, referer, headers);

    // Send emails independently
    const adminEmailResult = await sendAdminEmail(email, data, ipAddress, userAgent, referer, headers);
    const autoReplyResult = await sendAutoReply(email);

    // Log the results
    console.log('Save Result:', saveResult);
    console.log('Admin Email Result:', adminEmailResult);
    console.log('Auto-reply Email Result:', autoReplyResult);

    // Respond to the user based on the auto-reply email status
    if (autoReplyResult.success) {
        res.status(200).json({
            message: 'Form submitted and auto-reply email sent successfully',
            email,
            data
        });
    } else {
        res.status(500).json({
            message: 'Form submitted successfully, but failed to send auto-reply email',
            email,
            data
        });
    }

    // Log details for debugging purposes
    if (!saveResult.success) {
        console.error('Error saving form submission:', saveResult.error);
    }
    if (!adminEmailResult.success) {
        console.error('Error sending admin email:', adminEmailResult.error);
    }
};