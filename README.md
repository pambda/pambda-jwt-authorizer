# pambda-jwt-authorizer

[Pambda](https://github.com/pambda/pambda) to authorize with JWT.

## Installation

```
npm i pambda-jwt-authorizer
```

## Usage

``` javascript
const { compose, createLambda } = require('pambda');
const { jwtAurhotizer } = require('pambda-jwt-authorizer');

const LOCAL = process.env.AWS_SAM_LOCAL === 'true';

exports.handler = createLambda(
  compose(
    !LOCAL && cognitoAuthorizer({
      /*
       * Redirect to the signin site.
       */
      unauthorized(event, context, callback) {
        // ...
      },
    }),

    // Provide pambdas for authorized users.
  )
);
```

## API

### jwtAuthorizer(options)

- `options.jwksUri`
- `options.unauthorized`

### cognitoAuthorizer(options)

- `options.region`
- `options.userPoolId`
- `options.unauthorized`

## License

MIT
