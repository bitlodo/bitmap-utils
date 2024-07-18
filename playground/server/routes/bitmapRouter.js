import express from 'express'
import { getBitmapReq } from '../controllers/bitmapController.js';

const router = express.Router();

router.get('/getBitmap/:id', getBitmapReq)

export default router;