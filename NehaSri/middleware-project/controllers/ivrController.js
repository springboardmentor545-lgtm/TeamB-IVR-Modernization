const axios = require("axios");

exports.handleIVRRequest = async (req, res, next) => {
  try {
    let { sessionId, digit } = req.body;

    if (!sessionId || !digit) {
      return res.status(400).json({ error: "Missing sessionId or digit" });
    }

    digit = String(digit).trim();

    let response;

    if (digit === "1" || digit === "2") {
      response = await axios.post(`${process.env.ACS_URL}/process`, { sessionId, digit });
    } else if (digit === "3") {
      response = await axios.post(`${process.env.BAP_URL}/process`, { sessionId, digit });
    } else {
      return res.status(400).json({ error: "Invalid option selected" });
    }

    res.json({
      sessionId,
      response: response.data.message
    });

  } catch (err) {
    next(err); // pass error to global handler
  }
};
