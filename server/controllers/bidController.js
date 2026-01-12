import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import mongoose from 'mongoose';

// @desc    Submit a bid
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }

    // Check if user is not the owner of the gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    // Check if user has already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    res.status(201).json({
      success: true,
      data: {
        id: populatedBid._id,
        gigId: populatedBid.gigId._id,
        freelancerId: populatedBid.freelancerId._id,
        freelancerName: populatedBid.freelancerId.name,
        message: populatedBid.message,
        price: populatedBid.price,
        status: populatedBid.status,
        createdAt: populatedBid.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Only gig owner)
export const getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    const formattedBids = bids.map(bid => ({
      id: bid._id,
      gigId: bid.gigId,
      freelancerId: bid.freelancerId._id,
      freelancerName: bid.freelancerId.name,
      message: bid.message,
      price: bid.price,
      status: bid.status,
      createdAt: bid.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedBids.length,
      data: formattedBids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own bids
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status')
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    const formattedBids = bids.map(bid => ({
      id: bid._id,
      gigId: bid.gigId._id,
      gigTitle: bid.gigId.title,
      gigStatus: bid.gigId.status,
      freelancerId: bid.freelancerId._id,
      freelancerName: bid.freelancerId.name,
      message: bid.message,
      price: bid.price,
      status: bid.status,
      createdAt: bid.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedBids.length,
      data: formattedBids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Hire a freelancer (with transactional integrity)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Only gig owner)
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the bid
    const bid = await Bid.findById(req.params.bidId)
      .populate('gigId')
      .populate('freelancerId', 'name email')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    const gig = bid.gigId;
    const freelancerId = bid.freelancerId._id;

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig'
      });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer open for hiring'
      });
    }

    // Update the gig status to assigned
    await Gig.findByIdAndUpdate(
      gig._id,
      { status: 'assigned' },
      { session, new: true }
    );

    // Update the hired bid status to hired
    await Bid.findByIdAndUpdate(
      bid._id,
      { status: 'hired' },
      { session, new: true }
    );

    // Update all other bids for this gig to rejected
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(freelancerId.toString()).emit('bid-hired', {
        bidId: bid._id,
        gigId: gig._id,
        gigTitle: gig.title,
        message: `You have been hired for "${gig.title}"!`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      data: {
        id: bid._id,
        gigId: gig._id,
        freelancerId: bid.freelancerId._id,
        freelancerName: bid.freelancerId.name,
        message: bid.message,
        price: bid.price,
        status: 'hired',
        createdAt: bid.createdAt
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
