/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 50,
		},
		lastName: {
			type: String,
			maxLength: 50,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid Email");
				}
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 5,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Password is not strong enough");
				}
			},
		},
		age: {
			type: String,
			min: 18,
		},
		gender: {
			type: String,
			validate: function validator(value) {
				if (!value.includes(["male", "female", "others"])) {
					throw new Error("Invalid Value");
				}
			},
		},
		photo: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
		},
		about: {
			type: String,
			default: "This is default about",
		},
		skills: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
