import { diskStorage } from 'multer';
import { extname } from 'path';

export const pdfMulterConfig = {
  storage: diskStorage({
    destination: './uploads/pdfs',
    filename: (_, file, cb) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files allowed'), false);
    }
    cb(null, true);
  },
};
