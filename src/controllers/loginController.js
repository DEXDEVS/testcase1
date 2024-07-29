const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config();

const User = require('../models/People');
const { default: mongoose } = require('mongoose');

const login = async (req, res, next) => {
  const { username } = req.body;
  if (!username) return next(createError(400, 'Wrong credentials'));
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          userid: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || 'Admin',
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
          secure: true,
          sameSite: 'None',
        });
        res.status(200).json({
          status: 'success',
          data: { accessToken: token, user: userObject },
        });
      } else {
        res
          .status(400)
          .json({ status: 'failed', data: 'Login failed! Please try again.' });
      }
    } else {
      res
        .status(400)
        .json({ status: 'failed', data: 'Email or password wrong' });
    }
  } catch (err) {
    next(err);
  }
};

const getRefreshToken = async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(
      req.headers.userid
    );
    const user = await User.findOne({ _id: userId });
    if (user) {
      const userObject = {
        userid: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role || 'Admin',
      };
      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      // set cookie
      res.cookie(process.env.COOKIE_NAME, token, {
        maxAge: process.env.JWT_EXPIRY,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: 'None',
      });
      res.status(200).json({
        accessToken: token,
        user: userObject,
      });
    } else {
      res.status(401).json({
        status: 'failed',
        data: 'Authetication failure!',
      });
    }
  } catch (error) {
    res.status(401).json({
      status: 'failed',
      data: 'Authetication failure!',
    });
  }
};

// do logout
const logout = async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ status: 'success', data: 'successfully logout' });
};

module.exports = { login, logout, getRefreshToken };
