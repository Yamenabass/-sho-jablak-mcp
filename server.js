import express from "express";

const app = express();
app.use(express.json());

// MCP Protocol
app.post("/", (req, res) => {

  const { method, id } = req.body;

  // Handshake
  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "ShoJablak MCP",
          version: "1.0.0"
        }
      }
    });
  }

  // Tools List (THIS WAS MISSING)
  if (method === "tools/list") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "authUser",
            description: "Authenticate user",
            inputSchema: {
              type: "object",
              properties: {
                phone: { type: "string" },
                password: { type: "string" }
              },
              required: ["phone", "password"]
            }
          }
        ]
      }
    });
  }

  res.json({
    jsonrpc: "2.0",
    id,
    result: {}
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
