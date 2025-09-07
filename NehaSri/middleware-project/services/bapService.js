exports.handleBAPLogic = (digit) => {
  if (digit === "3") return "Payment service is currently active";
  return "Unknown BAP option selected";
};
