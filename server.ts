import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for logging login events
  app.post("/api/log-login", (req, res) => {
    try {
      const { email, role, timestamp, ip, userAgent } = req.body;
      const logEntry = `[${timestamp}] - User: ${email} | Role: ${role} | IP: ${ip || 'N/A'} | UserAgent: ${userAgent || 'N/A'}\n`;
      
      const logFilePath = path.join(process.cwd(), "login_logs.txt");
      fs.appendFileSync(logFilePath, logEntry, "utf8");
      
      res.json({ success: true, message: "Log saved successfully" });
    } catch (error) {
      console.error("Error writing to log file:", error);
      res.status(500).json({ success: false, error: "Failed to write log" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
