import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

export const uploadRouter = Router();

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${cleanBase}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/plain',
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx', '.rtf', '.txt', '.jpg', '.jpeg', '.png', '.webp'];
    if (
      allowedMime.includes(file.mimetype) ||
      file.mimetype.startsWith('image/') ||
      allowedExts.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed. Supported formats: PDF, DOC, DOCX, JPG, PNG.`));
    }
  },
});

// POST /api/upload
uploadRouter.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let publicUrl = `/uploads/${req.file.filename}`;

    // Also upload to Supabase Storage 'generals' bucket if configured for cloud persistence
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const sb = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        const fileBuffer = fs.readFileSync(req.file.path);
        const storagePath = `attachments/${req.file.filename}`;
        const { error: upErr } = await sb.storage
          .from('generals')
          .upload(storagePath, fileBuffer, {
            contentType: req.file.mimetype || 'application/octet-stream',
            upsert: true,
          });

        if (!upErr) {
          const { data: pubData } = sb.storage.from('generals').getPublicUrl(storagePath);
          if (pubData?.publicUrl) {
            publicUrl = pubData.publicUrl;
          }
        }
      } catch (sbErr) {
        console.warn('[Upload Supabase Warning]:', sbErr);
      }
    }

    res.json({
      success: true,
      publicUrl,
      localUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err: any) {
    console.error('[Upload Error]:', err);
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

