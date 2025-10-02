/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequest = new Schema({
	senderId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	recieverId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
});

const ConnectionRequest = mongoose.model(
	"ConnectionRequest",
	connectionRequest
);

module.exports = {
	ConnectionRequest,
};
