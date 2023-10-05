import express from "express";
import cors from "cors";
import route from "./routes/index.js";
import initializeDatabase from './support/userSupport.js';

const app = express();
app.use(cors());
app.use(express.json());
route(app);

initializeDatabase();
export default app;