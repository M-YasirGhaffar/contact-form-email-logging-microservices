require('dotenv').config();
const axios = require("axios");

exports.submitForm = async (req, res) => {
  const { email, ...data } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get("User-Agent");
  const referer = req.get("Referer") || req.get("Referrer");
  const headers = req.headers;

  // Validate Email
  let isEmailValid;
  try {
    const response = await axios.post(`${process.env.VALIDEMAILSERVICE_BASE_URL}/validate-email`, {
      email,
    });
    isEmailValid = response.data.valid;
  } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({ message: "Error validating email at " + process.env.VALIDEMAILSERVICE_BASE_URL });
  }

  // Log Data
  let logDataResult;
  try {
    logDataResult = await axios.post(`${process.env.MONGODBDATALOGGINGSERVICE_BASE_URL}/log-data`, {
      email,
      data,
      ipAddress,
      userAgent,
      referer,
      headers,
      isEmailValid,
    });
    console.log("Save Result:", logDataResult.data.success);
  } catch (error) {
    console.error("Error logging data into MongoDB:", error);
    return res.status(500).json({ message: "Error logging data into MongoDB database" });
  }

  // If Email is Invalid
  if (!isEmailValid) {
    return res.status(400).json({
      message: "Invalid email address",
      email,
      data,
    });
  }

  // Send Admin Email
  let adminEmailResult;
  try {
    adminEmailResult = await axios.post(`${process.env.EMAILNOTIFICATIONSERVICE_BASE_URL}/send-admin-email`, {
      email,
      data,
      ipAddress,
      userAgent,
      referer,
      headers,
    });
  } catch (error) {
    console.error("Error sending admin email:", error);
    adminEmailResult = { data: { success: false, error: error.message } };
  }

  // Send Auto-Reply Email
  let autoReplyResult;
  try {
    autoReplyResult = await axios.post(`${process.env.EMAILNOTIFICATIONSERVICE_BASE_URL}/send-auto-reply`, { email });
  } catch (error) {
    console.error("Error sending auto-reply email:", error);
    autoReplyResult = { data: { success: false, error: error.message } };
  }

  // Log Email Results
  console.log("Admin Email Result:", adminEmailResult.data);
  console.log("Auto-reply Email Result:", autoReplyResult.data);

  // Respond to Client
  if (autoReplyResult.data.success) {
    res.status(200).json({
      message: "Form submitted and auto-reply email sent successfully",
      email,
      data,
    });
  } else {
    res.status(500).json({
      message: "Form submitted successfully, but failed to send auto-reply email",
      email,
      data,
    });
  }

  if (!adminEmailResult.data.success) {
    console.error("Error sending admin email:", adminEmailResult.data.error);
  }
};
