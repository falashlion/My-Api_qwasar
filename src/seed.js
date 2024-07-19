import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import db from '../src/models/connection.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';	

// Define __dirname in ES module scope

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

// Define the path to the CSV file
const csvFilePath = path.join(__dirname, 'animals_data.csv');

// Check if the CSV file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(`CSV file not found at path: ${csvFilePath}`);
  process.exit(1);
}

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    db.animals.create({
      name: row.name,
      description: row.description,
      userId: row.userId
    }).catch(err => {
      console.error('Error inserting row:', err);
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });