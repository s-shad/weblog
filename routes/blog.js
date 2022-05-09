const { Router } = require("express");

const blogController = require("../controllers/blogController");

const router = new Router();

//..@desc...Weblog index
//..@desc route..GET /
router.get("/", blogController.getIndex);
//..@desc...Weblog index

router.get("/post", blogController.getSinglePost);

module.exports = router;
