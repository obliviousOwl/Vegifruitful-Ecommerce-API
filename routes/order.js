const express = require("express");

const orderController = require("../controllers/order");

const { authenticate, authenticateAdmin, authenticateNonAdmin } = require('../auth');

const router = express.Router();

router.post('/checkout', authenticate, authenticateNonAdmin, orderController.createOrder);

router.get('/my-orders', authenticate, authenticateNonAdmin, orderController.getMyOrders);

router.get('/all-orders', authenticate, authenticateAdmin, orderController.getAllOrders);

module.exports = router;