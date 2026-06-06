import { sql } from "../../db";
import type { Issue, IssueQuery, RIssue } from "../../types";

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
		const sortSql =
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
        ${sortSql}
      `;
		} else if (type) {
			issues = await sql`
        SELECT *
        FROM issues
        WHERE type = ${type}
        ${sortSql}
      `;
		} else if (status) {
			issues = await sql`
        SELECT *
        FROM issues
        WHERE status = ${status}
        ${sortSql}
      `;
		} else {
			issues = await sql`
        SELECT *
        FROM issues
        ${sortSql}
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
	async getSingleIssueFromDB(issueId: number) {
		const issue = await sql`
		SELECT * FROM issues
		WHERE id = ${issueId}
		
		`;
		if (!issue.length) {
			return null;
		}
		const {
			id,
			title,
			description,
			type,
			status,
			reporter_id,
			created_at,
			updated_at,
		} = issue[0] as Issue;

		const reporter = await sql`
		SELECT id, name, role FROM users
		WHERE id = ${reporter_id}
		`;

		return {
			id,
			title,
			description,
			type,
			status,
			reporter: reporter[0],
			created_at,
			updated_at,
		};
	}
}

export default new IssuesService();
