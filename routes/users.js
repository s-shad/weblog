const { Router } = require("express");
const Validator = require("fastest-validator");

const router = new Router();

const v = new Validator();

const schema = {
	fullname: {
		type: "string",
		trim: true,
		min: 4,
		max: 255,
		optional: false,
		messages: {
			required: "نام و نام خانوادگی الزامی می باشد",
			stringMin: "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد",
			stringMax: "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد",
		},
	},
	email: {
		type: "email",
		normalize: true,
		messages: {
			emailEmpty: "فیلد ایمیل نباید خالی باشد",
			required: "ایمیل الزامی می باشد",
			string: "آدرس ایمیل را بررسی کنید",
		},
	},
	password: {
		type: "string",
		min: 4,
		max: 255,
		messages: {
			required: "کلمه عبور الزامی می باشد",
			string: "کلمه عبور را بررسی کنید",
			stringMin: "کلمه عبور نباید کمتر از 4 کاراکتر باشد",
			stringMax: "کلمه عبور نمی تواند بیشتر از 255 کاراکتر باشد",
		},
	},
	confirmPassword: {
		type: "equal",
		field: "password",
		messages: {
			required: "تکرار کلمه عبور الزامی می باشد",
			string: "تکرار کلمه عبور را بررسی کنید",
			stringMin: "تکرار کلمه عبور نباید کمتر از 4 کاراکتر باشد",
			stringMax: "تکرار کلمه عبور نباید بیشتر از 255 کاراکتر باشد",
		},
	},
	$$strict: true,
};

router.get("/login", (req, res) => {
	res.render("login", {
		pageTitle: "صفحه ورود و ثبت نام",
		path: "/login",
	});
});

//@desc Register Page
//@ router GEt /users/register
router.get("/register", (req, res) => {
	res.render("register", {
		pageTitle: "ثبت نام کاربر جدید",
		path: "/register",
	});
});

//@desc Register Handeller
//@ router POST /users/register
router.post("/register", (req, res) => {
	const check = v.compile(schema);
	const result = check(req.body);
	if (result === true) {
		res.redirect("/users/login");
	} else {
		res.render("register", {
			pageTitle: "ثبت نام کاربر جدید",
			path: "/register",
			errors: result,
		});
	}
});

module.exports = router;