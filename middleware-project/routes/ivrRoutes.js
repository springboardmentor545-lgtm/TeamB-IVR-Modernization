const express = require("express");
const { handleIVRRequest } = require("../controllers/ivrController");

const router = express.Router();
router.post("/input", handleIVRRequest);

module.exports = router;

