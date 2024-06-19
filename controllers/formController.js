const axios = require("axios");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAdminEmail(
  email,
  data,
  ipAddress,
  userAgent,
  referer,
  headers
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Form Submission",
    text: `You have received a new form submission.\nEmail: ${email}\nData: ${JSON.stringify(
      data
    )}\nIP Address: ${ipAddress}\nUser Agent: ${userAgent}\nReferer: ${referer}\nHeaders: ${JSON.stringify(
      headers
    )}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin email sent successfully");
    return { success: true };
  } catch (err) {
    console.error("Error sending email to admin:", err);
    return { success: false, error: err };
  }
}

async function sendAutoReply(email) {
  const autoReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for your submission",
    text: `Hi, thank you for reaching out to us. We have received your message and will get back to you soon.`,
  };

  try {
    await transporter.sendMail(autoReplyOptions);
    console.log("Auto-reply email sent successfully");
    return { success: true };
  } catch (err) {
    console.error("Error sending auto-reply email:", err);
    return { success: false, error: err };
  }
}

exports.submitForm = async (req, res) => {
  const { email, ...data } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get("User-Agent");
  const referer = req.get("Referer") || req.get("Referrer");
  const headers = req.headers;

  let isEmailValid;
  try {
    const response = await axios.post("http://localhost:3001/validate-email", {
      email,
    });
    isEmailValid = response.data.valid;
  } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({ message: "Error validating email" });
  }

  try {
    const response = await axios.post("http://localhost:3002/log-data", {email, ...data, ipAddress, userAgent, referer, headers, isEmailValid});
     console.log("Save Result:", response.success);
    } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({ message: "Error logging data into mongodb database" });
  }

  if (!isEmailValid) {
    return res.status(400).json({
      message: "Invalid email address",
      email,
      data,
    });
  }

  const adminEmailResult = await sendAdminEmail(
    email,
    data,
    ipAddress,
    userAgent,
    referer,
    headers
  );
  const autoReplyResult = await sendAutoReply(email);

  console.log("Admin Email Result:", adminEmailResult);
  console.log("Auto-reply Email Result:", autoReplyResult);

  if (autoReplyResult.success) {
    res.status(200).json({
      message: "Form submitted and auto-reply email sent successfully",
      email,
      data,
    });
  } else {
    res.status(500).json({
      message:
        "Form submitted successfully, but failed to send auto-reply email",
      email,
      data,
    });
  }

  if (!saveResult.success) {
    console.error("Error saving form submission:", saveResult.error);
  }
  if (!adminEmailResult.success) {
    console.error("Error sending admin email:", adminEmailResult.error);
  }
};
