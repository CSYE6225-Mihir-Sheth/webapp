import { request } from 'express';
import db from '../database/dbConnection.js';
import { authenticateUser } from '../support/assignmentService.js';


//create
export const createAssignment = async(request, response) => {
  let newDetails = request.body;
  newDetails.user_id = autenticated;
  newDetails.assignment_created = new Date().toISOString();
  newDetails.assignment_updated = new Date().toISOString();
  const savedDetails = await createAssignment(newDetails);
  return savedDetails

}
///

//delete
export async function deleteAssignment(assignmentId) {
  return db.Assignment.destroy({ where: { id: assignmentId }}); 
}



// export async function updateAssignment(assignmentId, assignmentData) {
//   assignmentData.updatedAt = new Date().toISOString();

//   // Update the assignment
//   await db.Assignment.update(assignmentData, {
//     where: { id: assignmentId }
//   });

//   //Fetch and return the updated assignment
//   const updatedAssignment = await db.Assignment.findOne({ where: { id: assignmentId } });
//   return updatedAssignment;
// }

//update

export const updateAssignmentDetails = async (id, newDetails) => {

  newDetails.assignment_updated = new Date().toISOString();

  const updated = await db.assignment.update(newDetails, {where: {id}});

  return updated;

}


//getAll Assignments

export const getAllAssignments = async (user_id) => {
  try {
      const assignments = await db.assignment.findAll({
          where: { user_id: user_id },
      });
      return assignments;
  } catch (error) {
      return null;
  }
}

//get All Assignments by ID
export const getAssignmentById = async (user_id, id) => {
  try {
      const assignments = await db.assignment.findOne({
          where: { user_id: user_id, id: id },
      });
      return assignments;
  } catch (error) {
      throw null;
  }
}
