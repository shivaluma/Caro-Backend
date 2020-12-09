module.exports = class ResponseService {
  static error(statusCode, message, err) {
    return {
      isError: true,
      statusCode,
      message,
      err,
    };
  }

  static response(statusCode, message, data) {
    return {
      isError: false,
      statusCode,
      message,
      data,
    };
  }

  static userPayload(username, displayName, email) {
    return {
      email,
      displayName,
    };
  }
};
