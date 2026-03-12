const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("Press Ctrl+C to stop");
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer stopped');
  process.exit(0);
});
