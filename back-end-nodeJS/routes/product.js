const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Get all products
router.get('', async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            message: "Success",
            products: products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Create a new product
router.post('', async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        return res.status(200).json({
            message: "Successfully Created"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Get a product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({
                message: "No product found with the given ID"
            });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({
                message: "No product found with the given ID"
            });
        }
        await Product.deleteOne({ _id: product._id });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Update a product by ID
router.put('/:id', async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({
                message: "No product found to update"
            });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});




module.exports = router;
