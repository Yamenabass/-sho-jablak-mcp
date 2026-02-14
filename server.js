import express from "express";

const app = express();

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("event: message\n");
  res.write(`data: MCP Server Connected\n\n`);
});

app.listen(3000, () => {
  console.log("MCP running on port 3000");
});
