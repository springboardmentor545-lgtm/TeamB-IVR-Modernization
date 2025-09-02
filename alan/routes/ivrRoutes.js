const express = require("express");
const { handleIVRRequest } = require("../controllers/ivrController");

const router = express.Router();
router.post("/request", handleIVRRequest);

module.exports = router;
