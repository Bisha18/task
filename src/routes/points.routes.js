import { Router } from "express";
import { claimHistoryForSpecificUser, claimPoints, getClaimHistory } from "../controllers/points.controller.js";

const router = Router();

router.post('/',claimPoints);
router.get('/history',getClaimHistory);
router.get('/history/:userId',claimHistoryForSpecificUser);

export default router