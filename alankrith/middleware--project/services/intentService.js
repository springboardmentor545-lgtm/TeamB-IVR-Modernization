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
      return null;
    }

    // Use the simple detectIntent function first
    const simpleResult = detectIntent(query);
    
    if (simpleResult === "UNKNOWN") {
      return null;
    }

    // Map simple result to detailed response
    const serviceMap = {
      "ACS": this.determineACSIntent(query),
      "BAP": { intent: "agent_support", service: "bap", digit: "3" }
    };

    return serviceMap[simpleResult] || null;
  }

  determineACSIntent(query) {
    query = query.toLowerCase();
    // If it's balance-related, return balance intent
    if (query.includes("balance") || query.includes("check") || query.includes("show") || query.includes("much")) {
      return { intent: "balance_inquiry", service: "acs", digit: "1" };
    }
    // Otherwise, it's recharge-related
    return { intent: "recharge_account", service: "acs", digit: "2" };
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