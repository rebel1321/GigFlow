import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [0, 'Budget must be a positive number']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for searching by title
gigSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Gig', gigSchema);
