import { pool } from "../../db";
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

		const result = await pool.query(
			`
    INSERT INTO issues (title, description, type, reporter_id, status)
    VALUES ($1, $2, $3, $4, COALESCE($5, 'open'))
    RETURNING * 
    `,
			[title, description, type, reporterId, status],
		);
		return result.rows;
	}

	async getAllIssuesFromDB({ sort = "newest", type, status }: IssueQuery) {
		const sortSql =
			sort === "oldest"
				? "ORDER BY created_at ASC"
				: "ORDER BY created_at DESC";

		let issues;

		if (type && status) {
			issues = await pool.query(
				`
        SELECT *
        FROM issues
        WHERE type = $1
        AND status = $2
        ${sortSql}
      `,
				[type, status],
			);
		} else if (type) {
			issues = await pool.query(
				`
        SELECT *
        FROM issues
        WHERE type = $1
        ${sortSql}
      `,
				[type],
			);
		} else if (status) {
			issues = await pool.query(
				`
        SELECT *
        FROM issues
        WHERE status = $1
        ${sortSql}
      `,
				[status],
			);
		} else {
			issues = await pool.query(`
        SELECT *
        FROM issues
        ${sortSql}
      `);
		}

		if (!issues.rows.length) {
			return [];
		}

		const reporterIds = [
			...new Set(issues.rows.map((issue) => issue.reporter_id)),
		];

		const users = await pool.query(
			`
	SELECT id, name, role
	FROM users
	WHERE id = ANY($1::int[])
	`,
			[reporterIds],
		);

		const userMap = new Map(users.rows.map((user) => [user.id, user]));

		return issues.rows.map((issue) => ({
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
		const issue = await pool.query(
			`
		SELECT * FROM issues
		WHERE id = $1
		
		`,
			[issueId],
		);
		if (!issue.rows.length) {
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
		} = issue.rows[0] as Issue;

		const reporter = await pool.query(
			`
		SELECT id, name, role FROM users
		WHERE id = $1
		`,
			[reporter_id],
		);

		return {
			id,
			title,
			description,
			type,
			status,
			reporter: reporter.rows[0],
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
		const result = await pool.query(
			`
			SELECT * FROM issues
			WHERE id = $1`,
			[issueId],
		);

		const issue = result.rows[0] ?? null;
		if (!issue) {
			const ifIssueNotExist = {
				issueNotExist: `Issue with ID: ${issueId} does not exist in Database`,
			};
			return ifIssueNotExist;
		}
		// Contributor || maintainer update API
		if (
			role === "maintainer" ||
			(role === "contributor" &&
				issue.reporter_id === userId &&
				issue.status === "open")
		) {
			const updated = await pool.query(
				`
	UPDATE issues
	SET
		title = COALESCE($1, title),
		description = COALESCE($2, description),
		type = COALESCE($3, type),
		updated_at = NOW()
	WHERE id = $4
	RETURNING *
	`,
				[payload.title, payload.description, payload.type, issueId],
			);

			return updated.rows[0] ?? null;
		} else {
			throw new Error(
				`Contributor can only update issue having status being OPEN and of His own issue. this issue having ID no. ${issue.id} has status: ${issue.status.toUpperCase()} and perhaps may be is NOT his Own issue`,
			);
		}
	}

	// delete operation
	async deleteIssueFromDB(issueId: number, role: Role) {
		const result = await pool.query(
			`
			SELECT * FROM issues
			WHERE id = $1`,
			[issueId],
		);

		const issue = result.rows[0] ?? null;
		if (!issue) {
			return null;
		}

		if (role === "maintainer") {
			const deletedIssue = await pool.query(
				`
			DELETE FROM issues
			WHERE id = $1 
			`,
				[issueId],
			);
			return true;
		} else {
			throw new Error(`Unouthorized!! Only maintainer can delete an issue!`);
		}
	}
}

export default new IssuesService();
