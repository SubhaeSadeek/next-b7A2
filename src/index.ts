import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
	initDB();
	app.listen(config.port, () => {
		console.log(`Servier is running from port ${config.port}`);
	});
};
main();
