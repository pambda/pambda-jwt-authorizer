const { jwtAuthorizer } = require('./jwtAuthorizer');

exports.cognitoAuthorizer = (options = {}) => {
  const {
    region = process.env.AWS_REGION,
    userPoolId = process.env.USER_POOL_ID,
  } = options;

  if (!userPoolId) {
    throw new Error('options.userPoolId must be specified');
  }

  options.jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  return jwtAuthorizer(options);
};
