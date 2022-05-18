const bcrypt = require("bcryptjs");
const flash = require("connect-flash/lib/flash");
const passport = require("passport");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { get500 } = require("../controllers/errorsController");
const { sendEmail } = require("../utils/mailer");

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
				sendEmail(email, fullname, "خوش آمد گویی", " به سایت سعید شاد خوش آمدید");
				req.flash("success-msg", "ثبت نام انجام شد");
				return res.redirect("/users/login");
			} else {
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

exports.forgetPassword = async (req, res) => {
	res.render("forgetPass", {
		pageTitle: "فراموشی رمز عبور",
		path: "/login",
		message: req.flash("success-msg"),
		error: req.flash("error"),
	});
};

exports.handelforgetPass = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email: email });
	console.log(user);
	if (!user) {
		req.flash("error", "کاربری با این ایمیل موجود نیست");
		return res.render("forgetPass", {
			pageTitle: "فراموشی رمز عبور",
			path: "/login",
			message: req.flash("success-msg"),
			error: req.flash("error"),
		});
	}
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
	const resetLink = `http://localhost:3000/users/reset-password/${token}`;
	console.log(email);
	sendEmail(
		email,
		user.fullname,
		"فراموشی رمز عبور",
		`جهت بازیابی رمز روی لینک زیر کلیلک کنید
	<br>
	<a href="${resetLink}">ریست پسورد</a>`
	);
	req.flash("success-msg", "لینک بازیابی رمز برای شما ارسال شد");
	return res.render("forgetPass", {
		pageTitle: "فراموشی رمز عبور",
		path: "/login",
		message: req.flash("success-msg"),
		error: req.flash("error"),
	});
};

exports.resetPass = (req, res) => {
	const token = req.params.token;

	let tokenDecod;

	try {
		tokenDecod = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		console.log(err);
		if (!tokenDecod) return res.redirect("/404");
	}
	return res.render("resetPass", {
		pageTitle: " رمز عبور",
		path: "/login",
		message: req.flash("success-msg"),
		error: req.flash("error"),
		userId: tokenDecod.userId,
	});
};

exports.handelResetPass = async (req, res) => {
	const { password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		req.flash("error", "پسورد و تکرار آن یکسان نیست");
		return res.render("resetPass", {
			pageTitle: " رمز عبور",
			path: "/login",
			message: req.flash("success-msg"),
			error: req.flash("error"),
			userId: tokenDecod.userId,
		});
	}
	const user = await User.findOne({ _id: req.params.id });

	if (!user) return res.redirect("/404");

	user.password = password;
	await user.save();

	req.flash("success-msg", "پسود با موفقیت تغییر کرد");
	res.redirect("/users/login");
};
