const express = require("express");
const http = require("http");
const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.json({
    message: "Main application on!",
  });
});

app.use("/app1", (req, res) => {
  proxyRequest(req, res, 3001);
});

function proxyRequest(req, res, targetPort) {
  console.log("proxy request");
  const options = {
    hostname: "localhost",
    port: targetPort,
    //    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };

  console.log("request", options);
  const proxy = http.request(options, (proxyRes) => {
    proxyRes.pipe(res, { end: true });
  });
  req.pipe(proxy, { end: true });
}

// Inicia el servidor en el puerto principal
app.listen(port, () => {
  console.log(`Main Server running http://localhost:${port}`);
});
