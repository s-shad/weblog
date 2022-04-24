const path = require("path");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");

const blogRouter = require("./routes/blog");
const dashboardRouter = require("./routes/dashboard");
const connectDb = require("./config/db");
dotenv.config({ path: "./config/config.env" });

require("./config/password");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 80000 },
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//*logging
if (process.env.NODE_ENV === "develoment") {
	app.use(morgan("dev"));
}

connectDb();

//*static
app.use(express.static(path.join(__dirname, "public")));

//*View engine
app.use(expressLayouts);
app.set("layout", "./layouts/mainLayout");
app.set("view engine", "ejs");
app.set("views", "views");

//*Routes
app.use(blogRouter);
app.use("/dashboard", dashboardRouter);
app.use("/users", require("./routes/users"));
app.use((req, res) => {
	res.render("404", {
		pageTitle: "404 | صفحه مورد نظر یافت نشد",
		path: "/404",
	});
});

app.listen(process.env.PORT, () =>
	console.log(`server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
