
var ptr = {};


function start(conf) {
  ptr.conf = conf;
  ptr.mc = require('minecraft-protocol');
  ptr.states = ptr.mc.states;


  ptr.srv = ptr.mc.createServer({
    'online-mode': false,
    port: conf.server.port,
    //keepAlive: false,
    version:conf.server.version
  });

  if( conf.bot.withbot ){
    ptr.botstatus = false;
    ptr.BOT = require('./rbot.my.js');
    ptr.bot = ptr.BOT.init(conf);
  }

  ptr.srv.on('login', function(client) {
    ptr.client = client;
    if(conf.bot.withbot && client.username!=conf.target.username){
      //ptr.bot.chat("Now I'm going to "+client.username);
      ptr.bot.end();

    }

    var addr = client.socket.remoteAddress;
    var now = new Date();

    var endedClient = false;
    var endedTargetClient = false;

    client.on('end', function() {
      endedClient = true;
      now = new Date();
      console.log(now+' Connection closed by client', '(' + addr + ') ');
      if(!endedTargetClient)
        ptr.targetClient.end("End");
      if(conf.bot.withbot && client.username!=conf.target.username){
        ptr.botstatus = true;
        console.log("запускаю бота (botstatus = true)");
      }
    });
    
    client.on('error', function() {
      endedClient = true;
      now = new Date();
      console.log(now+' Connection error by client', '(' + addr + ')');
      if(!endedTargetClient)
        ptr.targetClient.end("Error");
    });


    ptr.targetClient = ptr.mc.createClient({
      host: conf.target.host,
      port: conf.target.port,
      username: conf.target.login, //client.username,
      //clientToken: client.uuid,
      //keepAlive:false,
      version: conf.server.version,
      password: conf.target.password,
      'online-mode': true
    });
    client.on('packet', function(data, meta) {
      if(ptr.targetClient.state == ptr.states.PLAY && meta.state == ptr.states.PLAY) {
        if(!endedTargetClient)
          ptr.targetClient.write(meta.name, data);
      }
    });
    ptr.targetClient.on('packet', function(data, meta) {
      if(meta.state == ptr.states.PLAY && client.state == ptr.states.PLAY) {
        if(!endedClient) {
          client.write(meta.name, data);
          if (meta.name === 'set_compression') // Set compression
            client.compressionThreshold = data.threshold;
        }
      }
    });


    ptr.targetClient.on('end', function() {
      endedTargetClient = true;
      now = new Date();
      console.log(now+' Connection closed by server', '(' + addr + ')');
      if(!endedClient)
        client.end("End");
      if(conf.bot.withbot && client.username!=conf.target.username && ptr.botstatus){
        var timerId = setTimeout(function(){
          ptr.botstatus = false;
          ptr.BOT.init(conf);
        }, 6000);
      }
    });

    ptr.targetClient.on('error', function(err) {
      endedTargetClient = true;
      now = new Date();
      console.log(now+' Connection error by server', '(' + addr + ') ',err);
      console.log(err.stack);
      if(!endedClient)
        client.end("Error");


    });
  });
}

function stop(){
  if(ptr.bot && ptr.conf.bot.withbot){
      //ptr.bot.chat("66");
      ptr.bot.end();
  }
  if(ptr.client)
      ptr.client.end("close");
  if(ptr.targetClient)
      ptr.targetClient.end("close");
    ptr.botstatus = false;
    ptr.srv.close();
}

module.exports = {
    start: start,
    stop: stop
};

