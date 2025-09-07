/** @format */

const express = require("express");
const app = express();
const { user } = require("./middlewares/auth");

app.get("/user", user, (req, res) => {
	res.send("User is Authenricatted");
});

//Error Handling Code using app.use() or whild card route

app.use("/", (err, req, res, next) => {
	if (err) {
		res.status(500).send("Something went wrong!!!");
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
