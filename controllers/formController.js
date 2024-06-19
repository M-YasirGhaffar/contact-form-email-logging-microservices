const axios = require("axios");

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
    const response = await axios.post("http://localhost:3002/log-data", {
      email,
      ...data,
      ipAddress,
      userAgent,
      referer,
      headers,
      isEmailValid,
    });
    console.log("Save Result:", response.success);
  } catch (error) {
    console.error("Error validating email:", error);
    return res
      .status(500)
      .json({ message: "Error logging data into mongodb database" });
  }

  if (!isEmailValid) {
    return res.status(400).json({
      message: "Invalid email address",
      email,
      data,
    });
  }

  //   const adminEmailResult = await sendAdminEmail(
  //     email,
  //     data,
  //     ipAddress,
  //     userAgent,
  //     referer,
  //     headers
  //   );

  // Send Admin Email
  let adminEmailResult;
  try {
    adminEmailResult = await axios.post(
      "http://localhost:3003/send-admin-email",
      {
        email,
        data,
        ipAddress,
        userAgent,
        referer,
        headers,
      }
    );
  } catch (error) {
    console.error("Error sending admin email:", error);
    adminEmailResult = { data: { success: false, error: error.message } };
  }

  let autoReplyResult;
  try {
    autoReplyResult = await axios.post(
      "http://localhost:3003/send-auto-reply",
      { email }
    );
  } catch (error) {
    console.error("Error sending auto-reply email:", error);
    autoReplyResult = { data: { success: false, error: error.message } };
  }

  console.log("Admin Email Result:", adminEmailResult.data);
  console.log("Auto-reply Email Result:", autoReplyResult.data);

  if (autoReplyResult.data.success) {
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

  if (!adminEmailResult.data.success) {
    console.error("Error sending admin email:", adminEmailResult.data.error);
  }
};
