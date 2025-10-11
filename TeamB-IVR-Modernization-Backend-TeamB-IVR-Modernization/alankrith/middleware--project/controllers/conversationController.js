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
    
    console.log("Intent detection result:", intentResult);
    
    if (!intentResult || intentResult.service === "unknown") {
      return res.json({ 
        sessionId,
        intent: "unknown",
        confidence: 0.0,
        response: "Sorry, I didn't understand your request. Please try asking about 'check balance', 'recharge account', or 'talk to agent'."
      });
    }

    
    if (intentResult.service !== "acs" && intentResult.service !== "bap") {
      return res.json({ 
        sessionId,
        intent: "unknown",
        confidence: 0.0,
        response: "Sorry, I didn't understand your request. Please try asking about 'check balance', 'recharge account', or 'talk to agent'."
      });
    }

    let response;
    const serviceUrl = `http://localhost:3000/${intentResult.service}/process`;
    
    console.log(`Calling service: ${serviceUrl} with digit: ${intentResult.digit}`);
    
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
    console.error("Full error:", err);
    return res.status(500).json({ 
      error: "Failed to process conversation request",
      details: err.message 
    });
  }
};