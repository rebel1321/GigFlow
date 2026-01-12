import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const { search, status = 'open' } = req.query;

    let query = { status };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    // Get bid counts for each gig
    const gigsWithBidCount = await Promise.all(
      gigs.map(async (gig) => {
        const bidsCount = await Bid.countDocuments({ gigId: gig._id });
        return {
          id: gig._id,
          title: gig.title,
          description: gig.description,
          budget: gig.budget,
          ownerId: gig.ownerId._id,
          ownerName: gig.ownerId.name,
          status: gig.status,
          createdAt: gig.createdAt,
          bidsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: gigsWithBidCount.length,
      data: gigsWithBidCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    const bidsCount = await Bid.countDocuments({ gigId: gig._id });

    res.status(200).json({
      success: true,
      data: {
        id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        ownerId: gig.ownerId._id,
        ownerName: gig.ownerId.name,
        status: gig.status,
        createdAt: gig.createdAt,
        bidsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      data: {
        id: populatedGig._id,
        title: populatedGig.title,
        description: populatedGig.description,
        budget: populatedGig.budget,
        ownerId: populatedGig.ownerId._id,
        ownerName: populatedGig.ownerId.name,
        status: populatedGig.status,
        createdAt: populatedGig.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private
export const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Make sure user is gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      data: {
        id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        ownerId: gig.ownerId._id,
        ownerName: gig.ownerId.name,
        status: gig.status,
        createdAt: gig.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Make sure user is gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    await gig.deleteOne();

    // Delete all bids associated with this gig
    await Bid.deleteMany({ gigId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    const gigsWithBidCount = await Promise.all(
      gigs.map(async (gig) => {
        const bidsCount = await Bid.countDocuments({ gigId: gig._id });
        return {
          id: gig._id,
          title: gig.title,
          description: gig.description,
          budget: gig.budget,
          ownerId: gig.ownerId._id,
          ownerName: gig.ownerId.name,
          status: gig.status,
          createdAt: gig.createdAt,
          bidsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: gigsWithBidCount.length,
      data: gigsWithBidCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
