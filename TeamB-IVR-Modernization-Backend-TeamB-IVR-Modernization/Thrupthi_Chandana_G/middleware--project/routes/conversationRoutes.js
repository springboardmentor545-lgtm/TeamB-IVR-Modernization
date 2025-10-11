const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// POST Handle natural language conversation
router.post("/process", conversationController.handleConversation);

module.exports = router;