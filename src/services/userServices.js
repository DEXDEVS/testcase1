const User = require('../models/People');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { unlink } = require('fs');
const path = require('path');
require('dotenv').config();
const hostName = process.env.HOST_NAME;
const addUserService = async (req) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: hostName+'/avatars/'+req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }
  try {
    await newUser.save();
    return { status: 'success', data: 'User added successfully' };
  } catch (err) {
    // remove uploaded files
    if (req.files?.length > 0) {
      const { filename } = req.files[0];
      unlink(path.join(__dirname, `/../uploads/avatars/${filename}`), (err) => {
        if (err) console.log(err);
      });
    }
    throw createError.InternalServerError();
  }
};
module.exports = { addUserService };
