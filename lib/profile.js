/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.response.user.id;
  profile.name = { familyName: json.response.user.lastName,
                   givenName: json.response.user.firstName };
  profile.gender = json.response.user.gender;
  profile.emails = [{ value: json.response.user.contact.email }];
  
  return profile;
};
