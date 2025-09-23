// Enhanced Intent detection service using simple keyword-based NLU
function detectIntent(query) {
  if (!query || typeof query !== 'string') {
    return "UNKNOWN";
  }

  query = query.toLowerCase();
  
  // Check for balance-related keywords
  if (query.includes("balance") || query.includes("check") || query.includes("account") || 
      query.includes("money") || query.includes("show") || query.includes("much")) {
    return "ACS";
  }
  
  // Check for recharge-related keywords  
  if (query.includes("recharge") || query.includes("top") || query.includes("add") || 
      query.includes("reload") || query.includes("topup")) {
    return "ACS";
  }
  
  // Check for agent/support-related keywords
  if (query.includes("agent") || query.includes("support") || query.includes("help") || 
      query.includes("human") || query.includes("customer") || query.includes("talk") || 
      query.includes("speak") || query.includes("connect")) {
    return "BAP";
  }
  
  return "UNKNOWN";
}

// Enhanced intent detector class for backward compatibility
class IntentDetector {
  constructor() {
    this.intents = {
      balance_inquiry: {
        keywords: ['balance', 'check', 'account', 'money', 'show', 'what', 'much'],
        service: 'acs',
        digit: '1'
      },
      recharge_account: {
        keywords: ['recharge', 'top', 'up', 'add', 'money', 'reload', 'topup'],
        service: 'acs',
        digit: '2'
      },
      agent_support: {
        keywords: ['agent', 'support', 'help', 'human', 'customer', 'service', 'talk', 'speak', 'connect'],
        service: 'bap',
        digit: '3'
      }
    };
  }

  detectIntent(query) {
    if (!query || typeof query !== 'string') {
      return {
        intent: "unknown",
        service: "unknown", 
        digit: "0",
        confidence: 0.0
      };
    }

    // Use the simple detectIntent function first
    const simpleResult = detectIntent(query);
    
    if (simpleResult === "UNKNOWN") {
      return {
        intent: "unknown",
        service: "unknown",
        digit: "0", 
        confidence: 0.0
      };
    }

    // Map simple result to detailed response
    if (simpleResult === "ACS") {
      return this.determineACSIntent(query);
    } else if (simpleResult === "BAP") {
      return { 
        intent: "agent_support", 
        service: "bap", 
        digit: "3", 
        confidence: 0.9 
      };
    }

    // Fallback to unknown
    return {
      intent: "unknown",
      service: "unknown", 
      digit: "0",
      confidence: 0.0
    };
  }

  determineACSIntent(query) {
    query = query.toLowerCase();
    
    // Check for recharge-related keywords first (more specific)
    if (query.includes("recharge") || query.includes("topup") || query.includes("top up") || 
        query.includes("reload") || (query.includes("add") && query.includes("money"))) {
      return { 
        intent: "recharge_account", 
        service: "acs", 
        digit: "2", 
        confidence: 0.85 
      };
    }
    
    // Check for balance-related keywords
    if (query.includes("balance") || (query.includes("check") && !query.includes("recharge")) || 
        query.includes("show") || query.includes("much") || 
        (query.includes("account") && !query.includes("recharge"))) {
      return { 
        intent: "balance_inquiry", 
        service: "acs", 
        digit: "1", 
        confidence: 0.85 
      };
    }
    
    // If it's ACS but we can't determine specific intent, default to balance
    return { 
      intent: "balance_inquiry", 
      service: "acs", 
      digit: "1", 
      confidence: 0.7 
    };
  }

  getIntentMapping() {
    return this.intents;
  }
}

// Export both the simple function and the class
module.exports = {
  detectIntent,
  IntentDetector: new IntentDetector()
};