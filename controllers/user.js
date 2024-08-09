const User = require('../models/User');

const bcrypt = require('bcryptjs');

const auth = require('../auth');

// const nodemailer = require('nodemailer');

// function sendMail(recepient, subject, message) {

// 	const transporter = nodemailer.createTransport({
// 		service: 'gmail',
// 		host: 'smtp.gmail.com',
// 		port: 587,
// 		secure: false,
// 		auth: {
// 			user: 'ecommerceapis6@gmail.com',
// 			pass: 'tryqlerplidgccnp'
// 		}
// 	});

// 	var mailOptions = {
// 	  from: 'ecommerceapis6@gmail.com',
// 	  to: recepient,
// 	  subject: subject,
// 	  html: message
// 	};

// 	transporter.sendMail(mailOptions, function(error, info){
// 		if (error) {
// 		console.log(error);
// 		} else {
// 		console.log('Email sent: ' + info.response);
// 		}
// 	});
// }

module.exports.register = (req, res) => {

	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		mobileNo: req.body.mobileNo
	})

	if (!req.body.email.includes("@")){
	    return res.status(400).send({ error: 'Email invalid' });
	}

	else if (req.body.mobileNo.length !== 11){
	    return res.status(400).send({ error: 'Mobile number invalid'});
	}

	else if (req.body.password.length < 8) {
	    return res.status(400).send({ error: 'Password must be atleast 8 characters' });

	} else {
/*		const message = `<h1>Hi ${req.body.firstName}</h1></br><p>Your registration has been completed</p></br><p>Ecommerce API</p>`
		sendMail(req.body.email, 'Registration Complete', message)*/
		return newUser.save().then(user => res.status(201).send({ message: 'Registered Successfully'})).catch(saveErr => {

			console.error('Error in saving the user: ', saveErr);

			return res.status(500).send({ error: 'Error in Save' });
		})
	}
};

module.exports.login = (req, res) => {

	if(req.body.email.includes('@')) {
		
		return User.findOne({ email: req.body.email }).then(user => {

			if(user == null) {

				return res.status(404).send({ error: 'No Email Found'});

			} else {

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

				if(isPasswordCorrect) {

					return res.status(200).send({ access: auth.createAccessToken(user)})

				} else {

					return res.status(401).send({ error: 'Email and password do not match'});
				}
			}
		}).catch(findErr => {

			console.error('Error in finding the user: ', findErr);

			return res.status(500).send({ error: 'Error in find' });
		})

	} else {

		return res.status(400).send({ error: 'Invalid email'});
	}
};

module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id).select("-password").then(user => {
		if(!user) {
			return res.status(404).send({
				error: "User not found"
			})
		}

		else{
			return res.status(200).send({user})
		}
	}).catch(findErr => {
			console.error('Error in find the user: ',findErr);
			return res.status(500).send({ error: 'Failed to fetch user profile'});
		}
	)
};

module.exports.setAsAdmin =  async (req, res) => {

    const id = req.params.id;

    return User.findById(id).then(updatedUser => {
        if (!id) {
            return res.status(400).send({ message: 'User ID is required' });
        }
        if(!updatedUser){
            return res.status(404).send({ message: 'User not found' });
        }

        updatedUser.isAdmin = true;
        updatedUser.save();

        return res.status(200).send({ updatedUser });
    }).catch(updateErr => {	
        return res.status(500).send({ 
            error: 'Failed in find',
            details: updateErr
        });
    })
};

module.exports.updatePassword = async (req, res) => {

  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });
/*    const message = `<h1>Hi ${req.user.firstName}</h1></br><p>Your password has been reset</p></br><p>Ecommerce API</p>`;
	sendMail(req.user.email, 'Password reset', message);*/

    res.status(201).send({ message: 'Password reset successfully' });

  } catch (error) {

    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }

};

