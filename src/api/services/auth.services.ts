import bcrypt from "bcrypt";
import { sql } from "../../db";
import type { RUser } from "../../types";

class AuthService {
	async createUser(user: RUser & { password: string }) {
		const { name, email, age, password, role } = user;

		const hashPass = await bcrypt.hash(password, 10);

		const result = await sql`
        INSERT INTO users (name, email, age, password_hash, role )
        VALUES(${name}, ${email}, ${age}, ${hashPass}, COALESCE(${role}, 'user'))
        RETURNING id, name, age, role
        `;
		return result[0];
	}
	async validateUser(userEmail: string, password: string) {
		const result = await sql`
		SELECT * FROM users WHERE email = ${userEmail}
		`;
	}
}

export default new AuthService();
