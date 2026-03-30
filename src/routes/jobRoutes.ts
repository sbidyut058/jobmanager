import express from 'express';
import utils from '../utils/utils.js';
import JobController from '../controllers/JobController.js';
const routes = express.Router();

const jobController = new JobController();
routes.get('/get', utils.asyncHandler(jobController.getJob));
routes.get('/getall', utils.asyncHandler(jobController.getAllJobs))
routes.patch('/cancel', utils.asyncHandler(jobController.cancelJob));
routes.delete('/clearJobData', utils.asyncHandler(jobController.clearJobData));
routes.delete('/clearAllJobData', utils.asyncHandler(jobController.clearAllJobData));
routes.get('/getResponse', utils.asyncHandler(jobController.getJobResponse))

export default routes;