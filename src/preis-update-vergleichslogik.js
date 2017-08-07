const requestPromise = require('request-promise');
const SlackBot = require('slackbots');

module.exports = function(context, callback) {
    var bot = new SlackBot({token:context.secrets.slackbotToken, name:context.secrets.slackbotName});
 
    ladeITunesDaten().then(result => {
     vergleicheAppInfos(result.current, result.expected);
    });
    
    function ladeITunesDaten(){
       return requestPromise({url: context.secrets.itunesUpdateUrl, json: true});
    }
    
    function vergleicheAppInfos(actual, expected){
       actual.forEach(currentItem => {
        var expectedItem = expected.find(x => x.id === currentItem.id);
        if(!expected){
          var fehlerText = 'kein Vergleichobjekt';
          poste(fehlerText);
          throw Error(fehlerText);
        }
        if(expectedItem.price !== currentItem.price){
          var text = "Preis von " + currentItem.name + " hat sich geändert: " + expectedItem.price + " -> " + currentItem.price; 
          poste(text);
          console.log(text);
          callback(null,{"aenderungen":true, lastCalled: new Date().toUTCString()});
        } else {
          callback(null,{"aenderungen":false, lastCalled: new Date().toUTCString()});
        }
      });
    }
    
    function poste(text){
      bot.postMessageToChannel(context.secrets.slackbotChannelName, text,  {icon_emoji : ":android:"}, null);
    }
};