export function dijkstra(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (unvisitedNodes.length !== 0) {
        sortDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === endNode) return visitedNodesInOrder;
        updateUnvisited(closestNode, grid);
    }
  }
  
  function sortDistance(unvisited) {
    unvisited.sort((node1, node2) => node1.distance - node2.distance);
  }
  
  function updateUnvisited(closestnode, grid) {
    const unvisited = getUnvisitedNodes(closestnode, grid);
    for (const x of unvisited) {
        x.distance = closestnode.distance + 1;
        x.previousNode = closestnode;
    }
  }
  
  function getUnvisitedNodes(closestnode, grid) {
    const nodes = [];
    const {col, row} = closestnode;
    if (row > 0) nodes.push(grid[row - 1][col]);
    if (row < grid.length - 1) nodes.push(grid[row + 1][col]);
    if (col > 0) nodes.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) nodes.push(grid[row][col + 1]);
    return nodes.filter(neighbor => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
        nodes.push(node);
        }
    }
    return nodes;
  }
  
  // returns the nodes in the shortest path in reverse order
  export function finalthing(somenode) {
    const final = [];
    let currentNode = somenode;
    while (currentNode !== null) {
        final.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return final;
  }