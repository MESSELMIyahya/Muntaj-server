const mongoose = require("mongoose");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3Client');

const awsBuckName = process.env.AWS_BUCKET_NAME;
const expiresIn = process.env.EXPIRE_IN;

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Store name is required."],
      unique: true,
      trim: true,
      minlength: [2, "Store name must be at least 2 characters."],
      maxlength: [16, "Store name cannot exceed 16 characters."],
    },
    storeImage: {
      type: String,
      trim: true,
    },
    storeCoverImage: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, "Rating must be abave or equal 0.0"],
      max: [5, "Rating must be below or equal 5.0"],
      default: 0,
    },
    location: {
      country: {
        type: String,
        required: [true, "Country is required."],
        trim: true,
        lowercase: true,
        minlength: [2, "Country must be at least 2 characters."],
        maxlength: [16, "Country cannot exceed 16 characters."],
      },
      address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
        lowercase: true,
        minlength: [8, "Address must be at least 8 characters."],
        maxlength: [32, "Address cannot exceed 32 characters."],
      },
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Store must belong to owner."],
      immutable: true,
    },
    contact: {
      phoneNumbers: [
        {
          type: String,
          required: [true, "Phone number is required."],
          trim: true,
        },
      ],
      email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
      },
      website: {
        type: String,
        trim: true,
      },
      socialMedia: {
        facebook: {
          type: String,
          trim: true,
        },
        instagran: {
          type: String,
          trim: true,
        },
        twitter: {
          type: String,
          trim: true,
        },
        linkedIn: {
          type: String,
          trim: true,
        },
        youtube: {
          type: String,
          trim: true,
        },
      }
    },
  },
  { timestamps: true }
);

// mongoose query middleware
storeSchema.pre('findOne', function(next) {
  this.populate({
    path: "owner",
    select: "userName profileImage",
  });
  next();
});

const setImageUrl = async (doc) => {

  if (doc.storeImage) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `store/${doc.storeImage}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.storeImage = imageUrl;

  };

  if (doc.storeCoverImage) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `store/${doc.storeCoverImage}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.storeCoverImage = imageUrl;

  };

};

// findOne, findAll, update, delete
storeSchema.post("init", async (doc) => {
  await setImageUrl(doc);
});

// create
storeSchema.post("save", async (doc) => {
  await setImageUrl(doc);
});

module.exports = mongoose.model(`Store`, storeSchema);
