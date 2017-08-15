'use strict';

const app = new (require('express'))();
const wt = require('webtask-tools');
const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.get('/', function (req, res) {
  if (req.headers.authtoken !== req.webtaskContext.secrets.authtoken) {
    res.end("Not authorized");
  }
  loadStorage(req.webtaskContext.storage).then( (result) => {
    res.end(JSON.stringify(result));
  })

});

app.post('/', function (req, res) {
  if (req.headers.authtoken !== req.webtaskContext.secrets.authtoken) {
    res.end("Not authorized")
  }
  updateStorage(req.webtaskContext.storage, req.body).then( (result) => {
    res.end(result);
  });
});

function loadStorage(storage) {
  return new Promise((resolve, reject) => {
    storage.get(function (error, data) {
      if(error){
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function updateStorage(storage, values) {
  return new Promise((resolve, reject) => {

    storage.get(function (error, data) {

      if (error) {
        reject(error);
      }

      let response = [];
      values.forEach(appInfo => {
        const storageAppInfo = data.find(x => {
          return x.id == appInfo.id;
        });
        if (appInfo.price !== null && appInfo.price !== undefined && storageAppInfo.price != appInfo.price) {
          response.push({"old": appInfo, "newPrice": appInfo.price});
          const index = data.indexOf(storageAppInfo);
          storageAppInfo.price = appInfo.price;
          data[index] = storageAppInfo;
        }
      });


      storage.set(data, function (error) {
        if(error) {
          reject(error);
        } else {
          resolve('Folgende Werte wurden geändernt: ' + JSON.stringify(response));
        }
      });
    });
  });
}

module.exports = wt.fromExpress(app);