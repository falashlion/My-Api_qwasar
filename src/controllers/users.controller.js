import express from 'express';
import UserService from '../services/users.service.js';
// import  verifyToken from '../middleware/control.js';
// import checkRole  from '../middleware/control.js';
import { verifyToken, checkRole } from '../middleware/control.js';
import responseHandler from '../utils/responseHandler.js';

const app = express();

// Getting all users
app.get('/all', async function (req, res, next) {
  let users = await UserService.AllUsers();
  res.send(users);
});

// User SignIn
app.post('/signin', async function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  const response = await UserService.SignIn(email, password);
  responseHandler({ ...response, res });
});

// Getting a user with id
app.get('/:id', verifyToken, async function (req, res) {
  if(req.params.id !== undefined){
    const userId = await UserService.getUser(req.params.id);
    if(!userId){
  let id = req.params.id;
  let response = await UserService.getUser(id);
  responseHandler({ ...response, res });
}responseHandler({
  res,
  status: 400,
  message: `No user found with Id: ${req.params.id}`,
});
}
responseHandler({ res,status: 404,message: "No user found Nor updated "});
});

// Posting or creating a user
app.post('/register', async function (req, res) {
  const { username, password, email } = req.body;
  const response = await UserService.createUser(username, password, email);
  responseHandler({ ...response, res });
});

// Updating a user
app.put('/update/:id', verifyToken, async function (req, res) {
  if(req.params.id !== undefined){
    const userId = await UserService.getUser(req.params.id);
    if(!userId){
  const id = req.params.id;
  let options = req.body;
  const user = await UserService.UpdateUser(id, options);
  res.send(user);
  }responseHandler({
    res,
    status: 400,
    message: `No user found with Id: ${req.params.id}`,
  });
}
responseHandler({ res,status: 404,message: "No user found Nor updated "});
});

// Deleting a user
app.delete('/delete/:id', verifyToken, async function (req, res) {
  if(req.params.id !== undefined){
    const userId = await UserService.getUser(req.params.id);
    if(!userId){
  let id = req.params.id;
  const user = await UserService.DeleteUser(id);
  if (user) res.status(200).send("deleted User successfully");
  else res.status(404).send("No user found nor deleted");
  res.send(user);
  }responseHandler({
    res,
    status: 400,
    message: `No user found with Id: ${req.params.id}`,
  });
}
responseHandler({
  res,
  status: 404,
  message: "No user found Nor deleted "
});
});

export default app;
