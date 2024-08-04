import UserRepository  from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  { secret } from "../utils/constants.js";
import { HTTP_STATUS } from "../utils/constants.js";


class UserService {
  //Create new user
  static async createUser(username, password, email) {
    const user = await UserRepository.findUserByEmail(email);
    if (user) {
      return {
        message: "User Already Exists",
        status: HTTP_STATUS.BAD_REQUEST,
        error: "User already exists"
      };
    } else {
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);
      const newuser = await UserRepository.CreateUser(
        username,
        hashedPassword,
        email
      );
      return { data: newuser, status: HTTP_STATUS.OK };
    }
  }

  //Update user
  static async UpdateUser(id, options) {
    const user = await UserRepository.updateUser(id, options);
    if (!user) {
      return {
        error: "Could Not Update User",
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Unable to Update User",
      };
    }
    return {
      status: HTTP_STATUS.OK,
      message: "User Updated successfully!!",
      data: user,
    };
  }

  //Get User
  static async getUser(id) {
    const user = await UserRepository.findUserByIdNoPwd(id);
    if (!user) {
      return {
        error: "Could Not get animal",
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Animal not found",
      };
    }
    return {
      status: HTTP_STATUS.OK,
      message: "Animal!!",
      data: user,
    };
  }

  //Getting all users
  static async AllUsers(id) {
    const users = await UserRepository.allUsers(id);
    if (!users) {
      return {
        error: "Could Not get users",
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Users not found",
      };
    }
    return {
      status: HTTP_STATUS.OK,
      message: "users!!",
      data: users
    };
  }

  //Delete User
  static async DeleteUser(id) {
    const user = await UserRepository.deleteUser(id);
    if (!user) {
      return {
        error: "Could Not delete user",
        status: HTTP_STATUS.BAD_REQUEST,
        message: "User possibly not found",
      };
    }
    return {
      status: HTTP_STATUS.OK,
      message: "User Deleted !!",
      data: user,
    };
  }

  //Sign in
  static async SignIn(email, password) {
    const user = await UserRepository.findUserByEmail(email);

    //check if user email exist
    if (!user) {
      return {
        message: "Wrong Email or password",
        status: HTTP_STATUS.BAD_REQUEST,
      };
    }
    //checking if passwords match
    let matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return {
        message: "Wrong Email or password",
        status: HTTP_STATUS.BAD_REQUEST,
      };
    }

    //Generate a token for the user loging in using user id
    var token = jwt.sign({ id: user.id}, secret);

    user.dataValues.token = token;

    return { data: user, status: HTTP_STATUS.OK };
  }
}
export default UserService;
