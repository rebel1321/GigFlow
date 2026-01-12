import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be a positive number']
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one bid per freelancer per gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Bid', bidSchema);
