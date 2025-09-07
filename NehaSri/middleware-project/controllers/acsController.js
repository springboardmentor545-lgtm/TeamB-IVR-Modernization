const acsService = require("../services/acsService");

exports.processACS = (req, res) => {
  const { sessionId, digit } = req.body;
  const message = acsService.handleACSLogic(digit);

  res.json({ sessionId, message });
};
