const axios = require("axios");
const { IntentDetector } = require("../services/intentService");

exports.handleConversation = async (req, res) => {
  const { sessionId, query } = req.body;

  // Validate input
  if (!sessionId || !query) {
    return res.status(400).json({ 
      error: "Missing sessionId or query",
      required: ["sessionId", "query"]
    });
  }

  try {
    // Detect intent from natural language query
    const intentResult = IntentDetector.detectIntent(query);
    
    if (!intentResult) {
      return res.status(400).json({ 
        error: "Unable to understand your request",
        suggestion: "Try asking about 'check balance', 'recharge account', or 'talk to agent'"
      });
    }

    // Route to appropriate service based on detected intent
    let response;
    const serviceUrl = `http://localhost:3000/${intentResult.service}/process`;
    
    response = await axios.post(serviceUrl, {
      sessionId,
      digit: intentResult.digit
    });

    return res.json({
      sessionId,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      response: response.data.message
    });

  } catch (err) {
    console.error("Conversation middleware error:", err.message);
    return res.status(500).json({ 
      error: "Failed to process conversation request",
      details: err.message 
    });
  }
};