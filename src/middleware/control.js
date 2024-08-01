import secret from "../utils/constants.js";
import { HTTP_STATUS } from "../utils/constants.js";
import responseHandler from "../utils/responseHandler.js";
import ROLES from "./roles_permissions.js";
import jwt from "jsonwebtoken";

// Middleware function to verify JWT token and extract user's ID and role
export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return responseHandler({
      res,
      status: HTTP_STATUS.UNAUTHORIZED ,
      message: "Authorization header is missing!",
    });
  }

  const authorization = req.headers.authorization.split(" ")[1];
  console.log(authorization);
  const token = authorization;

  if (!token) {
    return responseHandler({
      res,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "No token provided! User Not authenticated",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return responseHandler({
        res,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Unauthorized!",
      });
    }

    // adding the id and role to the request
    req.UserId = decoded.id;

    next();
    return { id: decoded.id };
  });
};

// Middleware function to check user's role against required role
export const checkRole = (req, res, next) => {
  const role = verifyToken(req, res, next).role;
  if (role === ROLES.ADMIN) {
    next();
  } else {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};


