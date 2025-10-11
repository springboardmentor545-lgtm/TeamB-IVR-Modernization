exports.processBAP = (digit) => {
  if (digit === "5") {
    return "Connecting you to a live agent. Please hold while we transfer your call. Your estimated wait time is 2 minutes.";
  }
  if (digit === "6") {
    return "Account details update: Please provide your new information. You can update your name, address, email, or phone number.";
  }
  if (digit === "7") {
    return "Action cancelled successfully. Your transaction has been terminated. You will be redirected to the main menu.";
  }
  return "BAP: Unknown request.";
};
