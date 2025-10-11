//Intent detection service using keyword-based NLU
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
  
  // Check for last transaction keywords
  if (query.includes("last") || query.includes("transaction") || query.includes("recent") || 
      query.includes("history") || query.includes("previous") || query.includes("latest")) {
    return "ACS";
  }
  
  // Check for loan-related keywords
  if (query.includes("loan") || query.includes("credit") || query.includes("borrow") || 
      query.includes("advance") || query.includes("emi") || query.includes("installment")) {
    return "ACS";
  }
  
  // Check for agent/support-related keywords
  if (query.includes("agent") || query.includes("support") || query.includes("help") || 
      query.includes("human") || query.includes("customer") || query.includes("talk") || 
      query.includes("speak") || query.includes("connect")) {
    return "BAP";
  }
  
  // Check for update details keywords
  if (query.includes("update") || query.includes("change") || query.includes("modify") || 
      query.includes("edit") || query.includes("details") || query.includes("profile")) {
    return "BAP";
  }
  
  // Check for cancel action keywords
  if (query.includes("cancel") || query.includes("stop") || query.includes("quit") || 
      query.includes("exit") || query.includes("abort") || query.includes("terminate")) {
    return "BAP";
  }
  
  return "UNKNOWN";
}

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
      last_transaction: {
        keywords: ['last', 'transaction', 'recent', 'history', 'previous', 'latest'],
        service: 'acs',
        digit: '3'
      },
      loan_info: {
        keywords: ['loan', 'credit', 'borrow', 'advance', 'emi', 'installment'],
        service: 'acs',
        digit: '4'
      },
      agent_support: {
        keywords: ['agent', 'support', 'help', 'human', 'customer', 'service', 'talk', 'speak', 'connect'],
        service: 'bap',
        digit: '5'
      },
      update_details: {
        keywords: ['update', 'change', 'modify', 'edit', 'details', 'profile', 'information'],
        service: 'bap',
        digit: '6'
      },
      cancel_action: {
        keywords: ['cancel', 'stop', 'quit', 'exit', 'abort', 'terminate'],
        service: 'bap',
        digit: '7'
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
      return this.determineBAPIntent(query);
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
    
    // Check for last transaction keywords (but not if it's a cancel request)
    if ((query.includes("last") || query.includes("transaction") || query.includes("recent") || 
        query.includes("history") || query.includes("previous") || query.includes("latest")) &&
        !query.includes("cancel")) {
      return { 
        intent: "last_transaction", 
        service: "acs", 
        digit: "3", 
        confidence: 0.85 
      };
    }
    
    // Check for loan-related keywords
    if (query.includes("loan") || query.includes("credit") || query.includes("borrow") || 
        query.includes("advance") || query.includes("emi") || query.includes("installment")) {
      return { 
        intent: "loan_info", 
        service: "acs", 
        digit: "4", 
        confidence: 0.85 
      };
    }
    
    // Check for balance-related keywords
    if (query.includes("balance") || (query.includes("check") && !query.includes("recharge")) || 
        query.includes("show") || query.includes("much") || 
        (query.includes("account") && !query.includes("recharge") && !query.includes("edit") && !query.includes("update"))) {
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

  determineBAPIntent(query) {
    query = query.toLowerCase();
    
    // Check for cancel action keywords first (highest priority for BAP)
    if (query.includes("cancel") || query.includes("stop") || query.includes("quit") || 
        query.includes("exit") || query.includes("abort") || query.includes("terminate")) {
      return { 
        intent: "cancel_action", 
        service: "bap", 
        digit: "7", 
        confidence: 0.85 
      };
    }
    
    // Check for update details keywords
    if (query.includes("update") || query.includes("change") || query.includes("modify") || 
        query.includes("edit") || query.includes("details") || query.includes("profile")) {
      return { 
        intent: "update_details", 
        service: "bap", 
        digit: "6", 
        confidence: 0.85 
      };
    }
    
    // Default to agent support for BAP
    return { 
      intent: "agent_support", 
      service: "bap", 
      digit: "5", 
      confidence: 0.85 
    };
  }

  getIntentMapping() {
    return this.intents;
  }
}

module.exports = {
  detectIntent,
  IntentDetector: new IntentDetector()
};