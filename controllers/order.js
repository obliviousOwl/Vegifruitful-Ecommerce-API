const Order = require('../models/Order');
const Cart = require('../models/Cart');

module.exports.createOrder = async(req,res) => {

  const userId = req.user.id;

  try{
    const cart = await Cart.findOne({ userId });

    if(!cart) {
      return res.status(404).send({ error: 'No cart found' });
    }

    if(cart.cartItems.length <= 0){
      return res.status(404).send({ error: 'No Items to Checkout' });
    }

    let newOrder = new Order({
      userId: req.user.id,
      productsOrdered: cart.cartItems,
      totalPrice: cart.totalPrice
    })

    cart.cartItems = [];
		cart.totalPrice = 0;
    await newOrder.save();
    await cart.save();
    return res.status(200).send({ message: 'Ordered Successfully' })

  }
  catch(error){
    console.log('Error in creating order: ', error);
    return res.status(500).send({Error: 'Error in creating an order'})
  }
};

module.exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).send({ message: 'No orders found for this user' });
    }

    res.status(200).send({ orders });
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving orders', error: err.message });
  }
};

module.exports.getAllOrders = async (req, res) => {

  try {
    const orders = await Order.find();

    if (!orders.length) {
      return res.status(404).send({ message: 'No orders found' });
    }

    res.status(200).send({ orders });
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving orders', error: err.message });
  }

};
