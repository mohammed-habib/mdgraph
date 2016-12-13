var fs = require('fs');

// Metadata variables
var creator = 'Michael Zhang';
var date = 'yyyy-mm-dd';
var description = 'File creation based on Gephi 0.9 gexf file';

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
	data += '\t<meta lastmodifieddate="'+date+'">\n';
	data += '\t\t<creator>'+creator+'</creator>\n';
	data += '\t\t<description>'+description+'</description>\n';
	data += '\t</meta>\n';
	data += '\t<graph defaultedgetype="directed" mode="static">\n';
	
	// Start node creation
	data += '\t\t<nodes>\n';
	var n;
	
	for (var i = 0; i < graph.nodes.length; i++) {
		n = g.nodes[i];
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