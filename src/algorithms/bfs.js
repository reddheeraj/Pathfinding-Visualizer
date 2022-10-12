export function bfs(grid, startNode, endNode) {
    if (!startNode || !endNode || startNode === endNode) {
        return false;
    }
    const visitedNodesInOrder = [];
    let unvisitedNodes = [];
    unvisitedNodes.push(startNode);
    while (unvisitedNodes.length !== 0) {
        let closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        // if (closestNode.isVisited) continue;
        if (closestNode === endNode) return visitedNodesInOrder;
        visitedNodesInOrder.push(closestNode);
        closestNode.isVisited = true;
        let unvisitedNNeighbors = getUnvisitedNeighbors(closestNode, grid);
        for (let x of unvisitedNNeighbors) {
            x.previousNode = closestNode; //to help with animating final path
            if (neighbourNotinUnvisited(x, unvisitedNodes)) {
                unvisitedNodes.push(x);
            }
        }
    }
    return visitedNodesInOrder;
}

function neighbourNotinUnvisited(node, unvisitedNodes) {
    for (let x of unvisitedNodes) {
        if (x.row === node.row && x.col === node.col) return false;
    }
    return true;
}

function getUnvisitedNeighbors(closestNode, grid) {
    let neighbours = [];
    let {col, row} = closestNode;
    if (row !== 0) neighbours.push(grid[row - 1][col]);
    if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col !== 0) neighbours.push(grid[row][col - 1]);
    return neighbours.filter((neighbour) => !neighbour.isVisited);
}

export function finalthingbfs(somenode) {
    const final = [];
    let currentNode = somenode;
    while (currentNode !== null) {
        final.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return final;
}