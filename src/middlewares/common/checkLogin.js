const jwt = require('jsonwebtoken');

// auth guard to protect routes that need authentication
const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  let token = null;
  if (cookies) token = cookies[process.env.COOKIE_NAME];
  if (!token) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // pass user info to request headers
      req.headers.userid = decoded['userid'];
      req.headers.user = decoded;
      next();
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        data: 'Authetication failure!',
      });
    }
  } else {
    res.status(401).json({
      status: 'failed',
      data: 'Authetication failure!',
    });
  }
};

module.exports = { checkLogin };
