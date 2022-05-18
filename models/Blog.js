const mongoose = require("mongoose");
const { schema, v } = require("./secure/postValidatoer");

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
	},
	body: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "public",
		enum: ["public", "private"],
	},
	thumbnail: {
		type: String,
		required: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

blogSchema.index({ title: "text" });

blogSchema.statics.postValidations = function (body) {
	const check = v.compile(schema);
	return check(body);
};
module.exports = mongoose.model("Blog", blogSchema);
