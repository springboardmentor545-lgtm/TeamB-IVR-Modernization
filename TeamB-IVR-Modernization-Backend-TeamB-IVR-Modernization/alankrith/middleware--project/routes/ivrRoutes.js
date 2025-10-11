const express = require("express");
const { handleIVRRequest } = require("../controllers/ivrController");
const { handleConversation } = require("../controllers/conversationController");

const router = express.Router();
router.post("/request", handleIVRRequest);
router.post("/conversation", handleConversation);

module.exports = router;
