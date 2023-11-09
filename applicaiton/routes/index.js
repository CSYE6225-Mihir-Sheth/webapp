import Router from './route.js';  //initialized all the routes
import express from 'express';
import * as assignmentController from '../assignmentApi/assignmentControllers.js'; 


//called the app function
// const route = (app) => {
//     app.use('/v1', Router);
// }
//


const setupRoutes = (app) => {
    app.use(express.json());

    app.all('/healthz', assignmentController.healthz);

    app.use('/v1', Router);

    app.use((req, res) => {
        res.status(404).send('Not Found');
    });
};

export default setupRoutes;
