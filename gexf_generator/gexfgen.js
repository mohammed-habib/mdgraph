var fs = require('fs');
var digraph = require('../GraphDataStructure/digraph');
var metadata = require('./metadata');

/*
** A Graph is made up of nodes, edges and groups
** Nodes are objects consisting of a name, an (x,y) position, a size, colour, group, and attribute
** Edges are a short list of [id, fromNode, toNode, edgeLabel]
** Groups are identifiers for sets of nodes with the similar attributes or other categorical reasons
*/

function graphGenerator(g) {
	// Variable to store file contents, initiate file headers
	var data = '<?xml version="1.0" encoding="UTF-8"?>\n';
	data += '<gexf xmlns="http://www.gexf.net/1.3" version="1.3" xmlns:viz="http://www.gexf.net/1.3/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.3 http://www.gexf.net/1.3/gexf.xsd">\n';
	data += '\t<meta lastmodifieddate="'+metadata.date+'">\n';
	data += '\t\t<creator>'+metadata.creator+'</creator>\n';
	data += '\t\t<description>'+metadata.description+'</description>\n';
	data += '\t</meta>\n';
	data += '\t<graph defaultedgetype="directed" mode="static">\n';
	
	// Include attributes for node groups
	data += '\t\t<attributes class="node" mode="static">\n';
	data += '\t\t\t<attribute id="'+g.nodes[0].getAttr().key+'" title="Category" type="string"></attribute>\n';
	data += '\t\t</attributes>\n';
	
	// Start node creation
	data += '\t\t<nodes>\n';
	var n;
	
	for (var i = 0; i < g.nodes.length; i++) {
		n = g.nodes[i];
		// Node id and label
		data += '\t\t\t<node id="'+n.id+'" label="'+n.name+'">\n';
		
		// Attribute key/values
		data += '\t\t\t\t<attvalues>\n';
		data += '\t\t\t\t\t<attvalue for="'+n.getAttr().key+'" value="'+n.getAttr().value+'"></attvalue>\n';
		data += '\t\t\t\t</attvalues>\n';
		
		// Node visuals
        data += '\t\t\t\t<viz:size value="'+n.size+'"></viz:size>\n';
        data += '\t\t\t\t<viz:position x="'+n.x+'" y="'+n.y+'"></viz:position>\n';
		data += '\t\t\t\t<viz:color r="'+n.getColour().r+'" g="'+n.getColour().g+'" b="'+n.getColour().b+'"></viz:color>\n';
		data += '\t\t\t</node>\n';
	}
	
	// End node creation
	data += '\t\t</nodes>\n';
	
	// Start edge creation
	data += '\t\t<edges>\n';
	var e;
	
	for (var i = 0; i < g.edges.length; i++) {
		e = g.edges[i];
		// Edge id, source node, target node, and label
		data += '\t\t\t<edge id="'+e[0]+'" source="'+e[1]+'" target="'+e[2]+'" label="'+e[3]+'">\n';
		
		// Edge attributes
		data += '\t\t\t\t<attvalues>\n';
		data += '\t\t\t\t</attvalues>\n';

		data += '\t\t\t</edge>\n';
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

exports.generate = graphGenerator;