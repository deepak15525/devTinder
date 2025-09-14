/** @format */

const express = require("express");
const app = express();
const { User } = require("./models/User");

app.use(express.json());

app.post("/signup", async (req, res) => {
	try {
		const userObj = req.body;
		const userData = new User(userObj);
		await userData.save();
		res.status(200).send("User Added Successfully");
	} catch (err) {
		console.error("Database connection failed:", err);
		res.status(500).send("Error in adding user :" + err);
	}
});

//get user api's

app.get("/users", async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.find({ emailId: userEmail });
		if (user.length === 0) {
			return res.status(404).send("User not found");
		}
		res.send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

app.get("/feeds", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//user
app.get("/user", async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOne();
		res.send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//user data find by id
app.get("/userfindbyid", async (req, res) => {
	const userId = req.body.id;
	try {
		const user = await User.findById(userId);
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

app.delete("/user-delete", async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOneAndDelete({ emailId: userEmail });
		res.send("User Deleted Successfully");
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

app.patch("/update-user", async (req, res) => {
	const userEmail = req.body.emailId;
	const data = req.body;
	try {
		const user = await User.findOneAndUpdate(
			{
				emailId: userEmail,
			},
			data,
			{
				runValidators: true,
			}
		);
		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

const { connectDB } = require("./config/database");

connectDB()
	.then(() => {
		console.log("Database connected");
		app.listen(3000, () => console.log("Server running on port 3000"));
	})
	.catch((err) => {});
