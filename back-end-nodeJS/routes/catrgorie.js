const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const checkAuth=require('../middleware/check-auth')

// Get all categories
router.get('', async (req, res, next) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            message: "Success",
            categories: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Create a new category
router.post('',checkAuth, async (req, res, next) => {
    try {
        const category = new Category(req.body);
        await category.save();
        return res.status(200).json({
            message: "Successfully Created"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Get category by ID
router.get('/:id', async (req, res, next) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({
                message: "No category found with the given ID"
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Delete category by ID
router.delete('/:id',checkAuth, async (req, res, next) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({
                message: "No category found with the given ID"
            });
        }
        await Category.deleteOne({ _id: category._id });
        return res.status(200).json({
            message: "Successfully Deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        }); 
    }
});

// Update category by ID
router.put('/:id', async (req, res, next) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({
                message: "No category found to update."
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});


module.exports = router;
