const express = require("express");

const productController = require("../controllers/product");

const { authenticate, authenticateAdmin } = require('../auth');

const router = express.Router();

router.post("/", authenticate, authenticateAdmin, productController.addProduct); 

router.get("/all", authenticate, authenticateAdmin, productController.getProducts);

router.get("/active", productController.getAllActive);

router.get("/:productId", productController.getProduct);

router.patch("/:productId/update", authenticate, authenticateAdmin, productController.updateProduct);

router.patch("/:productId/archive", authenticate, authenticateAdmin, productController.archiveProduct);

router.patch("/:productId/activate", authenticate, authenticateAdmin, productController.activateProduct);

router.post("/search-by-name", productController.searchByName);

router.post("/search-by-price", productController.searchByPrice);

module.exports = router;