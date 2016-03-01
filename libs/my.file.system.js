(function(){
	var fs = new function(){
		var fs = function (a){};


		fs.prototype.read_dir_p = function (path) {
			return new Promise(function(resolve, reject) {
				my.ipc.request("fs.get.dir", {"path":path},function(err,json){
			        if(!json.error){
			        	resolve(json.data);
			        }else{
						var error = new Error("Error in fs.prototype.read_dir_p "+(json.error? json.error : err ));
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};


		fs.prototype.open_file_p = function (filename){
			return new Promise(function(resolve, reject) {
				my.ipc.request("fs.get.file", {"filename":filename},function(err,json){
			        if(!json.error && json.data){
			        	var data = my.base64.decode(json.data);
			        	resolve(data,json.filename,json.filename);
			        }else{
						var error = new Error("Error in fs.prototype.open_file_p "+(json.error? json.error : err ));
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};

		fs.prototype.save_file_p = function (filename, data){
			return new Promise(function(resolve, reject) {
				var packet_data = my.base64.encode(data);
				my.ipc.request("fs.set.file", {"filename":filename, "data": packet_data},function(err,json){
			        if(!json.error && !err ){
			        	resolve(json);
			        }else{
						var error = new Error("Error in fs.prototype.save_file_p "+(json.error? json.error : err ));
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};

		fs.prototype.rename_file_p = function (oldname, newname){
			return new Promise(function(resolve, reject) {
				my.ipc.request("fs.rename.file", {"filename":oldname, "newname": newname },function(err,json){
			        if(!json.error && !err ){
			        	resolve(json);
			        }else{
						var error = new Error("Error in fs.prototype.rename_file_p "+(json.error? json.error : err ) );
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};

		fs.prototype.copy_file_p = function (filename, newname){
			return new Promise(function(resolve, reject) {
				my.ipc.request("fs.copy.file", {"filename":filename, "newname": newname },function(err,json){
			        if(!json.error && !err ){
			        	resolve(json);
			        }else{
						var error = new Error("Error in fs.prototype.copy_file_p "+(json.error? json.error : err ));
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};

		fs.prototype.remove_file_p = function (filename){
			return new Promise(function(resolve, reject) {
				my.ipc.request("fs.remove.file", {"filename":filename },function(err,json){
			        if(!json.error && !err ){
			        	resolve(json);
			        }else{
						var error = new Error("Error in fs.prototype.delete_file_p "+(json.error? json.error : err ));
						error.code = 0;;
						reject(error);
			        }
			    });
			});
		};

		return fs;
	};

	my.fs = new fs;

})();
