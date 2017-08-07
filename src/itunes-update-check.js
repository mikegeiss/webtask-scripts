// const request = require('request@2.81.0');
const requestPromise = require('request-promise');
module.exports = function(ctx, cb) {
    const items = [
      {"name": "FileBot", "id": 905384638, "price": 21.99},
      {"name": "Tagr", "id": 903733783, "price": 9.99},
      {"name": "Agricola", "id": 561521557, "price": 7.99},
      {"name": "D&D Lords of Waterdeep", "id": 648019675, "price": 7.99},
      {"name": "Affinity Photo", "id": 1117941080, "price": 21.99},
      {"name": "Pixelmator", "id": 407963104, "price": 32.99}
    ];
    
    var appInfoPromises = ladeAppInfos(items);
    Promise.all(appInfoPromises).then(values => {
       actualAppInfos = reduziereAktuelleAppInfos(values);
       schreibeAktuelleUndErwarteteAppInfos(items, actualAppInfos);
    });
 
    function reduziereAktuelleAppInfos(actualAppInfos){
       return actualAppInfos.map(appInfo => {
          var current = appInfo.results[0];
          return {name: current.trackName, id:current.trackId, price:current.price};
       });
    }
    
    function schreibeAktuelleUndErwarteteAppInfos(currentAppInfo, actualAppInfos){
        cb(null, {
            expected: currentAppInfo,
            current: actualAppInfos,
            lastCalled: new Date().toUTCString()
        });
    }
    
    function ladeAppInfos(items){
      return items.map((item) => {
        const url = "https://itunes.apple.com/de/lookup?id=" + item.id;
        return requestPromise({url: url, json: true});
      });
    }
};