const express = require("express");
const { handleACS } = require("../controllers/acsController");

const router = express.Router();
router.post("/process", handleACS);

module.exports = router;
