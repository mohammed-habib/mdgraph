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
	for (var i = 0; i < g.group.length; i++) {
		group = g.group[i];
		for (var j = 0; j < g.nodes.length; j++) {
			node = g.nodes[j];
			if (node.getAttr().value == group) {
				g.nodes[j].colour = colours[i];
			}
		}
	}
	return g;
}

function positionizer(g, section, sectionStart, sectionEnd) {
	var x = sectionStart;
	var y = 0;
	for (var i = 0; i < g.nodes.length; i++) {
		if (x > sectionEnd) {
			x = sectionStart;
			y += 10;
		}
		if (g.nodes[i].getAttr().value == section) {
			g.nodes[i].x = x;
			g.nodes[i].y = y;
			x += 10;
		}
	}
	return g;
}

function visualizer(g) {
	var sections = g.group.length;
	var section;
	var sectionStart = 0;
	var sectionEnd = 0;
	var nps = 0; // nodes per section
	g = colourizer(g);
	for (var i = 0; i < sections; i++) {
		section = g.group[i];
		for (var j = 0; j < g.nodes.length; j++) {
			if (g.nodes[j].getAttr().value == section) {
				nps++;
			}
		}
		sectionEnd = sectionEnd + Math.sqrt(nps)*10;
		console.log("SectionStart = "+sectionStart+"\nSectionEnd = "+sectionEnd);
		g = positionizer(g, section, sectionStart, sectionEnd);
		sectionStart = sectionEnd + 5;
		nps = 0;
	}
	return g;
}
exports.visuals = visualizer;