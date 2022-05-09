const bcrypt = require("bcryptjs");
const flash = require("connect-flash/lib/flash");
const passport = require("passport");
const fetch = require("node-fetch");

const User = require("../models/User");
const { get500 } = require("../controllers/errorsController");

exports.login = (req, res) => {
	res.render("login", {
		pageTitle: "صفحه ورود و ثبت نام",
		path: "/login",
		message: req.flash("success-msg"),
		error: req.flash("error"),
	});
};

exports.register = (req, res) => {
	res.render("register", {
		pageTitle: "ثبت نام کاربر جدید",
		path: "/register",
	});
};

exports.createUser = async (req, res) => {
	try {
		const result = await User.schemaVliation(req.body);
		if (result === true) {
			const { fullname, email, password } = req.body;
			const hash = await bcrypt.hash(password, 10);
			const user = await User.findOne({ email });
			if (!user) {
				await User.create({ fullname, email, password: hash });
				req.flash("success-msg", "ثبت نام انجام شد");
				console.log(req.flash);
				return res.redirect("/users/login");
			} else {
				console.log(user);
				return res.render("register", {
					pageTitle: "ثبت نام کاربر جدید",
					path: "/register",
					errors: [{ message: "کاربری با این ایمیل موجود است" }],
				});
			}
		} else {
			res.render("register", {
				pageTitle: "ثبت نام کاربر جدید",
				path: "/register",
				errors: result,
			});
		}
	} catch (err) {
		console.log(err);
		get500(req, res);
	}
};

exports.loginHandeler = async (req, res, next) => {
	const response_key = req.body["g-recaptcha-response"];

	if (!response_key) {
		req.flash("error", "اعتبار سنجی الزامی می باشد");
		return res.redirect("/users/login");
	}
	try {
		const secret_key = process.env.SECRET_KEY;
		const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

		const response = await fetch(url, {
			method: "post",
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.log("err");
		get500(req, res);
	}

	passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
};

exports.rememberMe = (req, res) => {
	req.body.remember
		? (req.session.cookie.maxAge = 24 * 60 * 60 * 1000) //1 day
		: (req.session.cookie.expires = null);
	res.redirect("/dashboard");
};

exports.logout = (req, res) => {
	req.logout();
	req.flash("success-msg", "خروج موفقیت آمیز بود");
	res.redirect("/users/login");
};
