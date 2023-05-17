const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function(req, file, cb){
        cb(
            null, 
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const fileFilter = (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        const error = new Error('Only image files are allowed.');
        error.status = 406;
        cb(error, false); // Reject the file
    }
};

const fileUpload = multer({storage: storage, fileFilter: fileFilter});

module.exports = fileUpload;