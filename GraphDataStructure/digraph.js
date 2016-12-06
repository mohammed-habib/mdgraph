'use strict';
class node {
    constructor(name, group, atr) {
    this.name = name;
    this.group = group;
    this.atr = atr;
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

    function addNode (name, group, atr) {
        var n = ((typeof name === 'undefined') ? {} : new node(name, group, atr));
        graph.nodes.push(n);
        if (!includes(graph.group, group)) {graph.group.push(group);}
        return n;
    }

    //u,v are the names of nodes, o is the lable for u -> v
    function addEdge (u, v, o) {
        if (indexOfNode(u) != -1 && indexOfNode(v) != -1) {
        var e = [u, v, ((typeof o === 'undefined') ? {} : o)];
        graph.edges.push(e);
        return e;
        }
        else {
        console.log('illegal input, node not created');    
        }
    }

    function getEdges () { return graph.edges; }

    function getNodes () { return graph.nodes; }

    function getOutEdges (n) {
        return graph.edges.reduce(function (res, e) {
            if (e[0] === n) { res.push(e); }
            return res;
        }, []);
    }
    
    function getInEdges (n) {
        return graph.edges.reduce(function (res, e) {
            if (e[1] === n) { res.push(e); }
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

    function exportObj () {
        var edges = graph.edges.map(function (e) {
            return [indexOfNode(e[0]), indexOfNode(e[1]), e[2]];
        });
        return {
            nodes: graph.nodes,
            edges: edges
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
                
                return 'label' + ' = ' + n[key];
                
            }).join(', ');
            res += ']\n';
        });
            res += ' }\n';
        });
        
        graph.edges.forEach(function (e) {
            res += '	'
                + ((typeof e[0].id === 'string') ? e[0].id : ('' + indexOfNode(e[0])))
                + ' -> '
                + ((typeof e[1].id === 'string') ? e[1].id : ('' + indexOfNode(e[1])));
            res += ' '+((typeof e[2] === 'string') ? '[label = '+e[2]+']' : '')
                + '\n';
        });
        res += '}\n';
        return res;
    }

    return {
        add: {
            node: addNode,
            edge: addEdge
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
        indexof : indexOfNode
    };
}

module.exports = digraph;