// /**
//  * AppError - Custom error class for handling application-specific errors with additional context.
//  * This class can be extended in the future to include additional properties or methods as needed.
//  */
// class AppError extends Error {
//     constructor(message, statusCode = 500, errors = null) {
//         super(message);
//         this.statusCode = statusCode;
//         this.errors = errors;
//         this.isOperational = true;
//         Error.captureStackTrace(this, this.constructor)
//     }
// }

// export default AppError;

// /**
//  * AppError - Custom error factory function for handling application-specific errors with additional context.
//  * This function creates error objects that can be extended in the future to include additional properties or methods as needed.
//  */
// const AppError = (message, statusCode = 500, errors = null) => {
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     error.errors = errors;
//     error.isOperational = true;
//     Error.captureStackTrace(error, AppError);
//     return error;
// };

// // export default AppError;

// // Same usage as before
// throw AppError('User not found', 404, ['User does not exist']);
