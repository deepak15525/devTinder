/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const statusValue = ["ignored", "accepted", "rejected", "matched"];

const connectionRequest = new Schema(
	{
		senderId: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		recieverId: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			enum: {
				values: statusValue,
				message: "{VALUE} is not supported.",
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequest.index({ senderId: 1, recieverId: 1 });

const ConnectionRequest = mongoose.model(
	"ConnectionRequest",
	connectionRequest
);

module.exports = {
	ConnectionRequest,
};
