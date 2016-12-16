var config = require('config');
var colour = require('../GraphDataStructure/colour');

var groups = config.get('colour.groups');
var black = new colour(0, 0, 0);
var blue = new colour(0, 0, 200);
var green = new colour(0, 150, 0);
var red = new colour(200, 0, 0);
var teal = new colour(0, 150, 150);
var aqua = new colour(0, 255, 255);
var purple = new colour(100, 0, 100);
var magenta = new colour(255, 0, 255);
var yellow = new colour(255, 255, 0);
var grey = new colour(155, 155, 155);
var colours = [black, blue, green, red, teal, aqua, purple, magenta, yellow, grey];
var x = 0;
var y = 0;
var group;
var node;


function colourizer(g) {
	for (var i = 0; i < groups.length; i++) {
		group = groups[i];
		for (var j = 0; j < g.nodes.length; j++) {
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