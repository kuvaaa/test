"use strict";

var mineflayer = require('mineflayer');
var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var navigate2Plugin = require('./avoidBedrock.js')(mineflayer);
var async=require('async');
var vec3 = mineflayer.vec3;

function init(conf) {
    var bot = mineflayer.createBot({
        username: conf.target.username,
        host: "localhost",
        port: conf.server.port,
        verbose: true
    });
    
    navigatePlugin(bot);
    navigate2Plugin(bot);
    blockFinderPlugin(bot);
    var task=require('./task');
    var achieve=require('./achieve');

    // var chat = require('./bot.chat.js');
    // chat.init(bot,conf);

    // var metro = require('./bot.metro.js');
    // metro.init(bot,conf);

    bot.masters = [conf.bot.master];
    bot.quietMode = true;


    task.init(bot,vec3,achieve.achieve,achieve.achieveList,achieve.processMessage,mineflayer,async);
    achieve.init(task.all_task.tasks,task.all_task.giveUser,task.all_task.parameterized_alias,task.all_task.alias,task.all_task.stringTo,bot,vec3,conf.bot.master);

    // bot.on('login', function() {
    //     console.log("I logged in.");
    //     // bot.chat("/login "+conf.target.password);
    //     console.log("settings", bot.settings);
    // });


    // bot.on('spawn', function() {
    //     console.log("game", bot.game);
    // });

    // bot.on('death', function() {
    //     console.log("I died x.x");
    // });

    bot.on('chat',function(username,message){achieve.processMessage(message,username,function(err){if(!err) bot.chat("I "+(!err ? "achieved" : "failed")+" task "+message);});});

    // bot.navigate.on('pathFound', function (path) {
    //     console.log("found path. I can get there in " + path.length + " moves.");
    // });

    // bot.navigate.on('cannotFind', function () {
    //     console.log("unable to find path");
    // });

    // bot.on('health', function() {
    //     console.log("I have " + bot.health + " health and " + bot.food + " food");
    // });

    // bot.on('playerJoined', function(player) {
    //     console.log("hello, " + player.username + "! welmove to the server.");
    // });

    // bot.on('playerLeft', function(player) {
    //     console.log("bye " + player.username);
    // });

    // bot.on('kicked', function(reason) {
    //     console.log("I got kicked for", reason, "lol");
    // });


    // bot.on('nonSpokenChat', function(message) {
    //     console.log("non spoken chat", message);
    // });

    return bot;
}



module.exports = {
    init: init
};





