import { Router } from "express";
import { auth, authorizingRole } from "../../middleware/auth";
import { issuesController } from "../controllers/issues.controllers";

const router = Router();

router.post(
	"/",
	auth,
	authorizingRole("contributor", "maintainer"),
	issuesController.createIssue,
);
router.get("/", issuesController.getAllIssues);
export const issuesRoutes = { router };
