const bcrypt = require('bcrypt');
const Job = require('../models/job.js');
 
 /** Middleware for verifying user */

 
 

 exports.createJob = async function (req, res) {
   // Extract job details from request body
   const { jobTitle, tags, price, description, token, amount } = req.body;
 
   // Create a new job instance
   const newJob = new Job({
     jobTitle,
     tags,
     price,
     description,
     token,
     amount
   });
 
   try {
     // Save the new job to the database
     const savedJob = await newJob.save();
 
     // Return a response with the saved job details
     res.status(201).json(savedJob);
   } catch (err) {
     // Handle errors
     console.error(err);
     res.status(500).json({ error: 'Failed to create job' });
   }
 };
 

 

exports.getAllJobs = async function (req, res) {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();
    
    // Send the jobs as a response
    res.status(200).json(jobs);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// module.exports = router;

     