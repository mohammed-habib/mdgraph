var generator = require('./gexfgen.js');
var digraph = require('../GraphDataStructure/digraph');
var attribute = require('../GraphDataStructure/attribute');
var colour = require('../GraphDataStructure/colour');

/* var lineReaderNodes = require('readline').createInterface({
  input: require('fs').createReadStream('nodes.csv')
});
var lineReaderEdges = require('readline').createInterface({
  input: require('fs').createReadStream('edges.csv')
}); */

var graph = digraph();

/* var arr;
var x=-50;
var y=-100;
var group1 = 'cmap';
var group2 = 'doc';
var group3 = 'dstruct';
lineReaderNodes.on('line', function (line) {
	arr = line.split(',');
	if (arr[1].indexOf('cmap_') > -1) {
		graph.add.node(arr[0], arr[1], x, y, 10, new colour(255, 0, 0), group1, new attribute('acategory', group1));
	}
	else if (arr[1].indexOf('doc_') > -1) {
		graph.add.node(arr[0], arr[1], x, y, 10, new colour(0, 255, 0), group2, new attribute('acategory', group2));
	}
	else if (arr[1].indexOf('dstruct_') > -1) {
		graph.add.node(arr[0], arr[1], x, y, 10, new colour(0, 0, 255), group3, new attribute('acategory', group3));
	}
	x += 10;
	if (x >= 50) {
		x = -50;
		y += 20;
	}
});

lineReaderEdges.on('line', function (line) {
	arr = line.split(',');
	//console.log(arr);
}); */

graph.add.node(1,'a',0,0,10,new colour(0,0,255), 'GroupA',new attribute('acategory', 'valueA'));
graph.add.node(2,'b',25,25,10,new colour(255,0,0), 'GroupB',new attribute('acategory', 'valueB'));
graph.add.node(3,'c',50,50,10,new colour(0,255,0), 'GroupB',new attribute('acategory', 'valueC'));
graph.add.edgebyId(100, 1, 2, 'asd');
graph.add.edgebyId(101, 2, 3,'LABEL');

//Function for position and colour based on attributes
var g = graph.export.obj();
console.log(g.nodes);

generator.generate(g);