const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    product_slug: String,
    user_id: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Yet",
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const ProductReview = mongoose.model(
  "ProductReview",
  ProductReviewSchema,
  "review_product"
);
module.exports = ProductReview;
