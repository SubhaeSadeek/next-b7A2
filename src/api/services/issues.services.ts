import { sql } from "../../db";
import type { RIssue } from "../../types";

class IssuesService {
	async createIssueInDB(payload: RIssue, reporterId: number) {
		const { title, description, type, status } = payload;

		const result = await sql`
    INSERT INTO issues (title, description, type, reporter_id, status)
    VALUES (${title}, ${description}, ${type}, ${reporterId}, COALESCE(${status}, 'open'))
    RETURNING * 
    `;
		return result;
	}
}

export default new IssuesService();
