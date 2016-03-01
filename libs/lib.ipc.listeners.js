const ipcMain = require('electron').ipcMain;
const fs = require('fs');
const dialog = require('electron').dialog;
const encoding = "utf8";


function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}


// вешаем слушатель запростов на открытие файлов

ipcMain.on("openFile", function function_name(event, msg) {
    //console.log("request to listener [openfile]");
    var filename = dialog.showOpenDialog({
        defaultPath: "./",
        properties: ['openFile'],
        filters: [{
            name: "text",
            extensions: ["txt", "js", "json", "html", "md", "css", "less", "xml"]
        }]
    });
    //console.log("select file ["+filename+"] ["+JSON.stringify(filename)+"]");
    if (!filename && !filename[0]) {
        event.returnValue = {};
        return;
    }
    if (filename[0])
        filename = filename[0];

    fs.readFile(filename, encoding, function(err, data) {
        if (err) {
            event.returnValue = {};
        } else {
            data = new Buffer(data, "utf8").toString("base64");
            //console.log("event.returnValue: "+JSON.stringify({ "filename": filename, "data": data }));
            event.returnValue = {
                "filename": filename,
                "data": data
            };

        }
    });

});

ipcMain.on("saveFile", function function_name(event, msg) {
    //console.log("request to listener [savefile]");
    var filename = msg.filename;
    if (!filename) {
        filename = dialog.showSaveDialog({
            defaultPath: "./",
            filters: [{
                name: "text",
                extensions: ["txt", "js", "json", "html", "md", "css", "less", "xml"]
            }]
        });
    }

    //console.log("saveFile ERROR ["+filename+"]");
    if (!filename) {
        event.returnValue = {};
        return;
    }


    var data = new Buffer(msg.data, "base64").toString("utf8");
    fs.writeFile(filename, data, encoding, function(err) {
        if (err) {
            //console.log("select file [1] ["+filename+"]");
            event.returnValue = {};
        } else {
            //console.log("select file [2]");
            event.returnValue = {
                "filename": filename
            };
        }
    });

});






ipcMain.on("fs.get.dir", function function_name(event, msg) {
    console.log("request to listener [fs.get.dir] [" + msg.path + "]");

    if (!msg.path) {
        event.returnValue = {
            error: "Не указан путь"
        };
        return;
    }
    fs.readdir(msg.path, function(err, items) {
        if (err) {
            event.returnValue = {
                error: "Не удалось открыть файл [" + msg.filename + "]"
            };
        } else {
            event.returnValue = {
                "path": msg.path,
                "data": items
            };
        }
    });
});


ipcMain.on("fs.get.dir.recurse", function function_name(event, msg) {
    console.log("request to listener [fs.get.dir.recurse] [" + msg.path + "]");
    if (!msg.path) {
        event.returnValue = {
            error: "Не указан путь"
        };
        return;
    }
    var data = start_dir_parse(msg.path);
    event.returnValue = {
        "path": msg.path,
        "data": data
    };
});

function start_dir_parse(path) {
    var stats = fs.statSync(path);
    var item = path.replace(/^.*\//,'');
    var json = {
        id: path,
        value: item,
        size: stats["size"],
        type: (stats["mode"] & 0040000 ? "folder" : "text")
    };
    var date = Date.parse(stats["birthtime"]);
    json.date = moment(date).unix();
    if (stats["mode"] & 0040000) json.data = dir_parse(path);
    //console.log(JSON.stringify(json,"",'\t'));
    return [json];
};

function dir_parse(path) {
    var json = [];
    var items = fs.readdirSync(path);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var file = path + "/" + item;
        var stats = fs.statSync(file);
        var set = {
            id: file,
            value: item,
            size: stats["size"],
            type: stats["mode"] & 0040000 ? "folder" : "text"
        };
        var date = Date.parse(stats["birthtime"]);
        set.date = moment(date).unix();
        if (stats["mode"] & 0040000) set.data = dir_parse(file);
        json.push(set);
    }
    json.sort(compare_names).sort(compare_files);
    return json;
}

function compare_names(a, b) {
  if (a.value > b.value) return 1;
  if (a.value < b.value) return -1;
  return 0;
}

function compare_files(a, b) {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;
  return 0;
}


 
ipcMain.on("fs.get.file", function function_name(event, msg) {
    if (!msg.filename) {
        event.returnValue = { error: "Не указан путь" };
        return;
    }

    fs.readFile(msg.filename, encoding, function(err, data) {
        if (err) {
            event.returnValue = { error: "Не удалось открыть файл [" + msg.filename + "]" };
            return;
        }
        data = new Buffer(data, "utf8").toString("base64");
        event.returnValue = {
            message: "файл ["+msg.filename+"] был успешно прочитан",
            filename: msg.filename,
            data: data
        };
    });
});


ipcMain.on("fs.set.file", function function_name(event, msg) {
    if (!msg.filename) event.returnValue = { error: "Не указан путь" };
    if (!msg.data) event.returnValue = { error: "Нет данных для записи" };
    if (event.returnValue) return;

    var data = new Buffer(msg.data, "base64").toString("utf8");
    fs.writeFile(msg.filename, data, encoding, function(err) {
        if (err) {
            event.returnValue = { error: "Не удалось открыть файл [" + msg.filename + "]" };
            return;
        } 
        event.returnValue = { message: "файл ["+msg.filename+"] был успешно записан"};
    });
});

ipcMain.on("fs.rename.file", function function_name(event, msg) {
    if (!msg.filename) event.returnValue = { error: "Не указано имя файля для переименования" };
    if (!msg.newname) event.returnValue = { error: "Не указано новое имя файла" };
    if (event.returnValue) return;

    fs.rename(msg.filename, msg.newname, function(err, data) {
        event.returnValue = { message: "файл ["+msg.filename+"] был переименован в ["+msg.newname+"]" };
        if (!err) return;
        event.returnValue = { error: "Не удалось переименовать файл [" + msg.filename + "] в ["+msg.newname+"]" };
    });
});

ipcMain.on("fs.copy.file", function function_name(event, msg) {
    if (!msg.filename) event.returnValue = { error: "Не указано имя файля для копирования" };
    if (!msg.newname) event.returnValue = { error: "Не указано новое имя файла" };
    if (event.returnValue) return;

    fs.readFile(msg.filename, function(err, data) {
        if (err){
            event.returnValue = { error: "Не удалось открыть файл для чтения [" + msg.filename + "]" };
            return;
        }
        fs.writeFile(msg.newname, data, function(err) {
            event.returnValue = { error: "Не удалось открыть файл для записи [" + msg.newname + "]" };
            if (err) return;
            event.returnValue = { message: "файл ["+msg.filename+"] был скопирован в ["+msg.newname+"]" };
        });
    });
});

ipcMain.on("fs.remove.file", function function_name(event, msg) {
    if (!msg.filename) event.returnValue = { error: "Не указано имя файля для переименования" };
    if (event.returnValue) return;
    fs.unlink(msg.filename, function(err, data) {
        event.returnValue = { message: "файл ["+msg.filename+"] был успешно удален" };
        if (!err) return;
        event.returnValue = { error: "Не удалось удалить файл [" + msg.filename + "]" };
    });
});


const proxy = require('../bot/proxy.js');

ipcMain.on("proxy.start", function function_name(event, msg) {
    var data = fs.readFileSync('./bot/conf.json', 'utf8');
    var conf = JSON.parse(data);
    proxy.start(conf);
    if(conf.bot.withbot )
        ipcMain.emit("radar.start",{});
});

ipcMain.on("proxy.stop", function function_name(event, msg) {
    ipcMain.emit("radar.stop",{});
    proxy.stop();
});
