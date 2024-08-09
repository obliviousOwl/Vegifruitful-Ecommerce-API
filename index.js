const express = require('express');

const mongoose = require('mongoose');

// Google login
/*const passport = require('passport');
const session = require('express-session');
require('./passport')*/

const cors = require('cors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();

const port = 4000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

/*app.use(session ({
	secret: process.env.clientSecret,
	resave : false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());*/

// mongoose.connect('mongodb+srv://admin:admin1234@cluster0.hwilf0l.mongodb.net/Ecommerce-API?retryWrites=true&w=majority&appName=Cluster0');

mongoose.connect('mongodb+srv://admin:admin1234@jimdb.1oza6gb.mongodb.net/Ecommerce-API?retryWrites=true&w=majority&appName=JimDB');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', () => console.log(`We're now connected to MongoDb Atlas`));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

if(require.main === module) {
	app.listen(process.env.PORT || port, () => console.log(`API is now online on port ${process.env.PORT || port}`))
}

module.exports = {app, mongoose}