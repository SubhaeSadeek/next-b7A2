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
export function isSortOption(value: string): value is SortOption {
	return sortOptions.includes(value as SortOption);
}

export function isReportType(value: string): value is ReportType {
	return reportType.includes(value as ReportType);
}

export function isReportStatus(value: string): value is ReportStatus {
	return reportStatus.includes(value as ReportStatus);
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
