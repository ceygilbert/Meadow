import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { query, execute, isMysqlConfigured } from './db';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'meadow-it-secure-secret-key-2026';

// Optional Supabase client fallback to automatically verify passwords and migrate them to MySQL bcrypt
const sbUrl = process.env.SUPABASE_URL || 'https://ecscjefihrntuhumtqwe.supabase.co';
const sbKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc2NqZWZpaHJudHVodW10cXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjE0NDQsImV4cCI6MjEwNTA5NzQ0NH0.e5O14flqHFoue0297dp6JXmAAmDbrpkMp7-M66RE3k8';
const sbClient = sbUrl && sbKey ? createClient(sbUrl, sbKey) : null;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone, address, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isMysqlConfigured()) {
      return res.status(503).json({ error: 'MySQL database not configured on server' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUsers = await query<any>('SELECT id FROM profiles WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const assignedRole = role === 'admin' || role === 'superadmin' ? role : 'customer';

    await execute(
      `INSERT INTO profiles (id, email, password_hash, full_name, phone, address, role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        cleanEmail,
        hashedPassword,
        full_name || '',
        phone || '',
        address || '',
        assignedRole,
      ]
    );

    const userObj = {
      id: userId,
      email: cleanEmail,
      role: assignedRole,
      full_name: full_name || '',
      phone: phone || '',
      address: address || '',
    };

    const token = jwt.sign(
      { id: userId, email: userObj.email, role: assignedRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: userObj,
      session: {
        access_token: token,
        token_type: 'bearer',
        expires_in: 604800,
        user: userObj,
      },
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    let msg = err.message || 'Failed to register account';
    if (err.code === 'ETIMEDOUT' || msg.includes('ETIMEDOUT')) {
      msg = 'Database connection timed out. Please check Hostinger Remote MySQL settings and port 3306.';
    }
    res.status(500).json({ error: msg });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isMysqlConfigured()) {
      return res.status(503).json({ error: 'MySQL database not configured on server' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = await query<any>(
      'SELECT id, email, password_hash, full_name, phone, address, avatar_url, role FROM profiles WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (users.length === 0) {
      // If user profile is not found in MySQL, check if user exists in Supabase
      if (sbClient) {
        try {
          const { data: sbData, error: sbError } = await sbClient.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!sbError && sbData?.user) {
            // Provision user in MySQL with this password
            const newHash = await bcrypt.hash(password, 10);
            const newId = sbData.user.id || uuidv4();
            const userRole = cleanEmail.includes('admin') ? 'admin' : 'customer';

            await execute(
              `INSERT INTO profiles (id, email, password_hash, full_name, role, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())
               ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
              [newId, cleanEmail, newHash, sbData.user.user_metadata?.full_name || '', userRole]
            );

            const newUserObj = {
              id: newId,
              email: cleanEmail,
              role: userRole,
              full_name: sbData.user.user_metadata?.full_name || '',
              phone: '',
              address: '',
              avatar_url: '',
            };

            const token = jwt.sign(
              { id: newId, email: cleanEmail, role: userRole },
              JWT_SECRET,
              { expiresIn: '7d' }
            );

            return res.json({
              success: true,
              user: newUserObj,
              session: {
                access_token: token,
                token_type: 'bearer',
                expires_in: 604800,
                user: newUserObj,
              },
            });
          }
        } catch (sbErr) {
          // Ignore and continue to reject
        }
      }

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    let passwordMatch = false;

    if (user.password_hash) {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      // Bootstrap password on first login if no password hash exists in profiles yet
      const newHash = await bcrypt.hash(password, 10);
      await execute('UPDATE profiles SET password_hash = ? WHERE id = ?', [newHash, user.id]);
      passwordMatch = true;
    }

    // If password did not match MySQL hash, check if it matches Supabase Auth (automatic password migration)
    if (!passwordMatch && sbClient) {
      try {
        const { data: sbData, error: sbError } = await sbClient.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!sbError && sbData?.user) {
          // Valid credentials in Supabase! Auto-sync modern bcrypt hash to MySQL profiles table
          console.log(`[Auth Migration] Successfully validated and migrated password hash for ${cleanEmail} to MySQL profiles.`);
          const newHash = await bcrypt.hash(password, 10);
          await execute('UPDATE profiles SET password_hash = ? WHERE id = ?', [newHash, user.id]);
          passwordMatch = true;
        }
      } catch (sbErr) {
        // Fallback check failed
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userObj = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar_url: user.avatar_url || '',
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: userObj,
      session: {
        access_token: token,
        token_type: 'bearer',
        expires_in: 604800,
        user: userObj,
      },
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    let msg = err.message || 'Login failed';
    if (err.code === 'ETIMEDOUT' || msg.includes('ETIMEDOUT')) {
      msg = 'Database connection timed out. Please check Hostinger Remote MySQL settings and verify port 3306 is open.';
    } else if (err.code === 'ECONNREFUSED' || msg.includes('ECONNREFUSED')) {
      msg = 'Database connection refused. Please ensure MySQL server is reachable on port 3306.';
    }
    res.status(500).json({ error: msg });
  }
});

// POST /api/auth/reset-password - Allows resetting or setting user password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, new_password } = req.body;

    if (!email || !new_password) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (!isMysqlConfigured()) {
      return res.status(503).json({ error: 'MySQL database not configured' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const newHash = await bcrypt.hash(new_password, 10);

    const result = await execute('UPDATE profiles SET password_hash = ? WHERE email = ?', [newHash, cleanEmail]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User profile not found for this email' });
    }

    res.json({ success: true, message: `Password for ${cleanEmail} updated successfully in MySQL profiles.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await query<any>(
      'SELECT id, email, full_name, phone, address, avatar_url, role, total_spent, order_count, created_at FROM profiles WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({ success: true, profile: users[0], user: req.user });
  } catch (err: any) {
    console.error('[Auth Me Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
