import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const vendorUploader = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `./public/vendors`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uid = `${Date.now()}_${uuidv4()}`;
      const extension = extname(file.originalname);
      cb(null, `${file.fieldname}_${uid}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true); // optionally validate mimetype
  },
};
