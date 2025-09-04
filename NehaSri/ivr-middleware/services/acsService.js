exports.handleACSLogic = (digit) => {
  if (digit === "1") return "Your account balance is $500";
  if (digit === "2") return "Transferring you to an agent";
  return "Unknown ACS option selected";
};
