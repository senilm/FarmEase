import express from "express"
import { getUsers, getFarmUsers } from "../controllers/users.js";

const router = express.Router();


router.route('/').get(getUsers);
router.route('/farm/:farmId').get(getFarmUsers);


export default router;