const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

// module.exports = mongoose.model("Message", MessageSchema);
