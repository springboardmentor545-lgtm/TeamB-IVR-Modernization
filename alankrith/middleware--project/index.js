const express = require("express");
const bodyParser = require("body-parser");

const ivrRoutes = require("./routes/ivrRoutes");
const acsRoutes = require("./routes/acsRoutes");
const bapRoutes = require("./routes/bapRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/ivr", ivrRoutes);
app.use("/acs", acsRoutes);
app.use("/bap", bapRoutes);
app.use("/conversation", conversationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Middleware running at http://localhost:${PORT}`);
});
