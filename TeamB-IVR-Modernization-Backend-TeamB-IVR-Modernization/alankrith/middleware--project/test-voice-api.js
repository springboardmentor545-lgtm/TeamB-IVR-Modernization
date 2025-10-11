const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test conversation endpoint with voice-like queries
const voiceTestCases = [
  {
    query: "check my account balance",
    description: "Voice command for balance inquiry"
  },
  {
    query: "I want to recharge my phone",
    description: "Voice command for recharge"
  },
  {
    query: "show me my last transaction",
    description: "Voice command for transaction history"
  },
  {
    query: "tell me about my loan",
    description: "Voice command for loan information"
  },
  {
    query: "I need to talk to an agent",
    description: "Voice command for agent support"
  },
  {
    query: "I want to update my details",
    description: "Voice command for updating details"
  },
  {
    query: "cancel everything",
    description: "Voice command for cancellation"
  },
  {
    query: "what's the weather like today",
    description: "Unknown voice command (should be handled gracefully)"
  }
];

async function testVoiceConversationAPI() {
  console.log('🎤 === TESTING VOICE CONVERSATION API ===\n');
  
  for (const testCase of voiceTestCases) {
    try {
      console.log(`🗣️  Testing: "${testCase.query}"`);
      console.log(`📝 Description: ${testCase.description}`);
      
      const response = await axios.post(`${BASE_URL}/conversation/process`, {
        sessionId: `voice-test-${Date.now()}`,
        query: testCase.query
      });
      
      console.log(`✅ Intent: ${response.data.intent}`);
      console.log(`🎯 Confidence: ${response.data.confidence}`);
      console.log(`📋 Response: ${response.data.response}`);
      console.log('─'.repeat(60));
      
    } catch (error) {
      console.log(`❌ Error testing "${testCase.query}":`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data.error || error.response.data}`);
      } else {
        console.log(`   Network Error: ${error.message}`);
      }
      console.log('─'.repeat(60));
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/`);
    return true;
  } catch (error) {
    return false;
  }
}

async function runTests() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running at http://localhost:3000');
    console.log('Please start the server first: node index.js');
    return;
  }
  
  console.log('✅ Server is running at http://localhost:3000\n');
  await testVoiceConversationAPI();
  
  console.log('\n🎯 === VOICE FRONTEND INSTRUCTIONS ===');
  console.log('1. Open http://localhost:3000 in Chrome or Edge');
  console.log('2. Click the green 🎤 Voice Command button');
  console.log('3. Speak one of the test phrases above');
  console.log('4. Wait 4 seconds for processing');
  console.log('5. See the result displayed on screen');
  console.log('\n📱 Voice commands work best with:');
  console.log('- "Check my balance"');
  console.log('- "Recharge my account"');
  console.log('- "Show last transaction"');
  console.log('- "Tell me about loan"');
  console.log('- "I need an agent"');
  console.log('- "Update my details"');
  console.log('- "Cancel everything"');
}

runTests().catch(console.error);