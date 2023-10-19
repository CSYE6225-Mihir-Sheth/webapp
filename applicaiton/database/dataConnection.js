// dbConnection.js
import assignmentModel from '../models/assignmentModel.js';
import userModel from '../models/userModel.js'
import { Sequelize } from 'sequelize';
import config from '../database/dbConfig.js';

const sequelize = new Sequelize(
  `${config.dbC.dialect}://${config.dbC.user}:${config.dbC.password}@${config.dbC.host}/${config.dbC.database}`
);

let db = {}
db.sequelize = sequelize;
//zz
db.assignment = assignmentModel(sequelize);
db.user = userModel(sequelize);

export default db;
////

