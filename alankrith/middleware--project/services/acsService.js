exports.processACS = (digit) => {
  if (digit === "1") {
    return "Your account balance is ₹500.";
  }
  if (digit === "2") {
    return "Your recharge has been processed successfully. ₹100 has been added to your account.";
  }
  return "ACS: Unknown request.";
};
