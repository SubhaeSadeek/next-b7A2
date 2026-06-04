import bcrypt from "bcrypt";
import { sql } from "../../db";
import type { RUser, User } from "../../types";

class AuthService {
	async createUser(user: RUser & { password: string }) {
		const { name, email, password, role } = user;

		const hashPass = await bcrypt.hash(password, 10);

		const result = await sql`
        INSERT INTO users (name, email, password, role )
        VALUES(${name}, ${email}, ${hashPass}, COALESCE(${role}, 'user'))
        RETURNING id, name, role
        `;
		return result[0];
	}
	async validateUser(userEmail: string, userPassword: string) {
		const result = await sql`
		SELECT * FROM users WHERE email = ${userEmail}
		`;
		if (!result.length) {
			return null;
		}
		const { password, ...user } = result[0] as User;
		const isUserValid = await bcrypt.compare(userPassword, password);
		return isUserValid ? user : null;
	}
	async getUserById(id: string) {
		const result = await sql`
		SELECT id, name, email, role FROM users WHERE id = ${id} 
		`;
		if (!result.length) {
			return null;
		}
		return result[0] as RUser & { id: number };
	}
}

export default new AuthService();
