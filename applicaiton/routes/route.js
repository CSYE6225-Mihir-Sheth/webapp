import express from 'express';
import * as assignmentController from '../assignmentApi/assignmentControllers.js';

// Destructure controller methods
const { 
  post, 
  remove, 
  put, 
  patch, 
  head, 
  options, 
  get, 
  getAssignmentUsingId 
} = assignmentController;

const assignmentRouter = express.Router();

// Route handlers for `/Assignment`
assignmentRouter
  .route('/Assignments')
  .post(post)
  .get(get)
  .patch(patch)
  .head(head)
  .options(options);

// Route handlers for `/Assignment/:id`
assignmentRouter
  .route('/Assignments/:id')
  .delete(remove)
  .put(put)
  .get(getAssignmentUsingId)
  .patch(patch)
  .head(head)
  .options(options);
//
// Uncomment the healthz route if needed
// assignmentRouter
//   .route('/healthz')
//   .all(assignmentController.healthz)

// Catch-all middleware for 404 response
assignmentRouter.use((req,res) => {
    res.status(404).send('');
});

export default assignmentRouter;
