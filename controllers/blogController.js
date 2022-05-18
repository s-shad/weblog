const Blog = require("../models/Blog");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");
const { sendEmail } = require("../utils/mailer");
const Validator = require("fastest-validator");
const svgCaptcha = require("svg-captcha");
const v = new Validator();

exports.getIndex = async (req, res) => {
	const page = +req.query.page || 1; //convert to number
	const postPerPage = 2;
	try {
		const posts = await Blog.find({ status: "public" })
			.sort({
				createdAt: "desc",
			})
			.sort("desc")
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);

		const numberOfPage = await Blog.find({ status: "public" }).countDocuments();

		res.render("index", {
			pageTitle: "وبلاگ",
			path: "/",
			posts,
			formatDate,
			truncate,
			currentPage: page,
			nextPage: page + 1,
			previousPage: page - 1,
			hasPreviousPage: page > 1,
			hasNextPage: page * postPerPage < numberOfPage,
			lastPage: Math.ceil(numberOfPage / postPerPage),
		});
	} catch (err) {
		console.log(err);
		res.render("errors/500", {
			pageTitle: "خطا سرورا",
			path: "/404",
		});
	}
};

exports.getSinglePost = async (req, res) => {
	try {
		const post = await Blog.findOne({ _id: req.params.id }).populate("user");

		if (!post) return res.redirect("errors/404");

		res.render("post", {
			pageTitle: post.title,
			path: "/post",
			post,
			formatDate,
		});
	} catch (err) {
		console.log(err);
		res.render("errors/500", {
			pageTitle: "خطا سرورا",
			path: "/404",
		});
	}
};

exports.getContactPage = (req, res) => {
	res.render("contact", {
		pageTitle: " تماس با ما",
		path: "/contact",
		message: req.flash("success-msg"),
		error: req.flash("error"),
	});
};

exports.handelContactPage = async (req, res) => {
	const { email, fullname, message, cpatcha } = req.body;

	const schema = {
		fullname: {
			type: "string",
			min: 1,
			messages: {
				stringMin: "لطفا نام خانوادگی را پر کنید",
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
		message: {
			type: "string",
			min: 1,
			messages: {
				stringMin: "لطفا متن پیام را وارد کنید",
			},
		},
	};
	try {
		const check = await v.compile(schema);
		const result = check(req.body);
		if (result === true) {
			if (req.session.captcha === req.body.captcha) {
				sendEmail(
					email,
					fullname,
					"پیام از طرف از وبلاگ",
					`${message} <h2>ایمیل کاربر : #${email}</h2>`
				);
				req.flash("success-msg", "  پیام با موفقیت ارسال شد");
				return res.render("contact", {
					pageTitle: " تماس با ما",
					path: "/contact",
					message: req.flash("success-msg"),
					error: req.flash("error"),
				});
			}
			req.flash("error", "کد امنیتی نادرست می باشد");
			console.log("object2");
			res.render("contact", {
				pageTitle: " تماس با ما",
				path: "/contact",
				message: req.flash("success-msg"),
				error: req.flash("error"),
			});
		} else {
			console.log("object");
			res.render("contact", {
				pageTitle: " تماس با ما",
				path: "/contact",
				message: req.flash("success-msg"),
				error: req.flash("error"),
				errors: result,
			});
		}
	} catch (err) {
		console.log(err);
	}
};

exports.getCaptcha = async (req, res) => {
	const captcha = svgCaptcha.create({
		color: false,
	});
	req.session.captcha = captcha.text.toLowerCase();
	res.type("svg");
	res.send(captcha.data);
};

exports.handelSearch = async (req, res) => {
	const page = +req.query.page || 1; //convert to number
	const postPerPage = 2;

	try {
		const posts = await Blog.find({ status: "public", $text: { $search: req.body.search } })
			.sort({
				createdAt: "desc",
			})
			.sort("desc")
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);

		const numberOfPage = await Blog.find({
			status: "public",
			$text: { $search: req.body.search },
		}).countDocuments();

		res.render("index", {
			pageTitle: "نتایج جستجو شما",
			path: "/",
			posts,
			formatDate,
			truncate,
			currentPage: page,
			nextPage: page + 1,
			previousPage: page - 1,
			hasPreviousPage: page > 1,
			hasNextPage: page * postPerPage < numberOfPage,
			lastPage: Math.ceil(numberOfPage / postPerPage),
		});
	} catch (err) {
		console.log(err);
		res.render("errors/500", {
			pageTitle: "خطا سرورا",
			path: "/404",
		});
	}
};
