const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  tags: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  applied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Refers to the User model
});

module.exports = mongoose.model('Job', jobSchema);
