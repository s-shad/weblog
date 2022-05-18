const Validator = require("fastest-validator");

exports.v = new Validator();

exports.schema = {
	title: {
		type: "string",
		trim: true,
		min: 4,
		max: 255,
		optional: false,
		messages: {
			required: "عنوان پست الزامی می باشد",
			stringMin: "پست نباید کمتر از 5 کاراکتر باشد",
			stringMax: "عنوان پست نباید بیشتر از 255 کاراکتر باشد",
		},
	},
	body: {
		type: "string",
		messages: {
			required: "محتوای پست الزامی میباشد",
		},
	},

	$$strict: true,
};
