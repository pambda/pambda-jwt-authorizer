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
