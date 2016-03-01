var my = new function(){
	var my = function (){
	};

	return my;
};

my.effects = {};
my.libs = {};
my.host = {};

var get_host = function(){
	if( location.origin.match(/^file/)){
		my.host.http = "http://127.0.0.1:8080/";
		my.host.ws = "ws://127.0.0.1:8080/";	
	}
	else{
		my.host.http = location.origin+"/";
		my.host.ws = location.origin.replace(/^http/, 'ws')+"/";
	}
	my.host.ws = my.host.ws.replace(/:8080/, ':8081');
}
get_host();

console.log("http host: "+my.host.http);
console.log("ws host: "+my.host.ws);


//my.ipcRenderer = require('electron').ipcRenderer;
