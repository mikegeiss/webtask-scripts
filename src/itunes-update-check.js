'use strict';

const requestPromise = require('request-promise');

module.exports = function (context, callback) {

  ladeDatenAusStorage().then((items) => {
    let appInfoPromises = ladeAppInfos(items);
    Promise.all(appInfoPromises).then(values => {
      let actualAppInfos = reduziereAktuelleAppInfos(values);
      schreibeAktuelleUndErwarteteAppInfos(items, actualAppInfos);
    });
  });

  function ladeDatenAusStorage() {
    return new Promise((resolve, reject) => {
      context.storage.get(function (error, data) {
        if (error) {
          reject(error)
        }
        else {
          resolve(data)
        }
      });
    });
  }

  function reduziereAktuelleAppInfos(actualAppInfos) {
    return actualAppInfos.map(appInfo => {
      const current = appInfo.results[0];
      return {name: current.trackName, id: current.trackId, price: current.price};
    });
  }

  function schreibeAktuelleUndErwarteteAppInfos(currentAppInfo, actualAppInfos) {
    callback(null, {
      expected: currentAppInfo,
      current: actualAppInfos,
      lastCalled: new Date().toUTCString()
    });
  }

  function ladeAppInfos(items) {
    return items.map((item) => {
      const url = "https://itunes.apple.com/de/lookup?id=" + item.id;
      return requestPromise({url: url, json: true});
    });
  }
};