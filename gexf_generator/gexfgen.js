'use strict';
var fs = require('fs');

// Metadata variables
var creator = 'Michael Zhang';
var date = '2016-12-07';
var description = 'File creation based on Gephi 0.9 gexf file';

/*
** A Graph is made up of nodes, edges and groups
** Nodes are objects consisting of a name, an (x,y) position, a size, colour, group, and attribute
** Edges are a short list of [id, fromNode, toNode, edgeLabel]
** Groups are identifiers for sets of nodes with the similar attributes or other categorical reasons
*/

class node {
	constructor(id, label, x, y, size, colour, group, attr) {
		this.id = id;
		this.label = label;
		this.x = x;
		this.y = y;
		this.size = size;
		this.colour = colour;
		this.group = group;
		this.attr = attr;
	}
	/*constructor(name, x, y, size) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
	}*/
};

// Temp nodes
var node1 = new node(1, 'centerNode', 0, 0, 15, null, null, null);
var node2 = new node(2, 'secondNode', 10, 0, 10, null, null, null);
var node3 = new node(3, 'thirdNode', 0, 10, 10, null, null, null);
var node4 = new node(4, 'fourthNode', -10, 0, 10, null, null, null);
var node5 = new node(5, 'fifthNode', 0, -10, 10, null, null, null);
var node6 = new node(6, 'sixthNode', 7.07, 7.07, 10, null, null, null);
var node7 = new node(7, 'seventhNode', -7.07, 7.07, 10, null, null, null);
var node8 = new node(8, 'eigthNode', 7.07, -7.07, 10, null, null, null);
var node9 = new node(9, 'ninthNode', -7.07, -7.07, 10, null, null, null);

// Temp edges
var edge1 = [1, 2, 1, '1'];
var edge2 = [2, 3, 1, '2'];
var edge3 = [3, 4, 1, '3'];
var edge4 = [4, 5, 1, '4'];
var edge5 = [5, 6, 1, '5'];
var edge6 = [6, 7, 1, '5'];
var edge7 = [7, 8, 1, '5'];
var edge8 = [8, 9, 1, '5'];

var graph = {
	nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9], 
	edges: [edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8],
	groups: []
};

function graphGenerator(g) {
	// Variable to store file contents, initiate file headers
	var data = '<?xml version="1.0" encoding="UTF-8"?>\n';
	data += '<gexf xmlns="http://www.gexf.net/1.3" version="1.3" xmlns:viz="http://www.gexf.net/1.3/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.3 http://www.gexf.net/1.3/gexf.xsd">\n';
	data += '\t<meta lastmodifieddate="'+date+'">\n';
	data += '\t\t<creator>'+creator+'</creator>\n';
	data += '\t\t<description>'+description+'</description>\n';
	data += '\t</meta>\n';
	data += '\t<graph defaultedgetype="directed" mode="static">\n';
	
	// Start node creation
	data += '\t\t<nodes>\n';
	var n;
	
	for (var i = 0; i < graph.nodes.length; i++) {
		n = graph.nodes[i];
		data += '\t\t\t<node id="'+n.id+'" label="'+n.label+'">\n';
        data += '\t\t\t\t<viz:size value="'+n.size+'"></viz:size>\n';
        data += '\t\t\t\t<viz:position x="'+n.x+'" y="'+n.y+'"></viz:position>\n';
		data += '\t\t\t</node>\n';
	}
	
	// End node creation
	data += '\t\t</nodes>\n';
	
	// Start edge creation
	data += '\t\t<edges>\n';
	var e;
	
	for (var i = 0; i < graph.edges.length; i++) {
		e = graph.edges[i];
		data += '\t\t\t<edge id="'+e[0]+'" source="'+e[1]+'" target="'+e[2]+'" label="'+e[3]+'"></edge>\n';
	}
	
	// End edge creation
	data += '\t\t</edges>\n';
	
	// End graph and file
	data += '\t</graph>\n';
	data += '</gexf>\n';
	
	// Write the generated data variable to a .gexf file
	fs.writeFile('asd.gexf',data,function(err) {
		if (err) {
			console.log(err);
		}
	});
};

exports.graphGenerator = graphGenerator;