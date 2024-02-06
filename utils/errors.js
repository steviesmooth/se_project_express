// error handler for app.js middlewares
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "An error has occurred on the server";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errMsg,
    stack: process.env.NODE_env,
  });
};

const Bad_Request_Error = 400;
const Not_Found_Error = 404;
const Server_Error = 500;

module.exports = {
  errorHandler,
  Bad_Request_Error,
  Not_Found_Error,
  Server_Error,
};
