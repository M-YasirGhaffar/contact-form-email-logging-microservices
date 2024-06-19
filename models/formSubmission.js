const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    referer: { type: String },
    headers: { type: mongoose.Schema.Types.Mixed },
    validEmail: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
