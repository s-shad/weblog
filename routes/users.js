const { Router } = require("express");

const userController = require("../controllers/userController");

const router = new Router();

//@desc login Page
//@ router GEt /users/login
router.get("/login", userController.login);

//@desc login handeller
//@ router POST /users/login
router.post("/login", userController.loginHandeler, userController.rememberMe);

//@desc Register Page
//@ router GEt /users/register
router.get("/register", userController.register);

//@desc forget password Page
//@ router GEt /users/forget-password
router.get("/forget-password", userController.forgetPassword);

//@desc forget password Page
//@ router GEt /users/forget-password
router.get("/reset-password/:token", userController.resetPass);

//@desc handel forget password Page
//@ router POST /users/forget-password
router.post("/forget-password", userController.handelforgetPass);

//@desc handel Handel Reset password
//@ router POST /users/reset-password
router.post("/reset-password/:id", userController.handelResetPass);

//@desc Logout
//@ router GEt /users/register
router.get("/logout", userController.logout);

//@desc Register Handeller
//@ router POST /users/register
router.post("/register", userController.createUser);

module.exports = router;
