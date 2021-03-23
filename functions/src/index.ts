import * as functions from "firebase-functions";
var jwt = require('jsonwebtoken');

var privateKey1 = require("./super_secure_directory/key1_private.txt");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getToken = functions.https.onRequest((request, response) => {
  const payload = request.body.data;
  functions.logger.info("Hello logs!", { payload: payload});
  if (payload === undefined) {
    response.send({ data: { error: "no body data" } });
    return;
  }

  const userId = payload.user_id;

  // https://github.com/auth0/node-jsonwebtoken#readme
  const token = jwt.sign({
    data: 'foobar'
  }, privateKey1, { expiresIn: '1h' });

  functions.logger.info("Generated jwt token", 
    { 
      token: token,
      user: userId
    });

  response.send({ data: { token: token } });
});
