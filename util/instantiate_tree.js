var util = require('util');

var filename = process.argv[2];
if (!filename) {
    console.log("node util/instantiate_tree.js FILENAME");
    return;
}

// Create a unique instance of a node in the output pool
var instantiateNode = function(id, parentList, nodeTree, outputPool) {
    var node = nodeTree[id];

    // Find an available instance # for this node
    var instanceNum = 1;
    while (outputPool[[id, instanceNum]] !== undefined) {
        instanceNum += 1;
    }

    // Create the new instance
    outputPool[[id, instanceNum]] = {
        id: id,
        instNum: instanceNum,
        node: node,
        nodeType: node.type,
        parentInst: parentList[parentList.length - 1],
        nextNodes: {},
    };

    // Recurse with each of the next nodes, creating a unique instance for
    // each one
    var nextNodes = node.getNextNodes(id, parentList);
    for (var nextSelector in nextNodes) {
        if (nextNodes.hasOwnProperty(nextSelector)) {
            var nextNodeId = nextNodes[nextSelector];

            var newParentList = parentList.slice();
            newParentList.push([id, instanceNum])

            var nextInstanceId = instantiateNode(
                nextNodeId, newParentList, nodeTree, outputPool);

            outputPool[[id, instanceNum]].nextNodes[nextSelector] = (
                    nextInstanceId);
        }
    }

    return [id, instanceNum];
};

// Create unique instances for the entire tree of nodes, starting at
// the START node and traversing down
var instantiateTree = function(nodeTree) {
    var outputPool = {};
    instantiateNode("START", [], nodeTree, outputPool);
    return outputPool;
};

var gameTree = require(filename);
var instantiatedTree = instantiateTree(gameTree);

console.log("module.exports = ");
console.log(util.inspect(instantiatedTree, {showHidden: false, depth: null}));
console.log(";");
