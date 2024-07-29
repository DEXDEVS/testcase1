const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnection = async () => {
  const URI = process.env.DB_CONNECTION_STRING;
  const dbName = process.env.DB_NAME;
  const user = process.env.DB_USERNAME;
  const pass = process.env.DB_PASS;

  try {
    await mongoose.connect(URI, { dbName, user, pass });
    console.log('Database connection successfull');
  } catch (error) {
    console.log('Database connection failed');
  }
};
