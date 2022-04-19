const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	fullname: {
		required: true,
		type: String,
		trim: true,
	},
	emai: {
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

const User = mongoose.model('User', userSchema);

module.exports = User;
