const express = require("express");
const { processACS } = require("../controllers/acsController");

const router = express.Router();
router.post("/process", processACS);

module.exports = router;
