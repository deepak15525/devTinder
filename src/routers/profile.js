/** @format */

const express = require("express");
const profileRouter = express.Router();
const { User } = require("../models/User");
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/Validator");

profileRouter.get("/users", userAuth, async (req, res) => {
	const user = req.user;
	try {
		if (user.length === 0) {
			return res.status(404).send("User not found");
		}
		res.send(user);
	} catch (err) {
		res.status(400).send("ERR:" + err.message);
	}
});

profileRouter.get("/feeds", userAuth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		const user = req?.user?.userData;
		res.send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});
//user data find by id
profileRouter.get("/userfindbyid", userAuth, async (req, res) => {
	const userId = req.body.id;
	try {
		const user = await User.findById(userId);
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

profileRouter.delete("/user-delete", userAuth, async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOneAndDelete({ emailId: userEmail });
		res.send("User Deleted Successfully");
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

profileRouter.patch("/update-user", userAuth, async (req, res) => {
	const userEmail = req.body.emailId;
	const data = req.body;
	try {
		const ALLOWED_DATA = ["firstName", "lastName", "emailId", "skills"];
		const isAllowed = Object.keys(data).every((k) => {
			return ALLOWED_DATA.includes(k);
		});
		if (!isAllowed) {
			throw new Error("User not updated!");
		}
		if (req?.body?.skills.length > 10) {
			throw new Error("Skills should not be more than 10");
		}
		const user = await User.findOneAndUpdate(
			{
				emailId: userEmail,
			},
			data,
			{
				runValidators: true,
			}
		);
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		const isAllowed = await validateProfileData(req);
		if (!isAllowed) {
			throw new Error("Invalod Updates Data!!!");
		}
		if (req?.body?.skills.length > 10) {
			throw new Error("Skills should not be more than 10");
		}

		const { emailId } = req.body;

		const user = await User.findOneAndUpdate(
			{
				emailId: emailId,
			},
			req.body,
			{
				runValidators: true,
			}
		);
		res.send(user);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

module.exports = {
	profileRouter,
};
