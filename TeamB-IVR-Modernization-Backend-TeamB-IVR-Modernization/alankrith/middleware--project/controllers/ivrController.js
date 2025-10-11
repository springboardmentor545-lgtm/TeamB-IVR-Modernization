const axios = require("axios");

exports.handleIVRRequest = async (req, res) => {
  let { sessionId, digit } = req.body;

  if (!sessionId || !digit) {
    return res.status(400).json({ error: "Missing sessionId or digit" });
  }

  // Force digit to string
  digit = String(digit).trim();

  try {
    // Special Case: Digit 9 to repeat the menu
    if (digit === "9") {
      const menu = "Press 1 for balance. 2 for recharge. 3 for last transaction. 4 for loan info. 5 for an agent. 6 to update details. 7 to cancel. 9 to repeat this menu.";
      return res.json({
        sessionId,
        response: menu
      });
    }

    const acsDigits = ["1", "2", "3", "4"];
    const bapDigits = ["5", "6", "7"];

    let response;

    if (acsDigits.includes(digit)) {
      response = await axios.post("http://localhost:3000/acs/process", {
        sessionId,
        digit
      });
    } else if (bapDigits.includes(digit)) {
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
