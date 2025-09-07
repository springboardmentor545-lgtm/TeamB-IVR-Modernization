const express = require("express");
const { processBAP } = require("../controllers/bapController");

const router = express.Router();
router.post("/process", processBAP);

module.exports = router;
