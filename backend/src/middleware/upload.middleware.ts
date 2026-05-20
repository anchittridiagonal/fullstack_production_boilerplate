import path from 'path';
import fs from 'fs';

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

import { config } from '../config';
import { AppError } from './error.middleware';

const ensureUploadDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uploadPath = path.join(process.cwd(), config.upload.dir, 'temp');
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed (jpeg, jpg, png, webp, gif)', 400));
  }
};

const documentFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF and Word documents are allowed', 400));
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
}).single('avatar');

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
}).array('images', 10);

export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('document');
