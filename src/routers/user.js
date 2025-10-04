/** @format */

const express = require("express");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/ConnectionRequest");
const { userAuth } = require("../middlewares/auth");

const POPULATE_RESPONSE = "firstName lastName age gender photo about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
	try {
		const loggedInUserID = req.user.userData?._id;
		const requests = await ConnectionRequest.find({
			$or: [
				{ recieverId: loggedInUserID, status: "intrested" },
				{ senderId: loggedInUserID, status: "intrested" },
			],
		})
			.populate("senderId", POPULATE_RESPONSE)
			.populate("recieverId", POPULATE_RESPONSE);
		res
			.status(200)
			.json({ message: "Requests found successfully", data: requests });
	} catch (err) {
		res.status(400).send("ERROR :" + err);
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUserId = req.user.userData?._id;
		const connections = await ConnectionRequest.find({
			$or: [
				{ recieverId: loggedInUserId, status: "accepted" },
				{ senderId: loggedInUserId, status: "accepted" },
			],
		})
			.populate("senderId", POPULATE_RESPONSE)
			.populate("recieverId", POPULATE_RESPONSE);

		res
			.status(200)
			.json({ message: "Requests found successfully", data: connections });
	} catch (err) {
		res.status(400).send("ERROR :" + err);
	}
});

module.exports = {
	userRouter,
};
