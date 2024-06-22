const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // this cn be replaced by try catch block as well.
  };
};

export {asyncHandler}