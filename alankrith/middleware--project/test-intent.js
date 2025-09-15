
const { detectIntent, IntentDetector } = require('./services/intentService');

console.log('=== Testing Simple Intent Detection Function ===');
console.log('detectIntent("check balance"):', detectIntent("check balance"));
console.log('detectIntent("recharge account"):', detectIntent("recharge account"));
console.log('detectIntent("talk to agent"):', detectIntent("talk to agent"));
console.log('detectIntent("weather today"):', detectIntent("weather today"));

console.log('\n=== Testing Enhanced Intent Detector Class ===');
console.log('IntentDetector.detectIntent("check balance"):', IntentDetector.detectIntent("check balance"));
console.log('IntentDetector.detectIntent("recharge account"):', IntentDetector.detectIntent("recharge account"));
console.log('IntentDetector.detectIntent("I need help"):', IntentDetector.detectIntent("I need help"));
console.log('IntentDetector.detectIntent("what is weather"):', IntentDetector.detectIntent("what is weather"));

console.log('\n=== Testing Various Phrases ===');
const testPhrases = [
  "What's my account balance?",
  "I want to recharge my phone",
  "Can I talk to customer support?",
  "Show me my balance please",
  "Top up my account",
  "Connect me to an agent",
  "How much money do I have?",
  "Add money to my account",
  "I need human assistance"
];

testPhrases.forEach(phrase => {
  const result = IntentDetector.detectIntent(phrase);
  console.log(`"${phrase}" -> ${result ? result.service.toUpperCase() + ' (' + result.intent + ')' : 'UNKNOWN'}`);
});