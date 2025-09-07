/** @format */

const express = require("express");
const app = express();

app.use(
	"/user",
	(req, res, next) => {
		console.log("first route 1");
		next();
		//res.send("Response 1");
	},
	(req, res, next) => {
		console.log("first route 2");
		next();
		//res.send("Response 2");
	},
	(req, res, next) => {
		console.log("first route 3");
		next();
		//res.send("Response 3");
	},
	(req, res, next) => {
		console.log("first route 4");
		//next();
		res.send("Response 4");
	}
);

app.listen(3000, () => console.log("Listening on port 3000"));
