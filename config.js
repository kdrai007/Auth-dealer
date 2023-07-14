import dotenv from 'dotenv';
dotenv.config();

//exporting all required dotenv data
export const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
