/** @format */
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).send("Unauthenticatted User!!!");
		}
		const decoded = jwt.verify(token, "deepak");
		req.user = decoded;
		next();
	} catch (err) {
		throw new Error(err.message);
	}
	// const token = decoded.;
	// const isAuthenticated = token === "xyz";
	// if (!isAuthenticated) {
	// 	console.log("Unauthenticatted user");
	// 	res.status(401).send("Unauthenticatted User!!!");
	// } else {
	// 	console.log("Authemticatted User");
	// 	next();
	// }
};

module.exports = {
	userAuth,
};
