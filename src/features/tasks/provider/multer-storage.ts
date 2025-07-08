import { diskStorage } from 'multer';

export const multerStorage = diskStorage({
  destination: './uploads/tasks',

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
