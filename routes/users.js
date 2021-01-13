var express = require('express');
var router = express.Router();

/* register.pug: POST checking repeated email address */
router.post('/checkEmail', function(req, res, next) {
	req.user.find({email: req.body.email}, 'email', (err, result) => {
		res.send((result.length != 0) ? { msg: 'Already registered!' } : { msg: '' });
	});
});

/* register.pug: POST adding new user */
router.post('/add', function(req, res) {
	let addUser = new req.user({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	
	//add new user
	addUser.save(function (err, result) {
		console.log(">> Log: user \"" + req.body.name + "\" registered");
		res.send((err === null) ? { msg: '' } : { msg: err });
	});
});

/* login.pug: POST validating user */
router.post('/validate', function(req, res, next) {
	req.user.find({email: req.body.email}, (err, result) => {
		if(result.length == 0) {
			res.send({msg: "User is not registered"});
		} else if(result.length == 1) {
			if(req.body.password == result[0].password) {
				//matching password and email address, user validated
				//assign session variables
				req.session.uid = result[0]._id;
				req.session.name = result[0].name;
				req.session.email = result[0].email;
				res.send({msg: ''});
			} else {
				//matching email, but not matching password
				res.send({msg: "Unauthorized access"});
			}
		} else {
			res.send({msg: "Internal database error"});
			console.log("Error: More than 1 user with the same email address: ");
		}
	});
});

/* index.pug: POST retrieve user name from ID */
router.post('/getUserName', function(req, res, next) {
	req.user.find({"_id": req.body.id}, 'name', (err, result) => {
		res.send({msg: result[0].name});
	});
});

module.exports = router;