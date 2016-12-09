var DownloadRepository = require('./repositories/download.repository');
var DownloadClient = require("utorrent-api");
var path = require('path');

const config = load();
const client = new DownloadClient(get('utserver.host', 'localhost'), get('utserver.port', '8080'));
client.setCredentials(get('utserver.username', 'admin'), get('utserver.password', ''));
const downloadRepository = new DownloadRepository();

function get(prop, defaultValue){
  let paths = prop.split('.');
  let target = config;
  paths.forEach(path => {
    if(target){
      if(target[path] === undefined){
        target = undefined;
      }else{
        target = target[path];
      }
    }
  });
  return target || defaultValue;
}

function getDownloadClient(){
  return client;
}

function getDownloadRepository(){
  return downloadRepository;
}


function load(){
  let fileConfig = loadConfig();
  let envConfig = loadEnv();
  let config = {};
  Object.assign(config, fileConfig, envConfig);
  return config;
}

function loadConfig(){
  return require(path.join(__dirname, './config.json'));
}

function loadEnv(){

}

module.exports.get = get;
module.exports.getDownloadClient = getDownloadClient;
module.exports.getDownloadRepository = getDownloadRepository;