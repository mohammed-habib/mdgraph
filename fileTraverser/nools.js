"use strict";

// Requires all modules
var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var mkdirp = require('mkdirp');
var path = require('path');
var nools = require("nools");
var dir; // stores directory

// open content.json as a string
var allContent = fs.readFileSync("content.json", "utf8");
allContent = JSON.parse(allContent);

var dependencyObj = new Array;

function dependencyNode(file, dependentFile, tag){
	this.file = file;
	this.dependOn = dependentFile;
	this.tag = tag;
}

// findDependency(allContent, tag) is passed a content.json file and a tag
// and finds all depedencies related to that source tag
function findDependency(allContent, tag) {

	var length = allContent.length;

		for (var i = 0; i < length; ++i) {
		var doc = allContent[i].xmlContent;
		var data = new DOMParser().parseFromString(doc, "text/xml");
		var srcFile  = "";
		var source = data.getElementsByTagName(tag);
		var file = allContent[i].fileName;

			if (typeof source[0] !== 'undefined') {
				srcFile += source[0].firstChild.nodeValue;
				var dependency = new dependencyNode(file, srcFile, tag);
				dependencyObj.push(dependency);
				//console.log(file + " is dependent on " + tag + " file " + srcFile + "\n");
			
			} 
		}
}

// simple structure for storing a message
var Message = function (message) {
    this.text = message;
};

// flow acts a a container for all the nools rules
var flow = nools.flow("Hello World", function (flow) {

	// turns source into relations
	flow.rule("sourceRule", [Message, "m", "m.text =~ /.*run$/"], function (facts) {
		findDependency(allContent, "source");
	});

	// turns target into relations
	flow.rule("targetRule", [Message, "m", "m.text =~ /.*run$/"], function (facts) {
		findDependency(allContent, "target");
	});
});

// when message is set to 'run' it will start the session and run
// all rules on the files in the given folder
var session = flow.getSession(new Message("run"));
session.match(function(err) {
	if (err) {
		console.error(err.stack);
	} else {

		var filePath = './dependency.json';
		var allData = JSON.stringify(dependencyObj, null, 4);
		fs.writeFileSync(filePath, allData); 
		console.log(dependencyObj.length);
		console.log("done");

	}
	session.dispose();
})