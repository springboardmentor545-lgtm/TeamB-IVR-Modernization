exports.processACS = (digit) => {
  if (digit === "1") return "ACS: Your account balance is $500.";
  if (digit === "2") return "ACS: Recharge processed successfully.";
  return "ACS: Unknown request.";
};
