import multer from 'multer';

// Use diskStorage to handle the incoming file
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;