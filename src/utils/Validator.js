/** @format */

const validator = require("validator");

const validationRules = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	if (!firstName) {
		throw new Error("First Name is required!!!");
	} else if (firstName.length > 50) {
		throw new Error("First Name is too long!!!");
	} else if (!validator.isEmail(emailId)) {
		throw new Error("Invalid Email!!!");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Password is not strong enough!!!");
	} else if (lastName.length > 50) {
		throw new Error("Last Name is too long!!!");
	}
};

module.exports = {
	validationRules,
};
