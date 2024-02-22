import { Router } from "express";
import { updateFile, ping, orderAI, uploadDiferentFiles } from "../controller/back.controller.js";
import { upload } from "../middlewares/file.middleware.js";

const router = Router();

router.post('/uploadFile', upload, updateFile);
router.post('/openAI', orderAI);
router.post('/uploadDiferentFiles', uploadDiferentFiles);
router.get('/ping', ping);


export default router;