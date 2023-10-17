import express from 'express';
import * as assignmentController from '../assignmentApi/assignmentControllers.js';

// Destructure controller methods
const { post, remove, put } = assignmentController;  

const assignmentRouter = express.Router();

/** 
 * Route to add an assignment
*/
assignmentRouter
  .route('/Assignment')
  .post(post);

/**
 * Route to remove an assignment
*/  
assignmentRouter
  .route('/Assignment/:id')
  .delete(remove);

assignmentRouter
  .route('/Assignment/:id')
  .put(put);

assignmentRouter
  .route('/Assignment')
  .get(assignmentController.get)


assignmentRouter
  .route('/Assignment/:id')
  .get(assignmentController.getAssignmentUsingId)

// assignmentRouter
//   .route('/healthz')
//   .all(assignmentController.healthz)


assignmentRouter.use((req,res) => {
    res.status(404).send('');
});

export default assignmentRouter;