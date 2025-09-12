/** @format */

const mongoose = require("mongoose");

async function connectDB() {
	await mongoose.connect(
		"mongodb+srv://Deepak:Deepak12345@cluster0.c0irzg0.mongodb.net/devTinder"
	);
}

module.exports = { connectDB };
