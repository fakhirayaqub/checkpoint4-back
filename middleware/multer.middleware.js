const multer = require("multer");

var upload = multer({
  dest: "uploads/"
});

module.exports = upload.single("projectImage");
