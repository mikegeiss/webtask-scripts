'use strict'

const app = new (require('express'))();
const wt = require('webtask-tools');

app.get('/', function (req, res) {
  if(req.headers.authtoken === req.webtaskContext.secrets.authtoken){
    req.webtaskContext.storage.get(function (error, data) {
      if (error) {
        res.end(error)
      }
      else {
        res.end(JSON.stringify(data))
      }
    });
  }
  else {
    res.end("Not authorized")
  }
});

module.exports = wt.fromExpress(app);