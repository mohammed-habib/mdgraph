The gexf_generator is a program which generates a .gexf file based on a given graph data structure defined in another subdirectory within this repository. The generated .gexf file can then be used to visualize a graph (primarily used with filters.html in sigma.js).

*************FILES**************
The config folder has a json file that can be used to store variables that can be accessed by other nodejs files.

var config = require('config');
var variable = config.get('parent.child');

_________________________________
App.js is what we run to run the code, it currently has a filereader that uses csv files (edges.txt/nodes.txt) to generate nodes and edges into the data structure. This should NOT be the purpose of App.js but was incorporated to create dummy data.

App.js main purpose is to run the visualizer after receiving a graph data structure (g) to provide each node with a colour and position. Then it runs generator to create the .gexf file.
____________________________________
asd.gexf is the .gexf file generated from the dummy data
_____________________________________
edges.txt and nodes.txt are the dummy data csv files
The edges columns are as follows [source, target, id, label]
The nodes columns are as follows [id, label]
____________________________________
Gexfgen.js is the generator which reads the id, label, size, group, attribute, x/y position, and colour to generate each node. It then reads the id, source, target, and label to generate each edge. The meta data is taken from the config file
________________________________
Visualizer.js has a colourizer and positionizer to assign a colour a position to each node. The colour is based on the group of each node. The positionizer splits the graph into sections and the size of each section is determined by the nodes in that section (group)
__________________________________
package.json contains all the node modules require to run this app