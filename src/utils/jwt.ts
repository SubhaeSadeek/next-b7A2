import jwt from "jsonwebtoken";
import config from "../config";
import type { RUser } from "../types";
export const signToken = (payload: RUser) => {
	const accessToken = jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });

	const refrehToken = jwt.sign(payload, config.refresh_secret, {
		expiresIn: "7d",
	});
	return { accessToken, refrehToken };
};
