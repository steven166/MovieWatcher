var config  = require('../config');
var fs = require('fs');
var path = require('path');

class DownloadRepository {

  insert(download) {
    let file = this.getFileFor(download.hash);
    return new Promise(function (resolve, reject) {
      let json = JSON.stringify(download);
      fs.writeFile(file, json, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  find(hash) {
    let file = this.getFileFor(hash);
    return new Promise(function (resolve, reject) {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            let object = JSON.parse(data);
            resolve(object);
          }catch(e){
            reject(e);
          }
        }
      });
    });
  }

  remove(hash) {
    let file = this.getFileFor(hash);
    return new Promise(function (resolve, reject) {
      fs.unlink(file, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getFileFor(hash) {
    return path.join(__dirname, '..', config.get('storage', 'data'), hash + '.json');
  }

}

module.exports = DownloadRepository;
