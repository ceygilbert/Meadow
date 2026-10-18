import "dotenv/config";
if (process.env.DB_PORT === "3006") {
  process.env.DB_PORT = "3306";
}
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { testDbConnection } from "./server/db";
import { authRouter } from "./server/auth";
import { uploadRouter } from "./server/upload";
import { apiRouter } from "./server/api";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Test MySQL/MariaDB connection if configured
  await testDbConnection();

  app.use(express.json());

  // Serve uploaded images statically
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // Mount API Routers
  app.use("/api/auth", authRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api", apiRouter);

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


  // API Route for admin to create user in Auth
  app.post("/api/admin/create-user", async (req, res) => {
    try {
      const { email, password, full_name, phone, role, address } = req.body;
      
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseServiceKey) {
        return res.status(500).json({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Please add it to your .env file." });
      }
      
      if (!supabaseUrl) {
         return res.status(500).json({ success: false, error: "Supabase URL is not configured." });
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      
      // Create user in Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          phone,
        }
      });
      
      if (authError) throw authError;
      
      // Create or update profile in public.profiles
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert([{
          id: authData.user.id,
          email,
          full_name,
          phone,
          address,
          role: role || 'customer'
        }], { onConflict: 'id' });
        
      if (profileError) throw profileError;
      
      res.json({ success: true, user: authData.user });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // API Route for admin to update user
  app.post("/api/admin/update-user", async (req, res) => {
    try {
      const { id, email, password, full_name, phone, role, address } = req.body;
      
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseServiceKey) {
        return res.status(500).json({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Please add it to your .env file." });
      }
      
      if (!supabaseUrl) {
         return res.status(500).json({ success: false, error: "Supabase URL is not configured." });
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      
      // Update Auth if password provided
      if (password && password.trim() !== '') {
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          password,
        });
        if (authError) throw authError;
      }
      
      // Update profile
      const updateData: any = { full_name, phone, role };
      if (address !== undefined) updateData.address = address;
      
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', id);
        
      if (profileError) throw profileError;
      
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
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
