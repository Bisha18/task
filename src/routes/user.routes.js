import Router from "express"
const router = Router();
import { addUsers, getSortedUsers } from "../controllers/user.controller.js";

router.get('/',getSortedUsers);
router.post('/',addUsers)


export default router