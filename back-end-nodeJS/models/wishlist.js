const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
