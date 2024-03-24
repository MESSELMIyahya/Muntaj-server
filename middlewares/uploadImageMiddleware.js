const multer = require("multer");

const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    const message = `You cannot upload these types of files.`;
    cb(
      new ApiError(
        message,
        errorObject(undefined, message, undefined, "body"),
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

exports.uploadSingleImage = (fieldName) => upload.single(fieldName);

exports.uploadMultipleImages = (arrayOfFields) => upload.fields(arrayOfFields);