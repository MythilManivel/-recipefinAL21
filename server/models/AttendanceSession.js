const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  sessionCode: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    name: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24 hours
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for session code for faster lookups
attendanceSessionSchema.index({ sessionCode: 1 }, { unique: true });

// Set TTL index for automatic cleanup of expired sessions
attendanceSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
