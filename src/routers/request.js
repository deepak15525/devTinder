/** @format */

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/User");

requestRouter.get("/getConnectionRequest", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const requests = await ConnectionRequest.find({ to: user._id }).populate(
			"from",
			"firstName lastName emailId"
		);
		res.status(200).json(requests);
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

module.exports = {
	requestRouter,
};
