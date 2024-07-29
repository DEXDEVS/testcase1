const { unlink } = require('fs');
const path = require('path');
const errorHandler = (err, req, res, next) => {
  /*
  if(req.url === '/users/create' && req.files?.length > 0) {
    const { filename } = req.files[0];
    unlink(path.join(__dirname, `/../uploads/avatars/${filename}`), (err) => {
      if (err) console.log(err);
    });
  }
    */
  const errorResponse = {};
  errorResponse.status = err.status || 500;
  errorResponse.message = err.message || 'Internal Server Error';
  return res.status(errorResponse.status).json(errorResponse);
};
module.exports = errorHandler;
