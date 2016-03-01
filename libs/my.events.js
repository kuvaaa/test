// запрашиваем модуль событий ядра node
// var EventEmitter = require('events').EventEmitter;

// создаем новый эмиттер событий
var emitter = new my.libs.EventEmitter;

// создать слушатель для события
emitter.on('пицца', function(message){
  console.log("1 "+message);
});

// создать слушатель для события
emitter.on('пицца', function(message){
  console.log("2 "+message);
});
// emit an event
emitter.emit('пицца', 'пицца это невероятно вкусно');




