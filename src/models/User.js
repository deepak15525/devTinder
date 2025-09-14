/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;

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
			match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 5,
			maxLength: 14,
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
