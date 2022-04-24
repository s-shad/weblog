const { Router } = require("express");

const userController = require("../controllers/userController");

const router = new Router();

//@desc login Page
//@ router GEt /users/login
router.get("/login", userController.login);

//@desc login handeller
//@ router POST /users/login
router.post("/login", userController.loginHandeler);

//@desc Register Page
//@ router GEt /users/register
router.get("/register", userController.register);

//@desc Register Handeller
//@ router POST /users/register
router.post("/register", userController.createUser);

module.exports = router;
