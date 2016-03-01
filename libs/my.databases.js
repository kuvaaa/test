(function(){
	var db = new function(){

		var bases = {};

		var db = function (){	};

		db.prototype.open = function (options,cb) {
			console.log("DB: open");

			function Database() {
			    this.name = false;
			    this.json = false;
			    console.log("DB: Database");
			}

			Database.prototype.opened = {};

			Database.prototype.loaded = function(options,cb) {

			};

			Database.prototype.load_template = function (cb, name) {
				var filename = name || "new";
				console.log("DB: load template");
				var file = my.fs.open_file_p(options.dbpath+"/template/"+filename+".json");
			    file.then(data => {
			    	//this.template = JSON.parse(data);
			    	cb(JSON.parse(data));
			    });
			}

			Database.prototype.load = function (options,cb) {
				console.log("DB: load");
				var self = this;
				console.log("load: ["+options.dbpath+"]");
			    var files = my.fs.read_dir_p(options.dbpath+"/data");
			    files.then(list => {
			        var items = [];
			        var keys = [];
			        list.forEach(item => {
			            items.push(my.fs.open_file_p(options.dbpath+"/data/"+item));
			            keys.push(item.replace(/\.json?$/,""));
			        });
			        Promise.all(items).then(values => {
			            var hash = {};
			            values.forEach((data,count) => {
			                var json = JSON.parse(data);
			            	json._db_path = options.dbpath+"/data/"+keys[count]+".json";
			            	json._db_filename = keys[count];
			                hash[keys[count]]=json;
			            });
			            console.log("DB: hash");
			            cb(hash);
			        });
			    });
			};

			Database.prototype.get_list = function() {
				var dataArray = new Array;
				for(var o in this.json) {
				    dataArray.push(this.json[o]);
				}
				return dataArray;
			};

			Database.prototype.save_item = function(filename) {
				var path = this.name+"/data/"+filename+".json";
				if(this.json[filename]._db_path){
					var path = this.json[filename]._db_path;
				}else{
	            	this.json[filename]._db_path = path;
	            	this.json[filename]._db_filename = filename;					
				}

				var result = my.fs.save_file_p(path, JSON.stringify(this.json[filename],"",'\t') );				
				result.then(json => {
					console.log("DB: saved item "+path);
					console.log(this.json[filename]);
				});
			};

			Database.prototype.remove_item = function(filename) {
				var path = this.name+"/data/"+filename+".json";
				if(this.json[filename]._db_path){
					var path = this.json[filename]._db_path;
				}		
				delete this.json[filename];

				var result = my.fs.remove_file_p(path);

				result.then(json => {
					console.log("DB: removed item "+path);
				});
			};

			Database.prototype.update_item = function(filename, data) {
				console.log("DB: update_item: "+filename);
				this.json[filename] = data;
				if(options.avtosave) this.save_item(filename);

			};


			var item = new Database();

			if(!bases[options.dbpath]){
				item.load(options,function(json){
					console.log("DB: callback");
					console.log("DB: loaded");

					item.name = options.dbpath;
					item.json = json;

					bases[options.dbpath] = {
						data: json
					};

					cb(item);


				});
			}else{
					item.name = options.dbpath;
					item.data = bases[options.dbpath].data;				
					cb(item);
			}

		}

		return db;
	};

	my.db = new db;

})();

