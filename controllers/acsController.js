const { processACS } = require("../services/acsService");

exports.handleACS = (req, res) => {
  let { sessionId, digit } = req.body;
  digit = String(digit).trim();
  const message = processACS(digit);
  res.json({ sessionId, message });
};
