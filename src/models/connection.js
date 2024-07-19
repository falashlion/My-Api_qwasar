import { Sequelize, DataTypes } from "sequelize";
import connection from "../utils/constants.js";
import dotenv from 'dotenv';
import userModel from "./user.model.js";
import animalModel from "./animal.model.js";

dotenv.config();

const db = {};

console.log(connection.dbPassword);

const sequelize = new Sequelize('my_api', 'felix', 'felix007', {
  host: "localhost",
  dialect: "mysql", // Corrected typo here
  port: 3306
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = userModel(sequelize, DataTypes);
db.animals = animalModel(sequelize, DataTypes);

db.users.hasMany(db.animals);
db.animals.belongsTo(db.users);

sequelize
  .authenticate()
  .then(() => {
    console.log("== Data Base connection successful ===");
  })
  .catch((err) => {
    console.log("=== Error in Data Base connection: " + err + " ===");
  });

sequelize
  .sync()
  .then(() => {
    console.log("== Data Base synchronised ===");
  })
  .catch((err) => {
    console.log("=== Error in Data Base synchronisation: " + err + " ===");
  });

export default db;
