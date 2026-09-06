with open('server.ts', 'r') as f:
    content = f.read()

import_statement = 'import { createClient } from "@supabase/supabase-js";\n'

new_endpoints = """
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
      
      // Create profile in public.profiles
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email,
          full_name,
          phone,
          address,
          role: role || 'customer'
        }]);
        
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
"""

# Insert import
content = content.replace('import { createServer as createViteServer } from "vite";', 'import { createServer as createViteServer } from "vite";\n' + import_statement)

# Insert endpoints before Vite middleware
content = content.replace('  // Vite middleware for development', new_endpoints + '\n  // Vite middleware for development')

with open('server.ts', 'w') as f:
    f.write(content)
