const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  console.log('from app1')
  res.json({
    message: "App1 on!",
  });
});

app.listen(port, () => {
  console.log(`Secondary app running http://localhost:${port}`);
});