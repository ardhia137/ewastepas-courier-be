import express from 'express';
import {getAllWaste, getTotalWaste, getWaste, getWasteTypes} from '../controllers/sampahController.js';

const router = express.Router();

router.get('/waste/types', getWasteTypes);
router.get('/waste/:id', getWaste);
router.get('/waste/', getAllWaste);
router.get('/waste/total/:id', getTotalWaste);

export default router;