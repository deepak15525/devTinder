/** @format */

const user = (req, res, next) => {
	const token = "xyza";
	const isAuthenticated = token === "xyz";
	if (!isAuthenticated) {
		console.log("Unauthenticatted user");
		res.status(401).send("Unauthenticatted User!!!");
	} else {
		console.log("Authemticatted User");
		next();
	}
};

module.exports = {
	user,
};
