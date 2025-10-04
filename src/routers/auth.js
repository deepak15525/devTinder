/** @format */

const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/User");
const { validationRules } = require("../utils/Validator");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
	try {
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		validationRules(req);
		const userData = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
		await userData.save();
		res.status(200).send("User Added Successfully");
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

//Login
authRouter.post("/login", async (req, res) => {
	const { emailId, password } = req.body;
	try {
		const user = await User.findOne({
			emailId,
		});
		if (!user) {
			res.status(404).send("Unauthenticated User");
		}
		const isMatch = await user.verifyPassword(password);
		if (!user) {
			res.status(404).send("Unauthenticated User");
		}

		const token = await user.getToken();

		res.cookie("token", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: false, // Set true if using HTTPS
		});

		res.send("Logged In Successfully");
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

authRouter.get("/logout", (req, res) => {
	res.cookie("token", "", {
		expires: new Date(0),
	});
	res.json({ message: "logout successfully" });
});

module.exports = {
	authRouter,
};
