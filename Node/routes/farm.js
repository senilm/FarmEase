import { Router } from "express";
import { addFarm, addUserToFarm, deleteFarm, getAllFarm, getSingleUsersFarm, updateFarm } from "../controllers/farm.js";

const router = Router();

router.route('/').post(addFarm) 
router.route('/').get(getAllFarm)  
router.route('/:userId').get(getSingleUsersFarm)  
router.route('/:farmId').delete(deleteFarm)  
router.route('/:farmId').patch(updateFarm)  
router.route('/:farmId').post(addUserToFarm)   

export default router
