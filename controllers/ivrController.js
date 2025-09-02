const axios = require("axios");

exports.handleIVRRequest = async (req, res) => {
  let { sessionId, digit } = req.body;

  if (!sessionId || !digit) {
    return res.status(400).json({ error: "Missing sessionId or digit" });
  }

  // Force digit to string
  digit = String(digit).trim();

  try {
    let response;

    if (digit === "1" || digit === "2") {
      response = await axios.post("http://localhost:3000/acs/process", {
        sessionId,
        digit
      });
    } else if (digit === "3") {
      response = await axios.post("http://localhost:3000/bap/process", {
        sessionId,
        digit
      });
    } else {
      return res.status(400).json({ error: "Invalid option selected" });
    }

    return res.json({
      sessionId,
      response: response.data.message
    });

  } catch (err) {
    console.error("Middleware error:", err.message);
    return res.status(500).json({ error: "Failed to process request" });
  }
};
