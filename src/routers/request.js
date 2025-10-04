/** @format */

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/ConnectionRequest");
const { User } = require("../models/User");

requestRouter.post("/request/process/:status", userAuth, async (req, res) => {
	try {
		const user = req.user.userData;
		const { status } = req.params;
		const recieverId = user._id;

		if (!req.body?.senderId) {
			throw new Error("Sender Id is required");
		}
		if (!status) {
			throw new Error("Status is required");
		}
		const { senderId } = await req.body;
		if (senderId == recieverId) {
			throw new Error("You can't send request to yourself");
		}

		const sender = User.findOne({
			id: senderId,
		});

		if (!sender) {
			throw new Error("Sender Not Found");
		}

		const connectionExits = await ConnectionRequest.findOne({
			senderId: senderId,
			recieverId: recieverId,
		});

		if (connectionExits?.senderId) {
			throw new Error("Request Already Sent");
		}

		const request = await new ConnectionRequest({
			senderId: senderId,
			recieverId: recieverId,
			status: status,
		});
		await request.save();
		res.send("Connection Created Successfully");
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

module.exports = {
	requestRouter,
};
