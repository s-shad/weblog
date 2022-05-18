const nodemailer = require("nodemailer");
const smtpTransPort = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransPort({
	host: "mail.sokhanesabz.com",
	port: "465",
	secure: true,
	auth: {
		user: "saeid@sokhanesabz.com",
		pass: "saeid123698741",
	},
	tls: { rejectUnauthorized: false },
});

exports.sendEmail = (email, fullname, subject, text) => {
	const transporter = nodemailer.createTransport(transporterDetails);
	transporter.sendMail({
		from: "saeid@sokhanesabz.com", // sender address
		to: email,
		subject: subject,
		html: `سلام  ${fullname}
		<p1>${text}</p1>`,
	});
};
