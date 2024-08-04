import dotenv from 'dotenv';
dotenv.config();

export const secret = process.env.SECRET;
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  PARTIAL_CONTENT: 206
};
export const PATH = "/resources/uploads/"

export const connection = {
  databaseName :process.env.DATABASE,
  dbDailect :process.env.DB_DIALECT,
  dbUser : process.env.DB_USER,
  dbPassword : process.env.DB_PASSWORD,
  host : process.env.HOST,
  port : process.env.DB_PORT,
 }


