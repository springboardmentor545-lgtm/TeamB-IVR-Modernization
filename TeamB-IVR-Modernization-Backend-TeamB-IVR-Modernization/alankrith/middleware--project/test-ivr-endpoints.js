const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data for all digits
const testCases = [
  { digit: '1', service: 'ACS', description: 'Balance Inquiry' },
  { digit: '2', service: 'ACS', description: 'Recharge Account' },
  { digit: '3', service: 'ACS', description: 'Last Transaction' },
  { digit: '4', service: 'ACS', description: 'Loan Information' },
  { digit: '5', service: 'BAP', description: 'Agent Support' },
  { digit: '6', service: 'BAP', description: 'Update Details' },
  { digit: '7', service: 'BAP', description: 'Cancel Action' },
  { digit: '9', service: 'IVR', description: 'Repeat Menu' }
];

async function testIVREndpoint() {
  console.log('🧪 === TESTING IVR ENDPOINT ===\n');
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing Digit ${testCase.digit} - ${testCase.description} (${testCase.service})`);
      
      const response = await axios.post(`${BASE_URL}/ivr/request`, {
        sessionId: `test-session-${Date.now()}`,
        digit: testCase.digit
      });
      
      console.log(`✅ Success: ${response.data.response}`);
      console.log('---');
      
    } catch (error) {
      console.log(`❌ Error for digit ${testCase.digit}:`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data.error || error.response.data}`);
      } else {
        console.log(`   Network Error: ${error.message}`);
      }
      console.log('---');
    }
  }
  
  // Test invalid digit
  try {
    console.log('Testing Invalid Digit 8');
    const response = await axios.post(`${BASE_URL}/ivr/request`, {
      sessionId: `test-session-${Date.now()}`,
      digit: '8'
    });
    console.log(`Unexpected success: ${response.data.response}`);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`✅ Correctly rejected invalid digit: ${error.response.data.error}`);
    } else {
      console.log(`❌ Unexpected error: ${error.message}`);
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
  await testIVREndpoint();
}

runTests().catch(console.error);