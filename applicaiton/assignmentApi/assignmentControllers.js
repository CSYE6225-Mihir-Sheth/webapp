import { authenticateUser, createAssignment, removeAssignment, updateAssignment, getAllAssignments, getAssignmentById, healthCheck} from "../support/assignmentService.js";
import db from "../database/dataConnection.js";

//create
export const post = async (request, response) => {
    try {
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

        // Define required fields that should be present in request body
        const requiredFields = [
            "name",
            "points",
            "num_of_attempts",
            "deadline",
        ];

        const newDetails = request.body;
        
        // Check if all required fields are present in the request body
        if (
            requiredFields.some((field) => !newDetails.hasOwnProperty(field))
        ) {
            return response.status(400).send('Bad Request: Missing fields in request.');
        }
        
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        
        const savedDetails = await createAssignment(newDetails);
        if (!savedDetails) {
            throw new Error('Failed to save assignment details.');
        }

        return response.status(201).send('Assignment created successfully.');
    } catch (error) {
        console.error('Error:', error.message);
        return response.status(400).send('Bad Request: An error occurred.');
    }
};



//update

export const put = async (request, response) => {
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
        if (!assignment) {
            return response.status(404).send('Assignment not found');
        }

        if (assignment.user_id !== authenticated) {
            return response.status(403).send('Forbidden: You are not authorized to update this assignment');
        }

        const id = request.params.id;
        let newDetails = request.body;
        newDetails.assignment_updated = new Date().toISOString();

        // (Optionally) You might want to validate the newDetails here and return a 400 if they are not valid.

        const updatedDetails = await updateAssignment(newDetails, id);
        if (!updatedDetails) {
            throw new Error('Failed to update assignment details.');
        }

        return response.status(204).send('');
    } catch (error) {
        console.error('Error:', error.message);
        return response.status(400).send('Bad Request: An error occurred.');
    }
};


// delete
// export const remove = async (request, response) => {
//     try{
//     const health = await healthCheck();
//     if (health !== true) {
//         return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
//                 }
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
//         //if condition to be added just see if 
//         if (assignment.user_id != authenticated ){
//             return response.status(401).send("You are not authorized to delete this assignment");
//         }
//         console.log("...");
//         const id = request.params.id;
//         await removeAssignment(id);
//         return response.status(200).send('');
//         } catch (error) {
//             console.error(error);
//             return response.status(400).send('');
//     }
// };

export const remove = async (request, response) => {
    try {
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

        // If no assignment found, send 404
        if (!assignment) {
            return response.status(404).send('Assignment not found');
        }

        // Check if authenticated user is authorized to delete assignment
        if (assignment.user_id !== authenticated) {
            return response.status(401).send("You are not authorized to delete this assignment");
        }

        await removeAssignment(assignment.id);

        // Send 204 after successful deletion
        return response.status(204).send('');
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
            //     // Handle the case when no assignments are found for the user
            // return response.status(404).send('');
       // } else {
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
            return response.status(401).send('Unauthorized'); // No auth header or malformed auth header
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            return response.status(401).send('Invalid credentials'); // Invalid username/password
        }

        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

        if (!assignment) {
            return response.status(404).send('Assignment not found'); // No assignment found with provided ID
        }

        return response.status(200).send(assignment); // Return the found assignment

    } catch (error) {
        console.error('Error:', error.message);
        return response.status(400).send('Bad Request'); // Other errors (e.g. malformed request)
    }
};




//health
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