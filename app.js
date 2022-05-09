const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDb = require("./config/db");
dotenv.config({ path: "./config/config.env" });
const winston = require("./config/winston");

require("./config/password");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 80000 },
		store: MongoStore.create({ mongoUrl: "mongodb://localhost/session" }),
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//*logging
if (process.env.NODE_ENV === "develoment") {
	app.use(morgan("combined", { stream: winston.stream }));
}

//*dbconnect
connectDb();

//*static
app.use(express.static(path.join(__dirname, "public")));

//*View engine
app.use(expressLayouts);
app.set("layout", "./layouts/mainLayout");
app.set("view engine", "ejs");
app.set("views", "views");

//*Routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//* 404 Page
app.use(require("./controllers/errorsController").get404);

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
