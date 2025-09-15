exports.processBAP = (digit) => {
  if (digit === "3") {
    return "Connecting you to a live agent. Please hold while we transfer your call. Your estimated wait time is 2 minutes.";
  }
  return "BAP: Unknown request.";
};
