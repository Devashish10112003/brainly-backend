import express  from "express";
import { addContent,getAllContent,deleteContent } from "../controllers/content.controller";
import { middleware } from "../middleware/middleware";
const router=express.Router();

router.post('/add-content',middleware,addContent);
router.get('/get-content',middleware,getAllContent);
router.delete('/delete-content',middleware,deleteContent);

export default router;