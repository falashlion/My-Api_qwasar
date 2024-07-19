import express from 'express';
import AnimalService from '../services/animals.service.js';
import  responseHandler  from '../utils/responseHandler.js';
import { verifyToken, checkRole } from '../middleware/control.js';

const app = express();

//Getting all Animals
app.get("/all", async function (req, res) {
  const page = req.query.page || 1
  const size = req.query.size || 10
  const animals = await AnimalService.Animals(page, size);
  responseHandler({...animals, res})
});

//getting animal with name
app.get("/animal", async function (req, res) {
  let name = req.query.name;
  const animal = await AnimalService.getAnimalWithName(name);
  responseHandler({...animal, res})
});

//getting a Animal with id
app.get("/:id", async function (req, res) {
  let id = req.params.id;
  const animal = await AnimalService.GetAnimal(id);
  responseHandler({...animal, res})
});




//Posting or creating a Animal
app.post("/new_Animal", verifyToken, async function (req, res) {
  
  let name = req.body.name;
  let description = req.body.description;
  let userId = req.body.userId;
  const animal = await AnimalService.createAnimal(name, description, userId);
  responseHandler({...animal, res})
});

//updating an Animal
app.put("/update/:id", verifyToken, async function (req, res) {
  let id = req.params.id;
  let options = req.body;
  const animal = await AnimalService.UpdateAnimal(id, options);
  responseHandler({...animal, res})
});

//deleting a Animal
app.delete("/delete/:id", verifyToken, async function (req, res) {
  let id = req.params.id;
  const animal = await AnimalService.DeleteAnimal(id);
  responseHandler({...animal, res})
});

export default app;
