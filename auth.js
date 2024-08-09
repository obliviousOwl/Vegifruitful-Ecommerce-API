const jwt = require('jsonwebtoken');
const secret = 'ECommerceAPI';

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
		firstName: user.firstName,
		lastName: user.lastName
	};

	return jwt.sign(data, secret, {});
}

module.exports.authenticate = (req, res, next) => {


	let token = req.headers.authorization;

	if(typeof token === 'undefined') {

		return res.send({ auth: 'Failed. No Token'});

	} else {


		token = token.slice(7, token.length);


		jwt.verify(token, secret, function(err, decodedToken) {

			if(err) {

				return res.send({
					auth: 'Failed',
					message: err.message
				})

			} else {

				/*
					{
						id: '663cb784e8358b5fcebe96c4',
						email: 'jsmith@mail.com',
						isAdmin: false,
						iat: 1715335932
					}
				*/
				console.log('Result from verify method:');
				console.log(decodedToken);

				/*
					req.user = {
						id: '663cb784e8358b5fcebe96c4',
						email: 'jsmith@mail.com',
						isAdmin: false,
						iat: 1715335932
					}
				*/
				req.user = decodedToken;

				next();
			}
		})
	}
}

module.exports.authenticateAdmin = (req, res, next) => {

	if(req.user.isAdmin) {

		next();

	} else {

		return res.send({
			auth: 'Failed',
			message: 'Action Forbidden'
		})
	}
}

module.exports.isLoggedIn = (req, res, next) => {

	if (req.user) {

		next();

	} else {

		res.sendStatus(401);
		
	}
}

module.exports.authenticateNonAdmin = (req, res, next) => {

	if(!req.user.isAdmin) {

		next();

	} else {

		return res.send({
			auth: 'Failed',
			message: 'Action Forbidden'
		})
	}
	
}