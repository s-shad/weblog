const bcrypt = require("bcryptjs");
const flash = require("connect-flash/lib/flash");
const passport = require("passport");

const User = require("../models/User");

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
	}
};

exports.loginHandeler = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
};
