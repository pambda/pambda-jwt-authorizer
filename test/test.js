const test = require('tape');
const { jwtAuthorizer } = require('..');

test('test', t => {
  t.plan(2);

  const pambda = jwtAuthorizer({
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
      body: 'authorized',
    });
  });

  lambda({
    path: '/',
    headers: {
    },
  }, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 401);
  });
});

test('test options.unauthorized', t => {
  t.plan(3);

  const pambda = jwtAuthorizer({
    unauthorized: async (event, context) => {
      return {
        statusCode: 401,
        body: 'test',
      };
    },
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
      body: 'authorized',
    });
  });

  lambda({
    path: '/',
    headers: {
    },
  }, {}, (err, result) => {
    t.error(err);
    t.equal(result.statusCode, 401);
    t.equal(result.body, 'test');
  });
});
