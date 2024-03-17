const multer = require("multer");

const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image/")) {

    cb(null, true);

  } else {

    const message = `Only image files are allowed.`;
    cb(
      new ApiError(
        message,
        errorObject(undefined, message, "image", "body"),
        400
      ),
      false
    );

  };
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

exports.uploadSingleImage = (fieldName) => upload.single(fieldName);
