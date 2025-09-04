const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ivrRoutes = require("./routes/ivrRoutes");
const acsRoutes = require("./routes/acsRoutes");
const bapRoutes = require("./routes/bapRoutes");
const { errorHandler } = require("./utils/logger");

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Routes
app.use("/ivr", ivrRoutes);
app.use("/acs", acsRoutes);
app.use("/bap", bapRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Middleware running at http://localhost:${PORT}`);
});
