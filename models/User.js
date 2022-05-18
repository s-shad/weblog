const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const { schema, v } = require("./secure/userValidatoer");
const { use } = require("passport");

const userSchema = new mongoose.Schema({
	fullname: {
		required: true,
		type: String,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		trim: true,
		maxlength: 255,
		minlength: 4,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.statics.schemaVliation = function (body) {
	const check = v.compile(schema);
	return check(body);
};

userSchema.pre("save", function (next) {
	let user = this;

	if (!user.isModified("password")) return next();

	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) return next(err);

		user.password = hash;
		next();
	});
});

module.exports = mongoose.model("User", userSchema);
