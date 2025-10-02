/** @format */

const express = require("express");
const app = express();
const { ConnectionRequest } = require("./models/User");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routers/auth");
const { profileRouter } = require("./routers/profile");
const { requestRouter } = require("./routers/request");

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

const { connectDB } = require("./config/database");

connectDB()
	.then(() => {
		console.log("Database connected");
		app.listen(3000, () => console.log("Server running on port 3000"));
	})
	.catch((err) => {});
