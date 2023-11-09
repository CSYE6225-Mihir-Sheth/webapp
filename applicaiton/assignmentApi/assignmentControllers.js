import { authenticateUser, createAssignment, removeAssignment, updateAssignment, getAllAssignments, getAssignmentById, healthCheck} from "../support/assignmentService.js";
import db from "../database/dataConnection.js";
import logger from "../support/logging.js"
import StatsD from "node-statsd";
import config from "../database/dbConfig.js";

const  statsd = new StatsD({ host: config.dbC.statsdhost, port: config.dbC.statsdPort });

function checkDate(input) {
    let regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([Zz])$/;
    return regex.test(input);
}

//create
export const post = async (request, response) => {
    statsd.increment("endpoint.post.post");
    try {
        const health = await healthCheck();
        if (health !== true) {
            logger.warn('Health check failed, sending 503');
            return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
        }
        
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('Authorization header missing or not Basic, sending 401');
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        const authenticated = await authenticateUser(email, password);
        if (authenticated === null) {
            logger.warn('User authentication failed, sending 401');
            return response.status(401).send('');
        }

        const checkForDuplicateKeysInRawBody = (rawBody) => {
            const keys = (rawBody.match(/"(\w+)":/g) || []).map(key => key.slice(1, -2)); 
            return keys.length !== [...new Set(keys)].length;
        };

        // Define required fields that should be present in request body
        const requiredFields = [
            "name",
            "points",
            "num_of_attempts",
            "deadline",
        ];

        const newDetails = request.body;
        
        if(!Number.isInteger(newDetails.points) || !Number.isInteger(newDetails.num_of_attempts)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if (!(typeof newDetails.name === 'string' || newDetails.name instanceof String)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if(!checkDate(newDetails.deadline)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if(!newDetails.name || !newDetails.points || !newDetails.num_of_attempts || !newDetails.deadline || Object.keys(newDetails).length > 4){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        
        
        // Check for extra parameters or repetitions
        const requestFields = Object.keys(newDetails);
        if (requestFields.length !== requiredFields.length || requestFields.some((field) => !requiredFields.includes(field))) {
            logger.warn('Request has invalid fields, sending 400');
            return response.status(400).send('Bad Request: Invalid fields in request.');
        }

        // Check if all required fields are present in the request body
        if (requiredFields.some((field) => !newDetails.hasOwnProperty(field))) {
            logger.warn('Missing fields in request body, sending 400');
            return response.status(400).send('Bad Request: Missing fields in request.');
        }
        
        newDetails.user_id = authenticated;
        newDetails.assignment_created = new Date().toISOString();
        newDetails.assignment_updated = new Date().toISOString();
        
        const savedDetails = await createAssignment(newDetails);
        if (!savedDetails) {
            logger.error('Failed to save assignment details, sending 500');
            throw new Error('Failed to save assignment details.');
        }
        logger.info(`Assignment created successfully with ID: ${savedDetails.id}`); // Assuming savedDetails has an ID field
        return response.status(201).send(savedDetails);
    } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        return response.status(400).send('Bad Request: An error occurred.');
    }
};




//update

export const put = async (request, response) => {

    statsd.increment("endpoint.put.put");
    try {
        const health = await healthCheck();
        if (health !== true) {
            logger.warn('Health check failed, sending 503');
            return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate').send('');
        }

        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('Authorization header missing or not Basic, sending 401');
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);
        if (authenticated === null) {
            logger.warn('User authentication failed, sending 401');
            return response.status(401).send('');
        }

        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
        if (!assignment) {
            logger.warn('Assignment not found, sending 404');
            return response.status(404).send('Assignment not found');
        }

        if (assignment.user_id !== authenticated) {
            logger.warn('Unauthorized update attempt, sending 403');
            return response.status(403).send('Forbidden: You are not authorized to update this assignment');
        }

        const id = request.params.id;
        let newDetails = request.body;

        
        if(!Number.isInteger(newDetails.points) || !Number.isInteger(newDetails.num_of_attempts)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if (!(typeof newDetails.name === 'string' || newDetails.name instanceof String)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if(!checkDate(newDetails.deadline)){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }
        if(!newDetails.name || !newDetails.points || !newDetails.num_of_attempts || !newDetails.deadline || Object.keys(newDetails).length > 4){
            logger.warn("Bad request: Invalid body parameters");
            return response.status(400).json({error: 'Bad Request'}).send();
        }

        newDetails.assignment_updated = new Date().toISOString();

    

        const updatedDetails = await updateAssignment(newDetails, id);
        if (!updatedDetails) {
            logger.error('Failed to update assignment details, throwing error');
            throw new Error('Failed to update assignment details.');
        }
        logger.info(`Assignment with ID: ${request.params.id} updated successfully`);
        return response.status(204).send('');
    } catch (error) {
        logger.error(`An error occurred while updating assignment: ${error.message}`);
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
    statsd.increment("endpoint.remove.remove");

    try {

        if (Object.keys(request.body).length !== 0) {
            logger.warn('Request body should be empty, sending 400');
            return response.status(400).send('Request body should be empty.');
            }

        const health = await healthCheck();
        if (health !== true) {
            logger.warn('Health check failed, sending 503');
            return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');
        }
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('Authorization header missing or not Basic, sending 401');
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            logger.warn('User authentication failed, sending 401');
            return response.status(401).send('');
        }
        
        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });
//
        // If no assignment found, send 404
        if (!assignment) {
            logger.error('Assignment not found, sending 404');
            return response.status(404).send('Assignment not found');
        }

        // Check if authenticated user is authorized to delete assignment
        if (assignment.user_id !== authenticated) {
            logger.warn('Unauthorized deletion attempt, sending 401');
            return response.status(401).send("You are not authorized to delete this assignment");
        }

        await removeAssignment(assignment.id);
        logger.info(`Assignment with ID: ${request.params.id} removed successfully`);
        // Send 204 after successful deletion
        return response.status(204).send('');
    } catch (error) {
        logger.error(`An error occurred while removing assignment: ${error.message}`);
        return response.status(400).send('');
    }
};
//get All assignments

export const get = async (request, response) => {
    statsd.increment("endpoint.get.get");
    try{

    if (Object.keys(request.body).length !== 0) {
        logger.warn('Request body should be empty, sending 400');
        return response.status(400).send('Request body should be empty.');
        }
    const health = await healthCheck();
    if (health !== true) {
        logger.warn('Health check failed, sending 503');
        return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate' ).send('');          
    }
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('Authorization header missing or not Basic, sending 401');
            return response.status(401).send('');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);
        
        if (authenticated === null) {
            logger.warn('User authentication failed, sending 401');
            return response.status(401).send('');
        }
        
        const assignments = await getAllAssignments(authenticated);
        
        if (assignments.length === 0) {
            logger.info('No assignments found for the user, sending 200 with empty array');
                // Handle the case when no assignments are found for the user
            return response.status(200).send('');
       } else {
            logger.info('Assignments retrieved successfully, sending 200 with data');
                //Send the assignments as a JSON response
            return response.status(200).send(assignments);
            }
    }   catch (error) {
            logger.error(`An error occurred while retrieving assignments: ${error.message}, sending 400`);
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
    statsd.increment("endpoint.get.getAssignmentUsingId");
    try {

        if (Object.keys(request.body).length !== 0) {
            logger.warn('Request body should be empty, sending 400');
            return response.status(400).send('Request body should be empty.');
            }

        const health = await healthCheck();
        if (health !== true) {
            logger.warn('Health check failed, sending 503');
            return response.status(503).header('Cache-Control', 'no-cache, no store, must-revalidate').send('');
        }

        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('Authorization header missing or not Basic, sending 401');
            return response.status(401).send('Unauthorized'); // No auth header or malformed auth header
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const authenticated = await authenticateUser(email, password);

        if (authenticated === null) {
            logger.warn('User authentication failed, sending 401');
            return response.status(401).send('Invalid credentials'); // Invalid username/password
        }

        const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

        if (!assignment) {
            logger.error('Assignment not found, sending 404');
            return response.status(404).send('Assignment not found'); // No assignment found with provided ID
        }
        logger.info(`Assignment id ${request.params.id} retrieved successfully`);
        return response.status(200).send(assignment); // Return the found assignment

    } catch (error) {
        logger.error(`An error occurred: ${error.message}, sending 400`);
        return response.status(400).send('Bad Request'); // Other errors (e.g. malformed request)
    }
};

// PATCH
export const patch = (request, response) => {
    logger.warn('PATCH method not allowed, sending 405');
    return response.status(405).send('Method Not Allowed');
};

// HEAD
export const head = (request, response) => {
    logger.warn('HEAD method not allowed, sending 405');
    return response.status(405).send('Method Not Allowed');
};

// OPTIONS
export const options = (request, response) => {
    logger.warn('OPTIONS method not allowed, sending 405');
    return response.status(405).send('Method Not Allowed');
};



//health
//health checking -assignment
export const healthz = async (request, response) => {
    if (request.method !== 'GET') {
        logger.warn('Health check called with method other than GET, sending 405');
        return response.status(405).send('');
    } else if (request.headers['content-length'] > 0) {
        logger.warn('Health check called with non-empty body, sending 400');
        return response.status(400).send('');
    } else if (request.query && Object.keys(request.query).length > 0) {
        logger.warn('Health check called with query parameters, sending 400');
        return response.status(400).send('');
    } else {
        try {
            const health = await healthCheck();
            if(health === true) {
                logger.info('Health check passed, sending 200');
                return response.status(200).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            } else {
                logger.error('Health check failed, sending 503');
                return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
            }
        } catch (error) {
            logger.error(`Health check resulted in an error: ${error.message}, sending 503`);
            return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
        }
    }
}