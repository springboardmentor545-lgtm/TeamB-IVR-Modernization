exports.processACS = (digit) => {
  if (digit === "1") {
    return "Your account balance is ₹500.";
  }
  if (digit === "2") {
    return "Your recharge has been processed successfully. ₹100 has been added to your account.";
  }
  if (digit === "3") {
    return "Your last transaction: ₹50 debited on Oct 3, 2025 for mobile recharge to +91-9876543210.";
  }
  if (digit === "4") {
    return "Loan Information: Personal loan amount ₹25,000 | Outstanding: ₹18,500 | Next EMI: ₹2,500 due on Oct 15, 2025.";
  }
  return "ACS: Unknown request.";
};
