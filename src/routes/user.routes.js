import Router from "express"
import { addUsers, getSortedUsers } from "../controllers/user.controller.js";
const router = Router();

router.get('/',getSortedUsers);
router.post('/',addUsers)


export default router