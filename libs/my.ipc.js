(function(){

	// // создаем новый эмиттер событий
	// var emitter = new my.libs.EventEmitter;

	// // создать слушатель для события
	// emitter.on('пицца', function(message){
	//   console.log("1 "+message);
	// });

	// // создать слушатель для события
	// emitter.on('пицца', function(message){
	//   console.log("2 "+message);
	// });
	// // emit an event
	// emitter.emit('пицца', 'пицца это невероятно вкусно');



	var ipc = function(){
		var _debug = false;
		var count = 0;
		var isready = false;
		var socket  = new WebSocket(my.host.ws);
		//var socket  = new WebSocket("ws://192.168.1.122:8081/");

		var owner = this;
		var emitter = new my.libs.EventEmitter;

	   	var white_send = function (message){
	   		if( isready ){
	   			socket.send(message);	
	   		}else{
		   		var msg = message;
		   		emitter.once("_ready",function(){
		   			socket.send(msg);	
		   		});
		   	}
	    };

	    this.init = function(){
	        return 'Hello';
	    };

	    this.on = function (channel, callback) {
	    	if(_debug) console.log("ipc add emitter: "+channel);
	    	emitter.on(channel,callback);
	    	var data = JSON.stringify({
				"listener": "add",
				"channel": channel
	    	});
	    	white_send(data);
	    };

	    this.send = function (channel,message){
	    	if(_debug) console.log("ipc send: "+channel);
	    	var data = JSON.stringify({
				"channel": channel,
				"message": message
	    	});
	    	white_send(data);
	    };




	    this.request = function (channel,message,cb){
	    	console.log("ipc.request: " + channel );
	    	console.log(message);
	    	if(_debug) console.log("ipc request: "+channel);
	    	count++;
	    	var sync=channel+"."+count;
	    	var data = JSON.stringify({
	    		"sync": sync,
				"channel": channel,
				"message": message
	    	});

	    	white_send(data);
	    	if(_debug) console.log( "add emmiter: "+sync);
	    	emitter.once(sync,cb);
	    	
		};






		this.onready = function(cb) { 
			//console.log("set onready listener");
			emitter.once("_ready",cb);
			if(_debug) emitter.once("_ready",function(){
				console.log("_ready");
			});
		};

		// навешиваем на новый объект три колл-бека:
		// первый вызовется, когда соединение будет установлено:
		socket.onopen = function() { 
			try{
				webix.ready(function(){
				 	isready = true;
					emitter.emit("_ready",owner);
				 	if(_debug) console.log("Connection opened... ["+isready+"]");
				});				
			}catch(e){
				var win_redy = window.onload;
				window.onload = function(){
					if( typeof win_redy == "function")	win_redy();
				 	isready = true;
					emitter.emit("_ready",owner);
				 	if(_debug) console.log("Connection opened... (no webix) ["+isready+"]");
				};
			}
		};
		 
		// второй - когда соединено закроется
		socket.onclose = function() { 
			if(_debug) console.log("Connection closed...");
			isready = false;
		};
		 
		// и, наконец, третий - каждый раз, когда браузер получает какие-то данные через веб-сокет
		socket.onmessage = function(message) { 
		        // process WebSocket message
		        var json = JSON.parse(message.data);
		        if(_debug) console.log("get websocket message: "+message.data);

		        //console.log("message data: "+message.data);

		        if( json.sync ){
		            //var replies = ipcRenderer.sendSync(json.channel, json.message);
		            //ipc.emit(json.channel, back_event, json.message);
		        }else if( json.answer){
		        	if(_debug) console.log("answer data: ["+json.answer+"] "+json.message);
		        	emitter.emit(json.answer,false,json.message);
		        }else{
		            emitter.emit(json.channel, json.message);
		        }
		};
		return this;
	};


	// создаем экземпляр
	my.ipc = new ipc;

})();


