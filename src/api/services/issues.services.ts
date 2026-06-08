import { sql } from "../../db";
import type {
	Issue,
	IssueQuery,
	RIssue,
	Role,
	updateIssueBody,
} from "../../types";

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
	// update issue
	async updateIssuesFromDB(
		payload: updateIssueBody,
		issueId: number,
		role: Role,
		userId?: number,
	) {
		const result = await sql`
			SELECT * FROM issues
			WHERE id = ${issueId}`;

		const issue = result[0] ?? null;
		if (!issue) {
			return null;
		}
		if (
			role === "contributor" &&
			issue.reporter_id === userId &&
			issue.status === "open"
		) {
			const updated = await sql`
    UPDATE issues
    SET
      title = COALESCE(${payload.title}, title),
      description = COALESCE(${payload.description}, description),
      type = COALESCE(${payload.type}, type),
      updated_at = NOW()
    WHERE id = ${issueId}
    RETURNING *
  `;

			return updated[0] ?? null;
		} else if (role === "maintainer") {
			const updated = await sql`
    UPDATE issues
    SET
      title = COALESCE(${payload.title}, title),
      description = COALESCE(${payload.description}, description),
      type = COALESCE(${payload.type}, type),
      updated_at = NOW()
    WHERE id = ${issueId}
    RETURNING *
  `;

			return updated[0] ?? null;
		} else {
			throw new Error(
				`Contributor can only update issue having status being OPEN and of His own issue. this issue having ID no. ${issue.id} has status: ${issue.status.toUpperCase()}`,
			);
		}
	}

	// delete operation
	async deleteIssueFromDB(issueId: number, role: Role) {
		const result = await sql`
			SELECT * FROM issues
			WHERE id = ${issueId}`;

		const issue = result[0] ?? null;
		if (!issue) {
			return null;
		}

		if (role === "maintainer") {
			const deletedIssue = await sql`
			DELETE FROM issues
			WHERE id = ${issueId} 
			`;
			return true;
		} else {
			throw new Error(`Unouthorized!! Only maintainer can delete an issue!`);
		}
	}
}

export default new IssuesService();
