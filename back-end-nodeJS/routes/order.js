const express = require('express');
const router = express.Router();
const Order = require('../models/orders');

// Get all orders
router.get('', async (req, res, next) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({
            message: "Success",
            orders: orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Create a new order
router.post('', async (req, res, next) => {
    try {
        const order = new Order(req.body);
        await order.save();
        return res.status(201).json({
            message: "Order Successfully Created",
            order: order
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Get an order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(404).json({
                message: "No order found with the given ID"
            });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Delete an order by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(404).json({
                message: "No order found with the given ID"
            });
        }
        await Order.deleteOne({ _id: order._id });
        return res.status(200).json({
            message: "Order Successfully Deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

// Update an order by ID
router.put('/:id', async (req, res, next) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!order) {
            return res.status(404).json({
                message: "No order found to update"
            });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error: ${error}`
        });
    }
});

module.exports = router;
