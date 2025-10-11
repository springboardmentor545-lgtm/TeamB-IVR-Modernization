const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const ivrRoutes = require("./routes/ivrRoutes");
const acsRoutes = require("./routes/acsRoutes");
const bapRoutes = require("./routes/bapRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(bodyParser.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use("/ivr", ivrRoutes);
app.use("/acs", acsRoutes);
app.use("/bap", bapRoutes);
app.use("/conversation", conversationRoutes);

// Serve frontend on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Middleware running at http://localhost:${PORT}`);
  console.log(`🎨 Frontend available at http://localhost:${PORT}/`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/ivr/request`);
});
