export const role = ["contributor", "maintainer"] as const;
export type Role = (typeof role)[number];

const reportType = ["bug", "feature_request"] as const;
export type ReportType = (typeof reportType)[number];

const reportStatus = ["open", "in_progress", "resolved"] as const;
export type ReportStatus = (typeof reportStatus)[number];

export const sortOptions = ["newest", "oldest"] as const;
export type SortOption = (typeof sortOptions)[number];

export interface IssueQuery {
	sort?: SortOption;
	type?: ReportType;
	status?: ReportStatus;
}
export const isRole = (role: string): role is Role =>
	role.includes(role as Role);

export function isSortOption(sort: string): sort is SortOption {
	return sortOptions.includes(sort as SortOption);
}

export function isReportType(type: string): type is ReportType {
	return reportType.includes(type as ReportType);
}

export function isReportStatus(status: string): status is ReportStatus {
	return reportStatus.includes(status as ReportStatus);
}
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
export type updateIssueBody = Omit<
	Issue,
	"id" | "reporter_id" | "created_at" | "updated_at" | "status"
>;
