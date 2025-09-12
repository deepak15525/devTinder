/** @format */

const mongoose = require("mongoose");

async function connectDB() {
	await mongoose.connect(
		"xxxxxxx"
	);
}

module.exports = { connectDB };
