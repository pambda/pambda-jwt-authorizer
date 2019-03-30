const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { get } = require('caseless-get');
const { error } = require('lambda-console');

exports.jwtAuthorizer = options => {
  const {
    jwksUri,
    unauthorized = defaultUnauthorized,
    cookieName,
  } = options;

  const client = jwksClient({
    jwksUri,
  });

  function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }

      callback(null, key.publicKey || key.rsaPublicKey);
    });
  }

  return next => (event, context, callback) => {
    /*
     * Get an access token.
     */
    let accessToken;

    const authorization = get(event.headers, 'authorization');
    if (authorization) {
      const ss = authorization.split(' ');
      if (ss[0] === 'Bearer') {
        accessToken = ss[1];
      }
    }

    if (!accessToken && cookieName) {
      const { cookies } = event;

      if (!cookies) {
        return callback(new Error('Must use pambda-cookie before authorizer'));
      }

      accessToken = cookies[cookieName];
    }

    if (!accessToken) {
      return unauthorized(event, context, callback);
    }

    /*
     * Verify the access token.
     */
    jwt.verify(accessToken, getKey, {}, (err, decoded) => {
      if (err) {
        error(err);
        return unauthorized(event, context, callback);
      }

      event.accessToken = accessToken;
      event.decodedAccessToken = decoded;

      /*
       * Call a next lambda.
       */
      next(event, context, callback);
    });
  };
};

function defaultUnauthorized(event, context, callback) {
  callback(null, {
    statusCode: 401,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: 'Unauthorized',
  });
}
