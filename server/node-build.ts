import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import express from "express";

// __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the main server (Express + WebSocket included)
const server = createServer(); // this should return `http.createServer(app)` from index.ts
const app = server._events.request as express.Application;
const port = process.env.PORT || 3000;

// Serve frontend static files
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));

// Serve index.html for React Router (non-API routes)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
server.listen(port, () => {
  console.log(`✅ App + WebSocket listening on port ${port}`);
  console.log(`🌐 Frontend: http://localhost:${port}`);
  console.log(`📡 WS Endpoint: ws://localhost:${port}/ws/chat`);
});
