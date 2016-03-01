/*//Создадим объект пользователей
function Users(name){
this.name = name;
}
//Добавим еще один метод для вывода имени
Users.prototype.view = function(){
console.log(this.name);
};
module.exports.Users =  Users;//Возвращаем переменную из модуля



function Ipc(config){

}
//Добавим еще один метод для вывода имени
Ipc.prototype.on = function(chanel, callback){
emitter.on(chanel, callback);
};

Ipc.prototype.send(chanel, message){
emitter.emit(json.channel, back_event, json.message);
}

module.exports.Ipc =  Users;//Возвращаем переменную из модуля


*/


//const ipcRenderer = require('electron').ipcRenderer;
//const ipcMain = require('electron').ipcMain;

var express = require('express');
var ipc = express();
var expressWs = require('express-ws')(ipc);

ipc.use(function(req, res, next) {
  //console.log('middleware');
  req.testing = 'testing';
  return next();
});

ipc.get('/', function(req, res, next) {
  //console.log('get route', req.testing);
  res.end();
});

var ipcMain = require('electron').ipcMain;

ipc.ws('/', function(ws, req) {
  ws.on('message', function(message) {


    //console.log("websocket server get message: "+message);
    var json = JSON.parse(message);
    if (json.listener == "add") {
      var cb = function(event, msg) {
        try {
          ws.send(JSON.stringify({
            "channel": json.channel,
            "message": msg
          }));
        } catch (e) {
          console.log("removeListener for channel: " + json.channel);
          ipcMain.removeListener(json.channel, cb);
        }
      };

      ipcMain.on(json.channel, cb);
    } else if (json.listener == "del") {

    } else if (json.sync) {
      var back_event = {};

      Object.observe(back_event, function(changes) {
        //console.log("Object.observe: "+JSON.stringify({"answer":json.sync,"message":back_event.returnValue}));
        ws.send(JSON.stringify({
          "answer": json.sync,
          "message": back_event.returnValue
        }));
      });
      //console.log("sync request: "+message);
      ipcMain.emit(json.channel, back_event, json.message);
    } else {
      var back_event = {
        "sender": {
          "send": function(channel, message) {
            ws.send(JSON.stringify({
              "channel": channel,
              "message": message
            }));
          }
        }
      }
      ipcMain.emit(json.channel, back_event, json.message);
      //console.log("get message for ["+json.channel+"] "+json.message);
    }

  });
  //console.log('socket', req.testing);
});


// слушаем
ipc.listen(8081);
