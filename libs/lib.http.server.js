//var express = require('express')
//var serveStatic = require('serve-static')

//var app = express()

//app.use(serveStatic('public/ftp', {'index': ['default.html', 'default.htm']}))
//app.listen(3000)

try{
	var express = require('express');
	var serveStatic = require('serve-static');

	var app = express();
	var root = __dirname.replace(/\/\w+?$/, '');
	console.log(root);


	//app.use(serveStatic('public/ftp', {'index': ['main.html','default.html', 'default.htm']}));
	app.use(serveStatic(root, {'index': ['main.html','default.html', 'default.htm']}));
	//app.use(serveStatic(__dirname + '/public'));

	app.listen(8080);
}catch(e){

	console.log("http error: ["+e+"]");
}