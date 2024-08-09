const express = require("express");

const cartController = require("../controllers/cart");

const { authenticate, authenticateAdmin, authenticateNonAdmin } = require('../auth');

const router = express.Router();

router.get("/", authenticate, authenticateNonAdmin, cartController.getCart);

router.post('/add-to-cart', authenticate, authenticateNonAdmin, cartController.addToCart);

router.patch('/update-cart-quantity', authenticate, authenticateNonAdmin, cartController.updateCart);

router.patch('/:productId/remove-from-cart', authenticate, cartController.removeFromCart);

router.put('/clear-cart', authenticate, cartController.clearCart);


module.exports = router;