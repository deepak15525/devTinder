/** @format */

const express = require("express");
const app = express();
const { User } = require("./models/User");

app.post("/signup", async (req, res) => {
	try {
		const userObj = {
			firstName: "Deepak",
			lastName: "Jaiswal",
			emailId: "jaild159@gmail.com",
			password: "Deepak12345",
		};
		const userData = new User(userObj);
		await userData.save();
		res.status(200).send("User Added Successfully");
	} catch (err) {
		console.error("Database connection failed:", err);
		res.status(500).send("Error in adding user :" + err);
	}
});

const { connectDB } = require("./config/database");

connectDB()
	.then(() => {
		console.log("Database connected");
		app.listen(3000, () => console.log("Server running on port 3000"));
	})
	.catch((err) => {});
