const mongoose = require("mongoose");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3Client');

const awsBuckName = process.env.AWS_BUCKET_NAME;
const expiresIn = process.env.EXPIRE_IN;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters."],
      maxlength: [64, "Product name cannot exceed 64 characters."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true,
      minlength: [20, "Product description must be at least 20 characters."],
    },
    primaryImage: {
      type: String,
      required: [true, "Product primary Image is required."],
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    video: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required."],
      trim: true,
      lowercase: true,
      minlength: [2, "Country must be at least 2 characters."],
      maxlength: [16, "Country cannot exceed 16 characters."],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category."],
    },
    store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
      required: [true, "Product must belong to store."],
      immutable: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Product must belong to owner."],
      immutable: true,
    },
    colors: [
      {
        type: String,
        trim: true,
        minlength: [2, "Product color must be at least 2 characters."],
        maxlength: [16, "Product color cannot exceed 16 characters."],
      },
    ],
    sizes: {
      sm: {
        type: String,
        trim: true,
        minlength: [2, "Small size must be at least 2 characters."],
        maxlength: [16, "Small size cannot exceed 16 characters."],
      },
      md: {
        type: String,
        trim: true,
        minlength: [2, "Medium size must be at least 2 characters."],
        maxlength: [16, "Medium size cannot exceed 16 characters."],
      },
      lg: {
        type: String,
        trim: true,
        minlength: [2, "Large size must be at least 2 characters."],
        maxlength: [16, "Large size cannot exceed 16 characters."],
      },
      xl: {
        type: String,
        trim: true,
        minlength: [2, "Extra Large size must be at least 2 characters."],
        maxlength: [16, "Extra Large size cannot exceed 16 characters."],
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be abave or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// mongoose query middleware
productSchema.pre(/find/, function(next) {
  this.populate({
    path: "owner",
    select: "userName profileImage"
  })
  .populate({
    path: "store",
    select: "name storeImage rating location contact"
  });
  next();
});

const setImageUrl = async (doc) => {

  if (doc.primaryImage) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `products/${doc.primaryImage}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.primaryImage = imageUrl;

  };

  if (doc.images) {

    // eslint-disable-next-line prefer-const
    let imageList = [];

    await Promise.all(

      doc.images.map(async (image) => {
    
        const getObjectParams = {
          Bucket: awsBuckName,
          Key: `products/${image}`,
        };
      
        const command = new GetObjectCommand(getObjectParams);
        const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
        imageList.push(imageUrl);
  
      })

    );

    doc.images = imageList;

  };

  if (doc.video) {
  
    const getObjectParams = {
      Bucket: awsBuckName,
      Key: `products/${doc.video}`,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn });
  
    doc.video = imageUrl;

  };

};

// findOne, findAll, update, delete
productSchema.post("init", async (doc) => {
  await setImageUrl(doc);
});

// create
productSchema.post("save", async (doc) => {
  await setImageUrl(doc);
});

module.exports = mongoose.model(`Product`, productSchema);