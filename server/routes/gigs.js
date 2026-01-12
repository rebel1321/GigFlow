import express from 'express';
import {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs
} from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getGigs)
  .post(protect, createGig);

router.get('/my-gigs', protect, getMyGigs);

router.route('/:id')
  .get(getGig)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;
