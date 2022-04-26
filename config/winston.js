const appRoot = require("app-root-path");
const flash = require("connect-flash/lib/flash");
const winston = require("winston");

const options = {
	File: {
		level: "info",
		format: winston.format.json(),
		handleExceptions: true,
		filename: `${appRoot}/logs/app.log`,
		maxFile: 5,
		maxsize: 5000000,
	},
	Console: {
		handleExceptions: true,
		format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
	},
};

const logger = winston.createLogger({
	defaultMeta: { service: "user-service" },
	transports: [
		//
		// - Write all logs with importance level of `error` or less to `error.log`
		// - Write all logs with importance level of `info` or less to `combined.log`
		//
		new winston.transports.File(options.File),
		// new winston.transports.Console(options.Console),
	],
	exitOnError: false,
});

logger.stream = {
	write: function (message) {
		logger.info(message);
	},
};

module.exports = logger;
