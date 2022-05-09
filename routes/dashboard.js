const { Router } = require("express");

const adminController = require("../controllers/adminController");
const { isLoggedIn } = require("../middlewares/auth");

const router = new Router();

//@desc dashboard page
//@ router GET /dashboard
router.get("/", isLoggedIn, adminController.getDashboard);

// @desc addPost
//@ router GET /dashboard/add-post
router.get("/add-post", isLoggedIn, adminController.getAddPost);

// @desc editPost
//@ router GET /dashboard/edit-post/:id
router.get("/edit-post/:id", isLoggedIn, adminController.getEditPost);

// @desc addPost
//@ router GET /dashboard/add-post
router.post("/add-post", isLoggedIn, adminController.createPost);

// @desc deletedPost
//@ router POST /dashboard/delete-post
router.get("/delete-post/:id", isLoggedIn, adminController.deteltePost);

// @desc image upload
//@ router POSt /dashboard/imgae-upload
router.post("/image-upload", isLoggedIn, adminController.uploadImage);

module.exports = router;
