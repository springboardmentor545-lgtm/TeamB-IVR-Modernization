const express = require("express");
const { handleBAP } = require("../controllers/bapController");

const router = express.Router();
router.post("/process", handleBAP);

module.exports = router;
