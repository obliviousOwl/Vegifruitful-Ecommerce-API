const Cart = require('../models/Cart');
const Product = require('../models/Product');

module.exports.getCart = (req, res) => {
	const userId = req.user.id
	return Cart.findOne({userId}).then(cart => {
		if(cart){
			return res.status(200).send({ cart })
		}
		else{
			return res.status(404).send({ error: "No cart found"});
		}
		
	}).catch(findErr => {
		return res.status(500).send({ error : 'Error in finding cart.'})
	});
};

module.exports.addToCart = async (req, res) => {
	const { productId, quantity, subtotal } = req.body;
	const userId = req.user.id
	try {
		let cart = await Cart.findOne({userId});

		if (!cart) {
			cart = new Cart({
				userId,
				cartItems: [{ productId, quantity, subtotal }],
				totalPrice: subtotal,
				orderedOn: new Date()
			});
		} else {
			const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

			if (cartItem) {
				cartItem.quantity += quantity;
				cartItem.subtotal += subtotal;
			} else {
				cart.cartItems.push({ productId, quantity, subtotal });
			}

			cart.totalPrice += subtotal;
		}

		await cart.save();
		res.status(201).send({ 
			message: 'Item added to cart successfully',
			cart
		});
	} catch (err) {
		console.log('Error in adding item to cart', err)
		res.status(500).send({error: 'Error in adding item to cart'});
	}
};

module.exports.updateCart = async (req, res) => {
	const { productId, quantity, subtotal } = req.body;
	const userId = req.user.id
	try {
		let cart = await Cart.findOne({userId});

		if (!cart) {
			res.status(404).send({error: 'Cart not found'})
		} else {
			const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

			if (cartItem) {
				cart.totalPrice -= cartItem.subtotal; 
				cartItem.quantity = quantity;
				cartItem.subtotal = subtotal;
			} else {
				cart.cartItems.push({ productId, quantity, subtotal });
			}

			cart.totalPrice += subtotal;
		}

		await cart.save();
		res.status(200).send({ 
			message: 'Item quantity updated successfully',
			updatedCart: cart
		});
	} catch (err) {
		console.log('Error in adding item to cart', err)
		res.status(500).send({error: 'Error in updating item in the cart'});
	}
};

// module.exports.removeFromCart = (req, res) => {

// 	let updateActiveField = {
// 		isActive: false
// 	}

// 	return Course.findByIdAndUpdate(req.params.courseId, updateActiveField).then(course => {

// 		if (course) {

// 			res.status(200).send(true);

// 		} else {

// 			res.status(404).send(false);
// 		}
// 	}).catch(err => res.status(500).send(err));
// };

module.exports.removeFromCart = async (req, res) => {
	const userId = req.user.id; 

	const { productId } = req.params;

	try {
		let cart = await Cart.findOne({ userId });


		if (!cart) {
			return res.status(404).send('Cart not found');
		}

		const cartItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

		if (cartItemIndex === -1) {
			return res.status(404).send({message: 'Item not found in cart'});
		}

		const cartItem = cart.cartItems[cartItemIndex];
		cart.totalPrice -= cartItem.subtotal;
		cart.cartItems.splice(cartItemIndex, 1);

		await cart.save();
		res.status(200).send({ 
			message: 'Item removed from cart successfully', 
			updatedCart: cart 
		});
	} catch (err) {
		res.status(500).send({ message: 'Error removing item from cart', error: err.message });
	}
};


module.exports.clearCart = async (req, res) => {
	const userId = req.user.id; 

	try {

		let cart = await Cart.findOne({ userId });

		if (!cart) {
			return res.status(404).send('Cart not found');
		}

		cart.cartItems = [];
		cart.totalPrice = 0;

		await cart.save();
		res.status(200).send({ message: 'Cart cleared successfully', cart });

	} catch (err) {
		res.status(500).send({ message: 'Error clearing cart', error: err.message });
	}
};