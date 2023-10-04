// config.js

import dotenv from 'dotenv';

dotenv.config();
export default {
  dbC: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    dialect: process.env.dialect,
    port: process.env.port
  },
};


