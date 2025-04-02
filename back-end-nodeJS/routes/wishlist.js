const express = require("express");
const Wishlist = require("../models/Wishlist");

const router = express.Router();

// Get wishlist items (populating product details)
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate("productIds");
    if (!wishlist) return res.status(200).json({ products: [] });
    
    res.status(200).json(wishlist.productIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to wishlist
router.post("", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, productIds: [productId] });
    } else {
      if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from wishlist
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== productId);
    await wishlist.save();
    
    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
