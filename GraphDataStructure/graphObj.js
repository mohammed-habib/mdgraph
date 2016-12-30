var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var path = require('path');

var digraph = require('./digraph');
var attribute = require('./attribute');
var colour = require('./colour');
var g = digraph();

// get allcontent and dependency object from the mongoDB
var allContent = fs.readFileSync("content.json", "utf8"); 
var dependency = fs.readFileSync("dependency.json", "utf8");
allContent = JSON.parse(allContent);
dependency = JSON.parse(dependency);

addNodes(allContent);
addEdges(dependency);

function addNodes(allContent){
	var length = allContent.length;
	for(var i = 0; i < length; i++){
		var fileName = allContent[i].fileName;
		var size = 5;
		var nameSpace = allContent[i].nameSpace;
		var key = 'acatagory';
		var value = nameSpace;
		g.add.node(i, fileName, size, nameSpace, new attribute(key, value) );
	}
}

function addEdges(dependency){
	var len = dependency.length;
	for(var k = 0; k < len; k++){
		g.add.edge(k, dependency[k].file, dependency[k].dependOn, dependency[k].tag);
	}
}

g = g.stringify();

fs.writeFile('./graphDS.txt', g);
