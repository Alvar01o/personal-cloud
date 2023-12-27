const express = require("express");
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  console.log('from app1')
  res.json({
    message: "App1 on!",
  });
});
// Inicia el servidor en el puerto principal
app.listen(port, () => {
  console.log(`Secondary app running http://localhost:${port}`);
});