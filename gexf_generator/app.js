var gen = require('./gexfgen.js');
var digraph = require('../GraphDataStructure/digraph');
var attr = require('../GraphDataStructure/attribute');

var graph = digraph();
graph.add.node(1,'hi',10,10,10,null,null,null);
console.log(graph.graph);

//gen.graphGenerator(g);