const { Router } = require("express");
const { isLoggedIn } = require("../middlewares/auth");

const router = new Router();

router.get("/", isLoggedIn, (req, res) => {
	res.render("dashboard", {
		pageTitle: "بخش مدیریت | داشبورد",
		path: "/dashboard",
		layout: "./layouts/dashLayout",
	});
});

router.get("/login", (req, res) => {
	res.render("login", {
		pageTitle: "صفحه ورود و ثبت نام",
		path: "/login",
	});
});

module.exports = router;
