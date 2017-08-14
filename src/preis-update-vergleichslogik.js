'use strict'

const requestPromise = require('request-promise');
const SlackBot = require('slackbots');

module.exports = function (context, callback) {
  let bot = new SlackBot({token: context.secrets.slackbotToken, name: context.secrets.slackbotName});

  ladeITunesDaten().then(result => {
    vergleicheAppInfos(result.current, result.expected);
  });

  function ladeITunesDaten() {
    return requestPromise({url: context.secrets.itunesUpdateUrl, json: true});
  }

  function vergleicheAppInfos(actual, expected) {
    let isPreisGeaendert = false;
    actual.forEach(currentItem => {
      const expectedItem = expected.find(x => x.id === currentItem.id);
      if (!expected) {
        const fehlerText = 'kein Vergleichobjekt';
        poste(fehlerText);
        throw Error(fehlerText);
      }
      if (expectedItem.price !== currentItem.price) {
        const text = "Preis von " + currentItem.name + " hat sich geändert: " + expectedItem.price + " -> " + currentItem.price;
        poste(text);
        console.log(text);
        isPreisGeaendert = true;
      }
    });
    callback(null, {"aenderungen": isPreisGeaendert, lastCalled: new Date().toLocaleDateString('de-DE') + ' - ' + new Date().toLocaleTimeString('de-DE')});
  }

  function poste(text) {
    bot.postMessageToChannel(context.secrets.slackbotChannelName, text, {icon_emoji: ":android:"}, null);
  }
};