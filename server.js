const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  // Dynamically generate a signing key based on the kid
  // and the public signing keys in the JWKs endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent hackers from requesting more than 5 per min
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // validate the audience and issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm in the Auth0 dashboard
  algorithms: ["RS256"]
});

const app = express();
const port = 3001;

app.get("/public", function(req, res) {
  res.json({
    message: "Hello from a Public API!"
  });
});

app.get("/private", checkJwt, function(req, res) {
  res.json({
    message: "Hello from a Private  API!"
  });
});

app.listen(port, () =>
  console.log(
    `API server  listening on ${process.env.REACT_APP_AUTH0_AUDIENCE}`
  )
);
