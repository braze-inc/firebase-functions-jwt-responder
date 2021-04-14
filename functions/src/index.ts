import * as functions from "firebase-functions";
var jwt = require('jsonwebtoken');
const keys = require('./keys');

const corsHandler = require('cors')({ origin: true });

export const getToken = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => { 
    const payload = request.body.data;
    functions.logger.info("Payload log", { payload: payload });
    functions.logger.info("Request body", { body: request.body });
    if (payload === undefined) {
      response.send({ data: { error: "no body data" } });
      return;
    }
    const userId = payload.user_id;
    if (userId === undefined) {
      response.send({ data: { error: "data.user_id is required!" } });
      return;
    }

    const expiresIn = payload.expires_in || '1h';
    const algorithm = payload.algorithm || 'RS256';

    // https://github.com/auth0/node-jsonwebtoken#readme
    const dataPayload = {
      sub: userId,
      aud: 'braze'
    }
    const options = {
      expiresIn: expiresIn,
      algorithm: algorithm
    }
    const token = jwt.sign(dataPayload, keys.privateKey1, options);

    const genData = {
      token: token,
      user: userId,
      options: options,
      dataPayload: dataPayload
    }
    functions.logger.info("Generated jwt token", genData);

    response.set('Access-Control-Allow-Origin', '*');
    response.send({ data: { token: token, meta: genData } });
  });
});
