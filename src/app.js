/** @format */

const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
	res.send("Hello hello hello");
});

app.use("/", (req, res) => {
	res.send("Hello from Dashboard");
});

app.listen(3000, () => console.log("listening on port 3000"));
