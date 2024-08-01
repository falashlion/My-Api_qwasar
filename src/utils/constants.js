import dotenv from 'dotenv';
dotenv.config();

const secret = "secret";
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
const PATH = "/resources/uploads/"

const connection = {
  databaseName :"my_api",
  dbDailect :"mysql",
  dbUser :"felix",
  dbPassword : "felix007",
  host : "localhost" ,
  port : 3306
 }

export default  { secret,   PATH, connection };
