import express from 'express';
import { getPickupRequests, acceptPickupRequest, getPickupHistory, getCalculatePickupTotals } from '../controllers/penjemputanController.js';

const router = express.Router();

router.get('/pickup/requests', getPickupRequests);
router.get('/pickup/count', getCalculatePickupTotals);
router.post('/pickup/accept/:id', acceptPickupRequest);
router.get('/pickup/history/', getPickupHistory);

export default router;
