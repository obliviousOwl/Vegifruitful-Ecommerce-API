const Product = require("../models/Product");

module.exports.addProduct = (req, res) => {

	return Product.findOne({ name: req.body.name }).then(existingProduct => {

		let newProduct = new Product({
			name : req.body.name,
			description : req.body.description,
			price : req.body.price
		});

		if(existingProduct) {

			return res.status(409).send({ error : 'Product already exists' });

		}

		return newProduct.save().then(products => res.status(201).send({ products })).catch(saveError => {

			console.error('Error in saving the product: ', saveError);

			res.status(500).send({ error : 'Failed to save the product' });
		});

	}).catch(findErr => {

		console.error('Error in finding the product: ', findErr);

		return res.status(500).send({ message: "Error in finding the product" });
	})
}; 

module.exports.getProducts = (req, res) => {

	return Product.find({}).then(products => {

		if(products.length > 0) {

			return res.status(200).send({ products });

		} else {

			return res.status(200).send({ message : 'No products found' })
		}
		
	}).catch(findErr => {

		console.error('Error in finding all products: ', findErr);

		return res.status(500).send({ error : 'Error finding products'})
	});
};

module.exports.getAllActive = (req, res) => {

	return Product.find({ isActive : true }).then(activeProducts => {
		
		if (activeProducts.length > 0){
			
			return res.status(200).send({ products: activeProducts });

		} else {
			
			return res.status(200).send({ message : "No active products found" });
		}
		
	}).catch(findErr => {

		console.error('Error finding active products: ', findErr);

		return res.status(500).send({ error : 'Error finding active products'});
	});
};

module.exports.getProduct = (req, res) => {
	return Product.findById(req.params.productId).then(product => {
		if(product){
			return res.status(200).send({ product })
		}
		else{
			return res.status(404).send({ error: "Unable to find product"});
		}
		
	}).catch(findErr => {
		return res.status(500).send({ error : 'Error in finding product.'})
	});
};

module.exports.updateProduct = (req, res) => {

	let updatedProduct = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new: true}).then(updatedProduct => {
		if(updatedProduct) {
			return res.status(200).send({ 
				message: "Product updated successfully",
				updatedProduct 
			});
		}
		else{
			return res.status(404).send({ error: 'Product not found' });
		}
	}).catch(updateErr => {
		console.log(updateErr)
		return res.status(500).send({ error: 'Error in updating the product' });
	})
};

module.exports.archiveProduct = (req, res) => {

	let updatedActiveStatus = {
		isActive: false
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedActiveStatus, {new: true}).then(archiveProduct => {
		if(archiveProduct) {
			return res.status(200).send({ 
				message: 'Product archived successfully',
				archiveProduct: archiveProduct
			})
		}
		else{
			return res.status(404).send({ error: 'Product not found' });
		}
	}).catch(updateErr => {
		return res.status(500).send({ error: 'Error in archiving the product' });
	});
};

module.exports.activateProduct = (req, res) => {
	let updatedActiveStatus = {
		isActive: true
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedActiveStatus, {new: true}).then(activateProduct => {
		if(activateProduct) {
			return res.status(200).send({ 
				message: 'Product activated successfully',
				activateProduct })
		}
		else{
			return res.status(404).send({ error: 'Product not found' });
		}
	}).catch(updateErr => {
		return res.status(500).send({ error: 'Error in activating the product' });
	});
};

module.exports.searchByName = async (req, res) => {
	try{
		const name = req.body.name;
		const productSearch = await Product.find({
			name: { $regex: name, $options: 'i'}
		});

		if(!productSearch){
			return res.status(404).send({ message: 'Product not found' })
		}

		return res.status(200).send( productSearch )

	}
	catch (searchErr) {
		console.log('error in product searching: ', searchErr);
		return res.status(500).send({ error:'Error in product search'})
	}
}

module.exports.searchByPrice = async (req, res) => {
	try {
		const { minPrice, maxPrice } = req.body;

		const productSearch = await Product.find({
			price: {
				$gte: minPrice || 0,
				$lte: maxPrice || Infinity
			}
		})

		if(!productSearch){
			return res.status(404).send({ message: 'Product not found' })
		}

		return res.status(200).send( productSearch )

	}
	catch (searchErr) {
		console.log('error in product searching: ', searchErr);
		return res.status(500).send({ error:'Error in product search'})
	}
}