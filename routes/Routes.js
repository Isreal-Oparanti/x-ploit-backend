const express = require('express');
const { register, login, updateUser, getUser, getProfile, acceptApplication, cancelApplication ,updateOrder,saveReview } = require('../controllers/AuthController.js');
const { createJob, getAllJobs, getAJob, applyForJob, getApplyJobs } = require('../controllers/job.js');
// const  localVariables  = require('../middleware/auth.js')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create-jobs', createJob);
router.put('/update', updateUser)
router.get('/get-jobs', getAllJobs);
router.post('/update-order', updateOrder)
router.post('/get-user', getUser);
router.post('/get-profile', getProfile)
router.post('/get-apply-jobs', getApplyJobs);
router.post('/save-review', saveReview)
router.post('/get-job', getAJob);
router.post('/apply', applyForJob)
router.post('/accept-application', acceptApplication)
router.post('/cancel-application', cancelApplication)

module.exports = router;
    
