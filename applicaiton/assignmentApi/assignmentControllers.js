import { authenticateUser, createAssignment, removeAssignment, updateAssignment, getAllAssignments, getAssignmentById, healthCheck} from "../support/assignmentService.js";
import db from "../database/dataConnection.js";

export const post = async (request, response) => {
    try{
    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
    
            }
        
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('');
        }

        let newDetails = request.body;
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        //const bodyKeys = Object.keys(request.body);
        const savedDetails = await createAssignment(newDetails);
        return response.status(200).send('');
    } catch (error) {
        return response.status(400).send('');
    }
};
        
        
        // if (
        //     bodyKeys.some(
        //       (bodyVal) =>
        //         ![
        //           "name",
      
        //           "points",
      
        //           "num_of_attempts",
      
        //           "deadline",
      
        //           "assignment_created",
      
        //           "assignment_updated",
      
        //         ].includes(bodyVal)
        //     )
      
        //   ) 
      
//             console.log("hi");
      
//             response.status(400).send("");
//         return response.status(200).send(savedDetails);

//         } catch (error) {
//             console.error(error);
//             return response.status(400).send('');
//         }
// };
//update

export const put = async (request, response) => {
    try{
    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
        
        }
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('');
        }

        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
        if (assignment.user_id != authenticated) {
            return response.status(401).send('');
        }

        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();
        // if (
        //     bodyKeys.some(
        //       (bodyVal) =>
        //         ![
        //           "name",
      
        //           "points",
      
        //           "num_of_attempts",
      
        //           "deadline",
      
        //           "assignment_created",
      
        //           "assignment_updated",
      
        //         ].includes(bodyVal)
        //     )
        // ){
        const updatedDetails = await updateAssignment(newDetails, id);
        return response.status(200).send('');}
        catch (error) {
            return response.status(400).send('');
        }
    };

// delete
export const remove = async (request, response) => {
    try{
    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
                }
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('');
        }
        
        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
        //if condition to be added just see if 
        if (assignment.user_id != authenticated ){
            return response.status(401).send("You are not authorized to delete this assignment");
        }
        console.log("...");
        const id = request.params.id;
        await removeAssignment(id);
        return response.status(200).send('');
        } catch (error) {
            console.error(error);
            return response.status(400).send('');
    }
};


//get All assignments

export const get = async (request, response) => {
    try{
    const health = await healthCheck();
    if (health !== true) {
        return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');          
    }
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('');
        }

        const assignments = await getAllAssignments(authenticated);

        if (assignments.length === 0) {
                // Handle the case when no assignments are found for the user
            return response.status(404).send('');
        } else {
                // Send the assignments as a JSON response
            return response.status(200).send(assignments);
            }
    }   catch (error) {
            return response.status(400).send('');
    }
};
//get Assignments by id
// export const getAssignmentUsingId = async (request, response) => {
//     try{
//     const health = await healthCheck();
//     if (health !== true) {
//         return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');          
//         }
    
//         const authHeader = request.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Basic ')) {
//             return response.status(401).send('');
//         }

//         const base64Credentials = authHeader.split(' ')[1];
//         const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//         const [email, password] = credentials.split(':');

//         const authenticated = await authenticateUser(email, password);

//         if (authenticated === null) {
//             return response.status(401).send('');
//         }

//         const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
//         if (assignment.user_id != authenticated) {
//             return response.status(401).send('');
//         }
//         const id = request.params.id;
//         const assignments = await getAssignmentById(authenticated, id);

//         if (assignments.length === 0) {
//             // Handle the case when no assignments are found for the user
//             return response.status(404).send('');
//         } else {
//             // Send the assignments as a JSON response
//             return response.status(200).send(assignments);
//         }
//     } catch (error) {
//         return response.status(400).send('');
//     }

// }


//updated get all by id

export const getAssignmentUsingId = async (request, response) => {
    try {
        const health = await healthCheck();
        if (health !== true) {
            return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate').send('');
        }

        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('');
        }

        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

        // Allow user_id 1 and user_id 2 to access each other's assignments
        if (assignment.user_id !== authenticated && 
            !(authenticated === 1 && assignment.user_id === 2) &&
            !(authenticated === 2 && assignment.user_id === 1)) {
            return response.status(401).send('');
        }

        const id = request.params.id;
        const assignments = await getAssignmentById(authenticated, id);

        if (assignments.length === 0) {
            return response.status(404).send('');
        } else {
            return response.status(200).send(assignments);
        }
    } catch (error) {
        return response.status(400).send('');
    }
}


//health checking -assignment
export const healthz = async (request, response) => {
    if (request.method !== 'GET') {
        return response.status(405).send('');
    } else if (request.headers['content-length'] > 0) {
        return response.status(400).send('');
    } else if (request.query && Object.keys(request.query).length > 0) {
        return response.status(400).send('');
    } else {
        try {
            const health = await healthCheck();
            if(health === true) {
                return response.status(200).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            } else {
                return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            }
        } catch (error) {
            return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
        }
    }
}