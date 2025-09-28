/** @format */

const express = require("express");
const app = express();
const { User } = require("./models/User");
const { validationRules } = require("./utils/Validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
//Register
app.post("/signup", async (req, res) => {
	try {
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		validationRules(req);
		const userData = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
		await userData.save();
		res.status(200).send("User Added Successfully");
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

//Login
app.post("/login", async (req, res) => {
	const { emailId, password } = req.body;
	try {
		const user = await User.findOne({
			emailId,
		});
		if (!user) {
			res.status(404).send("Unauthenticated User");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!user) {
			res.status(404).send("Unauthenticated User");
		}

		const token = jwt.sign({ emailId: user.emailId }, "deepak", {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: false, // Set true if using HTTPS
		});

		res.send("Logged In Successfully");
	} catch (err) {
		res.status(500).send("ERROR :" + err.message);
	}
});

//get user api's

app.get("/users", userAuth, async (req, res) => {
	const user = req.user;
	try {
		if (user.length === 0) {
			return res.status(404).send("User not found");
		}
		res.send(user);
	} catch (err) {
		res.status(400).send("ERR:" + err.message);
	}
});

app.get("/feeds", userAuth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//user
app.get("/user", userAuth, async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOne();
		res.send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

//user data find by id
app.get("/userfindbyid", userAuth, async (req, res) => {
	const userId = req.body.id;
	try {
		const user = await User.findById(userId);
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

app.delete("/user-delete", userAuth, async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOneAndDelete({ emailId: userEmail });
		res.send("User Deleted Successfully");
	} catch (err) {
		res.status(400).send("Something went wrong!!!");
	}
});

app.patch("/update-user", userAuth, async (req, res) => {
	const userEmail = req.body.emailId;
	const data = req.body;
	try {
		const ALLOWED_DATA = ["firstName", "lastName", "emailId", "skills"];
		const isAllowed = Object.keys(data).every((k) => {
			return ALLOWED_DATA.includes(k);
		});
		if (!isAllowed) {
			throw new Error("User not updated!");
		}
		if (req?.body?.skills.length > 10) {
			throw new Error("Skills should not be more than 10");
		}
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
