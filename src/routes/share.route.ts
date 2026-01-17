import express  from "express";
import { shareBrain,openBrain,shareContent,openContent } from "../controllers/share.controller.js";
import { middleware } from "../middleware/middleware.js";

const router=express.Router();

router.post('/brain',middleware,shareBrain);
router.post('/content',middleware,shareContent);
router.get('/content/:contentId',openContent);
router.get('/:brainLink',openBrain);

export default router;