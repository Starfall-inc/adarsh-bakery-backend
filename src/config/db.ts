import dotenv from 'dotenv';
import mongoose, { Connection, MongooseError } from 'mongoose';
import { serverConfig } from './server.config';
// load the dot env configuration here (scoped to this file only i guess)

dotenv.config();

// getting the mongoDB base string here from the env variable

const MONGO_URI = serverConfig.mongoURI;

/**
 * Establishes a connection to the MongoDB database.
 *
 * This function attempts to connect to the MongoDB database using the URI
 * provided in the `MONGODB_URI` environment variable.
 *
 * @returns {Promise<Connection>} A Promise that resolves with the Mongoose Connection object
 *                                 if the connection is successful, or rejects with an error.
 */
const connectDB = async (): Promise<Connection> => {
  try {
    // Check if MONGODB_URI is defined
    if (!MONGO_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    // Attempt to connect to the database
    const conn = await mongoose.connect(MONGO_URI);

    // Log a success message if connection is established
    // console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Return the Mongoose connection object
    return conn.connection;
  } catch (MongooseError) {
    // Log an error message if connection fails
    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;
