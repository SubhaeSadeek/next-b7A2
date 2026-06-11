import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { RUser, User } from "../../types";

class AuthService {
	async createUser(user: RUser & { password: string }) {
		const { name, email, password, role } = user;

		// if user exist . Although I have set unique constraint, just setting another layer is jusrt for learnng purpose
		const ifExist = await pool.query(
			`
		SELECT email FROM users
		WHERE email = $1`,
			[email],
		);

		if (ifExist.rows.length) {
			const userPrevails = {
				existingUserMsg: `User has laready been created by this ${email} email`,
			};
			return userPrevails;
		}

		const hashPass = await bcrypt.hash(password, 10);

		const result = await pool.query(
			`
        INSERT INTO users (name, email, password, role )
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *`,
			[name, email, hashPass, role],
		);
		delete result.rows[0].password;
		return result.rows[0];
	}
	async validateUser(userEmail: string, userPassword: string) {
		const result = await pool.query(
			`
		SELECT * FROM users WHERE email = $1
		`,
			[userEmail],
		);
		if (!result.rows.length) {
			return null;
		}
		const { password, ...user } = result.rows[0] as User;
		const isUserValid = await bcrypt.compare(userPassword, password);
		return isUserValid ? user : null;
	}
	async getUserById(id: string) {
		const result = await pool.query(
			`
		SELECT id, name, email, role FROM users WHERE id = $1`,
			[id],
		);
		if (!result.rows.length) {
			return null;
		}
		return result.rows[0] as RUser & { id: number };
	}
}

export default new AuthService();
