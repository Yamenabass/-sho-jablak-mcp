import express from "express";

const app = express();
app.use(express.json());

// MCP Handshake Endpoint
app.post("/", (req, res) => {
  res.json({
    jsonrpc: "2.0",
    id: req.body.id,
    result: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      serverInfo: {
        name: "ShoJablak MCP",
        version: "1.0.0"
      }
    }
  });
});

// SSE Stream
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  res.write("event: message\n");
  res.write("data: MCP Server Connected\n\n");

  const interval = setInterval(() => {
    res.write("event: ping\n");
    res.write("data: keep alive\n\n");
  }, 10000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("MCP running on port " + PORT);
});
