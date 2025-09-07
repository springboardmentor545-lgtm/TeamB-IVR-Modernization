const bapService = require("../services/bapService");

exports.processBAP = (req, res) => {
  const { sessionId, digit } = req.body;
  const message = bapService.handleBAPLogic(digit);

  res.json({ sessionId, message });
};
