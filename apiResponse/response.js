exports.success = (message, results, success) => {
  return {
    message,
    results,
    success,
  };
};

exports.notFound = (error, success) => {
  return {
    error,
    success,
  };
};

exports.unAuthorizedError = (error, success) => {
  return {
    error,
    success,
  };
};

exports.internalError = (error, success) => {
  return {
    error,
    success,
  };
};
