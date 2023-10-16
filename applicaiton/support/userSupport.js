import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import config from '../database/dbConfig.js';
import userModel from '../models/userModel.js';
import assignmentModel from '../models/assignmentModel.js';
import db from '../database/dataConnection.js'

const currentDate = new Date();
const accountCreatedString = currentDate.toISOString();
const accountUpdatedString = currentDate.toISOString();

const initializeDatabase=async () => {
    try {
        // Sync the database to create tables if they don't exist
        await db.sequelize.sync({ alter: true }); // Use alter: true to update existing schema

        // Load and insert data from CSV files
        const csvData = fs.readFileSync(path.join('/Users/mihirsheth/Desktop/users.csv'), 'utf-8');
        const rows = csvData.split('\n').map((row) => row.split(','));

        for (let i = 1; i < rows.length; i++) {
            const [first_name, last_name, emailid, password] = rows[i];
            await db.user.create({
                first_name,
                last_name,
                emailid,
                password,
                account_created: accountCreatedString,
                account_updated: accountUpdatedString
            });
        }

        console.log('Database bootstrapped successfully.');
    } catch (error) {
        console.error('Error bootstrapping the database:');
    }
}

export default initializeDatabase;
