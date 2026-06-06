import { sql } from "../../db";
import type { IssueQuery, RIssue } from "../../types";

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

	async getAllIssuesFromDB({ sort = "newest", type, status }: IssueQuery) {
		const orderClause =
			sort === "oldest"
				? sql`ORDER BY created_at ASC`
				: sql`ORDER BY created_at DESC`;

		let issues;

		if (type && status) {
			issues = await sql`
        SELECT *
        FROM issues
        WHERE type = ${type}
        AND status = ${status}
        ${orderClause}
      `;
		} else if (type) {
			issues = await sql`
        SELECT *
        FROM issues
        WHERE type = ${type}
        ${orderClause}
      `;
		} else if (status) {
			issues = await sql`
        SELECT *
        FROM issues
        WHERE status = ${status}
        ${orderClause}
      `;
		} else {
			issues = await sql`
        SELECT *
        FROM issues
        ${orderClause}
      `;
		}

		if (!issues.length) {
			return [];
		}

		const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

		const users = await sql`
      SELECT id, name, role
      FROM users
      WHERE id = ANY(${reporterIds})
    `;

		const userMap = new Map(users.map((user) => [user.id, user]));

		return issues.map((issue) => ({
			id: issue.id,
			title: issue.title,
			description: issue.description,
			type: issue.type,
			status: issue.status,

			reporter: userMap.get(issue.reporter_id) ?? null,

			created_at: issue.created_at,
			updated_at: issue.updated_at,
		}));
	}
}

export default new IssuesService();
