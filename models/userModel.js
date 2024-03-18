const mongoose = require("mongoose");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3Client');

const awsBuckName = process.env.AWS_BUCKET_NAME;
const expiresIn = process.env.EXPIRE_IN;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: [3, "Too short frist name."],
      maxlength: [16, "Too long frist name."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      minlength: [2, "Too short last name."],
      maxlength: [16, "Too long last name."],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    profileCoverImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password should be at least 8 characters long."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
  },
  { timestamps: true }
);

const setImageUrl = async (doc) => {

  if (doc.profileImage) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `users/${doc.profileImage}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.profileImage = imageUrl;
    
  };

  if (doc.profileCoverImage) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `users/${doc.profileCoverImage}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.profileCoverImage = imageUrl;

  };

};

// findOne, findAll, update, delete
userSchema.post("init", async (doc) => {
  await setImageUrl(doc);
});

// create
userSchema.post("save", async (doc) => {
  await setImageUrl(doc);
});

module.exports = mongoose.model("User", userSchema);