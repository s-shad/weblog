const path = require("path");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const morgan = require("morgan");

const blogRouter = require("./routes/blog");
const dashboradRouter = require("./routes/dashborad");
const connectDb = require("./config/db");
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.urlencoded({ extended: false }));

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
app.use("/dashborad", dashboradRouter);
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
