var config = require('config');
var colour = require('../GraphDataStructure/colour');

var black = new colour(0, 0, 0);
var blue = new colour(0, 0, 200);
var green = new colour(0, 150, 0);
var red = new colour(200, 0, 0);
var teal = new colour(0, 125, 125);
var cyan = new colour(0, 255, 255);
var purple = new colour(100, 0, 100);
var magenta = new colour(255, 0, 255);
var yellow = new colour(255, 255, 0);
var grey = new colour(155, 155, 155);
var orange = new colour(255, 100, 50);
var amber = new colour(255, 190, 0);
var pink = new colour(255, 200, 200);
var turquoise = new colour(65, 225, 210);
var brown = new colour(100, 50, 25);
var colours = [blue, green, red, cyan, magenta, yellow, orange, purple, teal, amber, pink, turquoise, grey, brown, black];
var x = 0;
var y = 0;
var group;
var node;

function colourizer(g) {
	var sections = g.group.length;
	var totalNodes = g.nodes.length;
	var nps = 0; // nodes per section
	for (var i = 0; i < sections; i++) {
		group = g.group[i];
		for (var j = 0; j < totalNodes; j++) {
			node = g.nodes[j];
			if (node.getAttr().value == group) {
				g.nodes[j].colour = colours[i];
				g.nodes[j].x = 10*i;
				g.nodes[j].y = 10*j;
			}
		}
	}
	return g;
}

exports.colourize = colourizer;