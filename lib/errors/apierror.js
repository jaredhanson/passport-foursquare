/**
 * `APIError` error.
 *
 * @constructor
 * @param {String} [message]
 * @api public
 */
function APIError(message, type, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'APIError';
  this.message = message;
  this.type = type;
  this.code = code;
  this.status = 500;
}

/**
 * Inherit from `Error`.
 */
APIError.prototype.__proto__ = Error.prototype;


/**
 * Expose `APIError`.
 */
module.exports = APIError;
