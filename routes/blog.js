const { Router } = require("express");

const blogController = require("../controllers/blogController");

const router = new Router();

//..@desc...Weblog index
//..@desc route..GET /
router.get("/", blogController.getIndex);

router.get("/post/:id", blogController.getSinglePost);

//..@desc... Contact Page
//..@desc route..GET /contact
router.get("/contact", blogController.getContactPage);

//..@desc... Contact Page
//..@desc route..GET /contact
router.post("/contact", blogController.handelContactPage);

//..@desc...weblog  captcha
//..@desc route..GET /captcha.png
router.get("/captcha.png", blogController.getCaptcha);

//..@desc...weblog  search
//..@desc route..POST /search
router.post("/search", blogController.handelSearch);

module.exports = router;
