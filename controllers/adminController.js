const multer = require("multer");
const uuid = require("uuid").v4;
const sharp = require("sharp");

const Blog = require("../models/Blog");
const { formatDate } = require("../utils/jalali");
const { get500 } = require("./errorsController");
const { storage, fileFilter } = require("../utils/multer");

exports.getDashboard = async (req, res) => {
	const page = +req.query.page || 1; //convert to number
	const postPerPage = 2;
	try {
		const numberOfPage = await Blog.find({ user: req.user._id }).countDocuments();
		const blogs = await Blog.find({ user: req.user.id })
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);
		return res.render("private/blogs", {
			pageTitle: "بخش مدیریت | داشبورد",
			path: "/dashboard",
			layout: "./layouts/dashLayout",
			fullname: req.user.fullname,
			blogs,
			formatDate,
			currentPage: page,
			nextPage: page + 1,
			previousPage: page - 1,
			hasPreviousPage: page > 1,
			hasNextPage: page * postPerPage < numberOfPage,
			lastPage: Math.ceil(numberOfPage / postPerPage),
		});
	} catch (err) {
		console.log(err);
		get500(req, res);
	}
};

exports.getAddPost = (req, res) => {
	res.render("private/addPost", {
		pageTitle: "بخش مدیریت | ساخت پست جدید  ",
		path: "/dashboard/add-post",
		layout: "./layouts/dashLayout",
		fullname: req.user.fullname,
	});
};

exports.getEditPost = async (req, res) => {
	const post = await Blog.findOne({ _id: req.params.id });
	if (!post) {
		return res.redirect("/errors/404");
	}
	if (post.user.toString() !== req.user.id) {
		return res.redirect("/dashboard");
	} else {
		res.render("private/editPost", {
			pageTitle: "بخش مدیریت | ویرایش پست ",
			path: "/dashboard/edit-post",
			layout: "./layouts/dashLayout",
			fullname: req.user.fullname,
			blog: post,
		});
	}
};

exports.EditPost = async (req, res) => {
	const post = await Blog.findOne({
		_id: req.params.id,
	});
	if (!post) {
		return res.redirect("/errors/404");
	}
	if (post.user.toString() !== req.user.id) {
		return res.redirect("/dashboard");
	} else {
		try {
			const { title, status, body } = req.body;
			post.status = status;
			post.title = title;
			post.body = body;
			await post.save();
			return res.redirect("/dashboard");
		} catch (err) {
			console.log(err);
			get500(req, res);
		}
		res.render("private/editPost", {
			pageTitle: "بخش مدیریت | ویرایش پست",
			path: "/dashboard/edit-post",
			layout: "./layouts/dashLayout",
			fullname: req.user.fullname,
			blog: post,
		});
	}
};

exports.createPost = async (req, res) => {
	try {
		console.log(req.body);
		await Blog.create({ ...req.body, user: req.user.id });
		res.redirect("/dashboard");
	} catch (err) {
		console.log(err);
		get500(req, res);
	}
	res.render("private/blogs", {
		pageTitle: "بخش مدیریت | داشبورد",
		path: "/dashboard",
		layout: "./layouts/dashLayout",
		fullname: req.user.fullname,
		blogs,
	});
};

exports.uploadImage = (req, res) => {
	const upload = multer({
		limits: { fileSize: 4000000 },
		dest: "uploads/",
		storage: storage,
		fileFilter: fileFilter,
	}).single("image");

	upload(req, res, async err => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			if (req.file) {
				const fileName = `${Date.now()}_${req.file.originalname}}`;
				await sharp(req.file)
					.jpeg({
						quality: 60,
					})
					.toFile(`./public/uploads/${fileName}`)
					.catch(err => console.log("dd" + err));
				res.status(200).send(`http://localhost:3000/public/uploads/${fileName}`);
			} else {
				res.send("جهت آپلود عکسی انتخاب کنید");
			}
		}
	});
};

exports.deteltePost = async (req, res) => {
	try {
		const result = await Blog.findOneAndRemove({
			_id: req.params.id,
		});
		console.log(result);
		return res.redirect("/dashboard");
	} catch (err) {
		console.log(err);
		get500(req, res);
	}
};
