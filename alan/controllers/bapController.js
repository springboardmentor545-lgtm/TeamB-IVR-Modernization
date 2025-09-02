const { processBAP } = require("../services/bapService");

exports.handleBAP = (req, res) => {
  let { sessionId, digit } = req.body;
  digit = String(digit).trim();
  const message = processBAP(digit);
  res.json({ sessionId, message });
};
