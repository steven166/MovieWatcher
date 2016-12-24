var express = require("express");
var config = require("../config");
var path = require("path");
var downloadStates = require('../domain/download-states');
var error = require('./route.helper').error;
var softError = require('./route.helper').softError;

var router = express.Router();

router.get('/downloads', (req, res, next) => {
  config.getDownloadClient().call('list', (err, body) => {
    if(err) {
      softError(res, err);
      return;
    }

    let downloads = body.torrents.map(download => {
      let states = [];
      Object.keys(downloadStates).forEach(stateName => {
        if(download[1] & downloadStates[stateName]){
          states.push(stateName);
        }
      });


      return {
        hash: download[0],
        states: states,
        title: download[2],
        size: download[3],
        progress: download[4] / 10,
        downloadSpeed: download[9],
        uploadSpeed: download[8],
        eta: download[10]
      };
    });

    let promises = downloads.map(download => config.getDownloadRepository().find(download.hash));
    Promise.all(promises).then(items => {
      // merge imdb and title
      items.filter(item => item).forEach(item => {
        downloads.filter(download => download.hash.toLowerCase() === item.hash.toLowerCase()).forEach(download => {
          download.imdb = item.imdb;
          download.title = item.title;
        });
      });

      // fix state
      downloads.forEach(download => {
        if(download.progress >= 100){
          download.state = "COMPLETE";
        }else if(download.states.indexOf('ERROR') > -1){
          download.state = 'ERROR';
        }else if(download.states.indexOf('PAUSED') > -1){
          download.state = 'PAUSED';
        }else if(download.progress > 0){
          download.state = 'DOWNLOADING';
        }else{
          download.state = 'PENDING';
        }
      });

      // remove completed
      downloads.filter(download => download.state === 'COMPLETE').forEach(download => removeCompleteDownloads(download));

      res.json(downloads);
    }).catch(err => error(res, err));
  });
});

function removeCompleteDownloads(download){
  config.getDownloadClient().call('removetorrent', {hash: download.hash}, function(err) {
    if(err) {
      console.error(err);
      return;
    }

    config.getDownloadRepository().remove(download.hash)
        .then(() => res.send())
        .catch(err => console.error(err));
  });
}

module.exports = router;
