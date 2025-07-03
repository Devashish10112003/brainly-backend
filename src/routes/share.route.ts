import express  from "express";
import { shareBrain,openBrain } from "../controllers/share.controller.js";
import { middleware } from "../middleware/middleware.js";

const router=express.Router();

router.post('/brain',middleware,shareBrain);
router.get('/:brainLink',openBrain);

export default router;