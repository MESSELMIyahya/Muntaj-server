const mongoose = require("mongoose");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3Client');
const bpt = require('bcrypt');
const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // auth 
    auth: {
      oauth: { required: true, type: Boolean },
      password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password should be at least 8 characters long."],
      },
      provider: {
        required: true,
        type: String,
        enum: ['google', 'enum']
      }
    }
  },
  { timestamps: true }
);

// Hashing password middleware 
userSchema.pre('save', async function () {
  if (this.auth.oauth || !this.auth.password) return;
  this.auth.password = await bpt.hash(this.auth.password, 10);
});


// statics
userSchema.static('doesEmailExists', async function (email) {
  try {
    const user = await this.findOne({ email });
    return user ? true : false
  } catch (err) {
    throw new ApiError(
      'does Email Exists function',
      errorObject(
        undefined,
        'does Email Exists function',
        undefined,
        "method"
      ),
      500
    )
  }
})

// methods 
userSchema.method("isValidPassword", async function (pass) {
  try {
    const isValid = await bpt.compare(pass, this.auth.password)
    return isValid;
  } catch (err) {
    throw new ApiError(
      'isValidPassword function',
      errorObject(
        undefined,
        'isValidPassword function',
        undefined,
        "method"
      ),
      500
    )
  }
});



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

const UserModel = mongoose.models.Users || mongoose.model('Users', userSchema);
module.exports = UserModel;