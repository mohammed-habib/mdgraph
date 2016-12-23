var fs = require('fs');
var generator = require('./gexfgen.js');
var visualizer = require('./visualizer.js');
var digraph = require('../GraphDataStructure/digraph');
var attribute = require('../GraphDataStructure/attribute');
var colour = require('../GraphDataStructure/colour');
//var config = require('config');

var graph = digraph();

var arr;
var name;
var group1 = 'cmap';
var group2 = 'doc';
var group3 = 'dstruct';

fs.readFileSync('./nodes.txt').toString().split('\n').forEach(
	function (line) {
		arr = line.split(',');
		if (arr[1] != undefined) {
			if (arr[1].indexOf('cmap_') > -1) {
				graph.add.node(arr[0], arr[1], 10, group1, new attribute('acategory', group1));
			}
			else if (arr[1].indexOf('doc_') > -1) {
				graph.add.node(arr[0], arr[1], 10, group2, new attribute('acategory', group2));
			}
			else if (arr[1].indexOf('dstruct_') > -1) {
				graph.add.node(arr[0], arr[1], 10, group3, new attribute('acategory', group3));
			}
		}
    }
);

fs.readFileSync('./edges.txt').toString().split('\n').forEach(
	function (line) {
		arr = line.split(',');
		if (arr[1] != undefined) {
			graph.add.edgebyId(arr[2], arr[0], arr[1], arr[3]);
		}
	}
);

var g = graph.export.obj();

console.log("~~~~~~~~~~~~~~~~BEFORE VISUALS~~~~~~~~~~~~~~~~~~~");
console.log(g.nodes);
//g = visualizer.visuals(g);
//console.log("~~~~~~~~~~~~~~~~AFTER VISUALS~~~~~~~~~~~~~~~~~~~");
//console.log(g.nodes);
//generator.generate(g);