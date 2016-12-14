var generator = require('./gexfgen.js');
var digraph = require('../GraphDataStructure/digraph');
var attribute = require('../GraphDataStructure/attribute');
var colour = require('../GraphDataStructure/colour');

var graph = digraph();
graph.add.node(1,'a',0,0,10,new colour(0,0,255), 'GroupA',new attribute('acategory', 'valueA'));
graph.add.node(2,'b',25,25,10,new colour(255,0,0), 'GroupB',new attribute('acategory', 'valueB'));
graph.add.node(3,'c',50,50,10,new colour(0,255,0), 'GroupB',new attribute('acategory', 'valueC'));
graph.add.edge(100,'a','b', 'asd');
graph.add.edge(101,'a','c','LABEL');
var g = graph.export.obj();

generator.generate(g);