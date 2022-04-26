const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
passport.use(
	new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
		User.findOne({ email }, async function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "کاربری با این ایمیل وجود نمی باشد" });
			}
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return done(null, false, { message: "ایمیل یا پسورد صحیح نمی باشد" });
			}
			return done(null, user);
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
