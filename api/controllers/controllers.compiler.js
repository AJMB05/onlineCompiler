var dbconn = require('../data/dbconnections.js');

module.exports.compile = function (req, res) {	
	var fs = require('fs');
	var exec = require('child_process');
	
	var lang = req.body.lang;
	var code = req.body.code;
	var studyId = (req.body.studyId == undefined) ? 0 : req.body.studyId;
	var participantId = (req.body.participantId == undefined) ? 0 : req.body.participantId;
	fs.writeFile("uploads/code." + lang, code, function(err){
		if (!err){
			var db = dbconn.get();
			db.collection('outputFormats')
				.findOne({extension : lang},{out : 1}, function(er, doc){
					//exec.exec('/home/aldo/l3-0.4.1/Build/Compiler/Linux-x86_64-7.10.3/l3 -f ' + lang + ' -o../outputs uploads/code.' + lang , function(e, stdout, stderr){
					exec.exec('/home/aldo/l3-0.4.1/Build/Compiler/Linux-x86_64-7.10.3/l3 -f ' + lang + ' -o- uploads/code.' + lang , function(e, stdout, stderr){
						fs.unlink('uploads/code.' + lang);
						var result = false;
						var output = "";
						if (stderr != ""){
							res.setHeader('content-type', 'text/html');
							output = stderr;
							//res.send(stderr);
						}else{
							res.setHeader('content-type', 'application/json');
							output = stdout;
							result = true;
							//res.send(stdout);
						}
						
						if (studyId == 0 && participantId == 0){
							res
								.status(200)
								.send(output);
						}else{
							db.collection('compileAttempts').find({studyCode : studyId, participantId : participantId}).sort({attempt_number : -1}).limit(1).toArray(function(er, docs){
								var doc = docs[0];
								db.collection('compileAttempts').insertOne({
									"participantId" : doc.participantId,
									"studyCode" : doc.studyCode,
									"attempt_number" : doc.attempt_number+1,
									"timestamp" : Date.now(),
									"input" : escape(code),
									"output" : output,
									"result" : result
								}, function(err, result){
									res
										.status(200)
										.send(output);
								});
							});
						}					
					});
				});
		} 
		else{
			console.log(err);		
		}
	});
};

module.exports.getInitialValues = function (req, res) {
	var participantId = req.params.participantId;
	var studyId = req.params.studyId;
	var db = dbconn.get();
	var startState = "";
	db.collection('compileAttempts')
		.find({studyCode : studyId, participantId : participantId})
		.sort({attempt_number : -1}).limit(1).toArray(function(er, docs){
			console.log(docs);
			doc = docs[0];
			//startState = doc.startState;
			if (doc==null){
				console.log("No attempts registered for this user in this study");
				db.collection('study').findOne({studyCode : studyId},{startState : 1}, function(er, doc){
					if (doc==null){
						console.log("Study Information Not Found");
						res
							.status(400)
							.send("Study Information Not Found");
					}else{
						console.log("Inserting attempt 0 with initial state");
						//console.log(doc);
						db.collection('compileAttempts').insertOne({
							"participantId" : participantId,
							"studyCode" : studyId,
							"attempt_number" : 0,
							"timestamp" : Date.now(),
							"input" : doc.startState,
							"output" : "",
							"result" : ""
						}, function(err, result){
							console.log("Inserted initial attempt");
							res
								.status(200)
								.send(unescape(doc.startState));
						});

					}
				});
			}else{
				console.log("Found attempt number " + doc.attempt_number);
				res
						.status(200)
						.send(unescape(doc.input));
			}
		});
		//.render("public/index.html");
};

module.exports.getOutputs = function (req, res) {
	var db = dbconn.get();
	db.collection('outputFormats')
		.find({},{name : 1, extension : 1})
		.toArray(function(er, docs){
			res
				.json(docs);
		});
}