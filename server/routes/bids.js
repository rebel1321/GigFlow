import express from 'express';
import {
  createBid,
  getBidsForGig,
  getMyBids,
  hireBid
} from '../controllers/bidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireBid);

export default router;
