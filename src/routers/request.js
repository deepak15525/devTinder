/** @format */

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/ConnectionRequest");
const { User } = require("../models/User");
const {
	requestSendValidation,
	reviewRequestValidation,
} = require("../utils/Validator");

requestRouter.post("/request/send/:status", userAuth, async (req, res) => {
	try {
		const user = req.user.userData;
		const { status } = req.params;
		const recieverId = user._id;
		const isAllowedStatus = requestSendValidation(status);
		if (!isAllowedStatus) {
			throw new Error("Status must be rejectet or ignored");
		}
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
		const data = await request.save();
		res.json({
			message: "Request Sent Successfully",
			data: data,
		});
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

requestRouter.patch("/request/review/:status", userAuth, async (req, res) => {
	try {
		const user = req.user.userData;
		const { status } = req.params;
		const recieverId = user._id;
		const { requestId } = req.body;
		if (!status) {
			throw new Error("Status is required");
		}
		if (!requestId) {
			throw new Error("Request Id is required");
		}
		const isValidStatus = reviewRequestValidation(status);

		if (!isValidStatus) {
			throw new Error("Status must be accepted,rejected");
		}
		const connectionRequestExists = await ConnectionRequest.findOne({
			_id: requestId,
			recieverId: recieverId,
			status: { $in: ["intrested"] },
		});

		if (!connectionRequestExists?.status) {
			throw new Error("Connection Request Not Found");
		}

		const connectionRequest = await ConnectionRequest.findOneAndUpdate(
			{
				_id: requestId,
				recieverId: recieverId,
			},
			{
				status: status,
			},
			{ new: true }
		);
		res.json({
			message: "Status updated suuccessfully",
			data: connectionRequest,
		});
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

module.exports = {
	requestRouter,
};
