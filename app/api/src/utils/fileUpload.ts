import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createStorage = (folder: string) => {
  const uploadPath = path.join(process.cwd(), 'uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
};

export const avatarUpload = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
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
