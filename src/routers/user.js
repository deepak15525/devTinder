/** @format */

const express = require("express");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/ConnectionRequest");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/User");

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

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		const loggedInUserId = req.user.userData?._id;
		const connections = await ConnectionRequest.find({
			$or: [{ recieverId: loggedInUserId }, { senderId: loggedInUserId }],
		}).select(["recieverId", "senderId"]);
		const hasUniqueConnectionData = new Set();

		connections.forEach((req) => {
			hasUniqueConnectionData.add(req.senderId.toString());
			hasUniqueConnectionData.add(req.recieverId.toString());
		});

		const excludeIds = Array.from(hasUniqueConnectionData);
		excludeIds.push(loggedInUserId.toString());
		//console.log(Array.from(hasUniqueConnectionData));
		const users = await User.find({
			_id: { $nin: excludeIds },
		}).select(["firstName", "lastName"]);
		res.json({
			message: "Feed fetched successfully",
			data: users,
		});
	} catch (err) {
		res.status(400).send("ERROR :" + err.message);
	}
});

module.exports = {
	userRouter,
};
