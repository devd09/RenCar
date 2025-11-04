const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads/");
},
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
},
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
const allowed = /jpeg|jpg|png|gif/;
const extname = allowed.test(path.extname(file.originalname).toLowerCase());
const mimetype = allowed.test(file.mimetype);
if (mimetype && extname) return cb(null, true);
cb(new Error("Only image files are allowed!"));
};

// Multer instance
const upload = multer({
storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
fileFilter,
});

module.exports = upload;
