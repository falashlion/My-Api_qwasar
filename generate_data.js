import fs from 'fs';
import faker from 'faker';

// Function to generate random animal data
const generateAnimalData = () => {
  const name = faker.animal.type();
  const description = faker.lorem.sentence();
  return { name, description };
};

// Function to generate a CSV file with animal data
const generateCSV = (filePath, numRows) => {
  const header = 'name,description\n';
  let csvData = header;

  for (let i = 0; i < numRows; i++) {
    const { name, description } = generateAnimalData();
    csvData += `"${name}","${description}"\n`;
  }

  fs.writeFileSync(filePath, csvData, 'utf-8');
  console.log(`CSV file with ${numRows} rows generated at ${filePath}`);
};

// Specify the file path and the number of rows you want
const filePath = 'animals_data.csv';
const numRows = 1500;

// Generate the CSV file
generateCSV(filePath, numRows);
