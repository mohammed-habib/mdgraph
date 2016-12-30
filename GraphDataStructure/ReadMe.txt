Nodes should be generated with the following values
(follow the example for generation, but follow these guidelines for values)

graph.add.node(id, name(fileName), size, namespace, new attribute('acategory', namespace));

Group is the same as attribute value (this is for categorizing in sigmajs side)
'acategory' is sigmajs keyword for grouping selection [this can be changed in the .html file]
all nodes should have the same size

Edges should be the following

graph.add.edge(id, sourcenodename, targetnodename, label)
OR
graph.add.edgebyId(id, sourcenodeid, targetnodeid, label)