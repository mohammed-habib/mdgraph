'use strict';
class node {
    constructor(id, name, x, y, size, colour, group, attr) {
		this.id = id;
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
		this.colour = colour;
		this.group = group;
		this.attr = attr;
	}
    
    getAttr() {
		return this.attr;
	}
	
	getColour() {
		return this.colour;
	}
}



function includes(container, value) {
	var returnValue = false;
	var pos = container.indexOf(value);
	if (pos >= 0) {
		returnValue = true;
	}
	return returnValue;
}

function digraph () {
    var graph = {
        nodes: [],
        edges: [],
        group: []
    };

     
    function addNode (id, name, x, y, size, colour, group, attr) {
        var n = ((typeof name === 'undefined') ? {} : new node(id, name, x, y, size, colour, group, attr));
        graph.nodes.push(n);
        if (!includes(graph.group, group)) {graph.group.push(group);}
        return n;
    }

    //u,v are the names of nodes, o is the label for u -> v
    function addEdge (edgeid, u, v, o) {
        if (indexOfNode(u) != -1 && indexOfNode(v) != -1) {
        var e = [edgeid, u, v, ((typeof o === 'undefined') ? {} : o)];
        graph.edges.push(e);
        return e;
        }
        else {
        console.log('illegal input, one or more nodes do not exist');    
        }
    }
	
	//function is same as above except u,v are node ids instead of names
	function addEdgebyId (edgeid, u, v, o) {
		var uname;
		var vname;
		for (var i = 0; i < graph.nodes.length; i++) {
			if (graph.nodes[i].id == u) {
				uname = graph.nodes[i].name;
			}
			else if (graph.nodes[i].id == v) {
				vname = graph.nodes[i].name;
			}
		}
		if (uname != undefined && vname != undefined) {
        var e = [edgeid, uname, vname, ((typeof o === 'undefined') ? {} : o)];
        graph.edges.push(e);
        return e;
		}
		else {
			console.log('illegal input, one or more nodes do not exist');
		}
	}

    function getEdges () { return graph.edges; }

    function getNodes () { return graph.nodes; }

    function getOutEdges (n) {
        return graph.edges.reduce(function (res, e) {
            if (e[1] === n) { res.push(e); }
            return res;
        }, []);
    }
    
    function getInEdges (n) {
        return graph.edges.reduce(function (res, e) {
            if (e[2] === n) { res.push(e); }
            return res;
        }, []);
    }

    

    //parameter node is the name of the node
    function indexOfNode (node) {
        var index;
        return graph.nodes.some(function (n, i) {
            if (n.name === node) {
                index = i;
                return true;
            }
        }) ? index : -1;
    }
	
	function idOfNode (node) {
		var id;
        return graph.nodes.some(function (n, i) {
            if (n.name === node) {
                id = n.id;
                return true;
            }
        }) ? id : -1;
    }
    
    function getAttribute(node) {
        var index = indexOfNode(node);
        return graph.nodes[index].getAttr();
    }
	
	function getColour(node) {
        var index = indexOfNode(node);
        return graph.nodes[index].getColour();
    }

    function exportObj () {
        var edges = graph.edges.map(function (e) {
            return [e[0], idOfNode(e[1]), idOfNode(e[2]), e[3]];
        });
        return {
            nodes: graph.nodes,
            edges: edges,
            group: graph.group
        };
    }

    function exportDot () {
        var res = 'digraph {\n';
        graph.group.forEach(function(a,b){
            res += '  subgraph cluster'+a+' {\n';
        graph.nodes.filter(function(value) {
            return value.group == a;
        }).forEach(function (n, i) {
            var keys = Object.keys(n);
            if (keys.length === 0) {
                return;
            }
            res += '	' + indexOfNode(n.name) + ' [';
            res += keys.map(function (key) {
                
                return key + ' = ' + n[key];
                
            }).join(', ');
            res += ']\n';
        });
            res += ' }\n';
        });
        
        graph.edges.forEach(function (e) {
            res += '	'
                + ((typeof e[1].id === 'string') ? e[1].id : ('' + indexOfNode(e[1])))
                + ' -> '
                + ((typeof e[2].id === 'string') ? e[2].id : ('' + indexOfNode(e[2])));
            res += ' '+((typeof e[3] === 'string') ? '[label = '+e[3]+']' : '')
                + '\n';
        });
        res += '}\n';
        return res;
    }

    return {
        add: {
            node: addNode,
            edge: addEdge,
			edgebyId: addEdgebyId
        },
        get: {
            nodes: getNodes,
            edges: getEdges,
            in: {
                edges: getInEdges
            },
            out: {
                edges: getOutEdges
            }
        },
        export: {
            obj: exportObj,
            dot: exportDot
        },
        indexof : indexOfNode,
        getAttr : getAttribute,
		getColour : getColour
    };
}

module.exports = digraph;