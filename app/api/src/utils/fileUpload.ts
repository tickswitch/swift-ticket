import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

const createStorage = (folder: string) => {
  const uploadPath = path.join(process.cwd(), 'uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: DestinationCallback) => {
      cb(null, uploadPath);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: FilenameCallback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
};

export const avatarUpload = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const ticketUpload = multer({
  storage: createStorage('tickets'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const getFileUrl = (relativePath: string): string => {
  return `${process.env.APP_URL}/uploads/${relativePath}`;
};

export const uploadNone = multer().none();
