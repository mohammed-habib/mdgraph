var generator = require('./gexfgen.js');
var digraph = require('../GraphDataStructure/digraph');
var attribute = require('../GraphDataStructure/attribute');
var colour = require('../GraphDataStructure/colour');

var graph = digraph();
graph.add.node(1,'a',50,50,1,new colour(0,0,255), 'GroupA',new attribute('key', 'value'));
graph.add.node(2,'b',50,50,1,new colour(255,0,0), 'GroupB',new attribute('key', 'value'));
graph.add.node(3,'c',50,50,1,new colour(0,255,0), 'GroupB',new attribute('key', 'value'));
graph.add.edge(100,'a','b', 'asd');
graph.add.edge(101,'a','c','LABEL');
var g = graph.export.obj();
console.log(g);
console.log(g.nodes[0].getAttr());
console.log(g.nodes[0].getColour());

generator.generate(g);