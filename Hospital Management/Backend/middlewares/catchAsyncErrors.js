
// TO CATCH ALL THE ASYNC ERRORS 
export const catchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
      //IF THE promise gets resolve return the function and its values or if any error occur move to the next one
      Promise.resolve(theFunction(req, res, next)).catch(next);
    };
  };