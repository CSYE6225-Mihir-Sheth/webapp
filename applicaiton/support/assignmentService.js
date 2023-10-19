// assignmentService.js

import db from '../database/dataConnection.js';
import bcrypt from 'bcrypt';

/**
 * Create a new assignment.
 */


export async function createAssignment(data) {
  try {
    const assignment = await db.assignment.create(data);
    return assignment;
  } catch (error) {
    console.error('Error creating assignment', error);
    throw error;
  }
}
// update 
export const updateAssignment = async (updatedDetails, id) => {
  const { name, points, num_of_attempts, deadline, assignment_updated } = updatedDetails;
  return db.assignment.update(
      { name, points, num_of_attempts, deadline, assignment_updated },
      { where: { id: id } }
  );
}

//get all

export const getAllAssignments = async () => {
  try {
      const assignments = await db.assignment.findAll(); 
      return assignments;
  } catch (error) {
      return null;
  }
}


//get all assignments by id
// export const getAssignmentById = async () => {
//   try {
//       const assignments = await db.assignment.findOne();
//       return assignments;
//   } catch (error) {
//       throw null;
//   }
// }

export const getAssignmentById = async (user_id, id) => {

  try {

    const assignment = await db.assignment.findOne({
      where: {
        id: id
      }
    });

    // Check if the assignment belongs to other user
    if(assignment.user_id !== user_id) {
      // Allow access if created by other user
      return assignment; 
    }

    return assignment;

  } catch (error) {

    throw null;

  }

}

//update the assignments
// export const updateAssignment = async (updatedDetails, id) => {
//   const { name, points, num_of_attempts, deadline, assignment_updated } = updatedDetails;
//   return db.assignment.update(
//       { name, points, num_of_attempts, deadline, assignment_updated },
//       { where: { id: id } }
//   );
// }



/**
 * Delete an assignment.
 */

export const removeAssignment = async (id) => {
  return db.assignment.destroy({
      where: { id },
  });
}



/**
 * Authenticate a user.
 */
export async function authenticateUser(email, password) {
  try {
    const user = await db.user.findOne({ where: { emailid: email }});
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user.id;

  } catch (error) {
    console.error('Authentication error', error);
    throw error;
  }
}


//health check

export const healthCheck = async () => {
  try {
      await db.sequelize.authenticate();
      return true;
  } catch (error) {
      return false;
  }
  
}
