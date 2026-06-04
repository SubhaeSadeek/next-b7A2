export const role = ["contributor", "maintainer"] as const;
export type Role = (typeof role)[number];

const reportType = ["bug", "feature_request"] as const;
export type ReportType = (typeof reportType)[number];

const reportStatus = ["open", "in_progress", "resolved"] as const;
export type ReportStatus = (typeof reportStatus)[number];

export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	role: Role;
	created_at: Date;
	updated_at: Date;
};

export type RUser = Omit<User, "id" | "created_at" | "updated_at" | "password">;

export type Issue = {
	id: number;
	title: string;
	description: string;
	type: ReportType;
	status?: ReportStatus;
	reporter_id: number;
	created_at: Date;
	updated_at: Date;
};

export type RIssue = Omit<
	Issue,
	"id" | "reporter_id" | "created_at" | "updated_at"
>;
