const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            console.log(`No cart found for userId: ${req.params.userId}, creating an empty cart.`);
            cart = new Cart({ userId: req.params.userId, products: [], totalAmount: 0 });
            await cart.save();
        }

        console.log(`Cart found for userId: ${req.params.userId}, returning data.`);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/create', async (req, res) => {
    const { userId } = req.body;

    try {
        let existingCart = await Cart.findOne({ userId });
        if (existingCart) {
            return res.status(200).json(existingCart); // If cart exists, return it
        }

        // Create a new cart with an empty product list
        const newCart = new Cart({ userId, products: [], totalAmount: 0 });
        await newCart.save();

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/:userId', async (req, res) => {
    console.log(req.body);
    try {
        const { productId, quantity, price } = req.body;
        const userId = req.params.userId; 
        console.log(req.params.userId);
        // Ensure userId is treated as a string (or ObjectId if needed)
        let cart = await Cart.findOne({ userId });

        console.log(`Searching cart for userId: ${userId}`);
        console.log(cart);

        if (!cart) {
            console.log("Creating a new cart for user");
            cart = new Cart({
                userId,
                products: [{ productId, quantity, price }],
                totalAmount: price * quantity
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex !== -1) {
                // If product exists, update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product
                cart.products.push({ productId, quantity, price });
            }

            // Recalculate totalAmount correctly
            cart.totalAmount = cart.products.reduce((sum, p) => sum + p.price*p.quantity, 0);
        }
        console.log("updating price",cart);

        // Save cart
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update product quantity in cart
router.put('/:userId', async (req, res) => {
    try {
        console.log("hai");
        const { productId, quantity, price } = req.body;
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex !== -1) {
            const oldQuantity = cart.products[productIndex].quantity;
            cart.products[productIndex].quantity = quantity;
            // cart.totalAmount += (quantity - oldQuantity) * price;
            cart.totalAmount = cart.products.reduce((sum, p) => sum + p.price*p.quantity, 0);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Remove product from cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);

        if (productIndex !== -1) {
            const removedProduct = cart.products.splice(productIndex, 1)[0];
            cart.totalAmount -= removedProduct.price * removedProduct.quantity;
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
