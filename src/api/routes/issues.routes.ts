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

export const issuesRoutes = { router };
