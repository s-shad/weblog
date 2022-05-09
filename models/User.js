const mongoose = require("mongoose");

const { schema, v } = require("./secure/userValidatoer");

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

module.exports = mongoose.model("User", userSchema);
