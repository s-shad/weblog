const mongoose = require('mongoose');

const connect = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewURlParser: true,
		});
		console.log(`Mongodb connect: ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

module.exports = connect;
