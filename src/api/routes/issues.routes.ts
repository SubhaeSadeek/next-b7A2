import { Router } from "express";
import { auth, authorizingRole } from "../../middleware/auth";
import { issuesController } from "../controllers/issues.controllers";

const router = Router();
// create issues router
router.post(
	"/",
	auth,
	authorizingRole("contributor", "maintainer"),
	issuesController.createIssue,
);
// get all issues through query params router
router.get("/", issuesController.getAllIssues);

// get single issue by issue ID
router.get("/:issueId", issuesController.getSingleIssue);
// update issues by user id (ROLE BASED)
router.patch(
	"/:issueId",
	auth,
	authorizingRole("contributor", "maintainer"),
	issuesController.updateIssue,
);

export const issuesRoutes = { router };
