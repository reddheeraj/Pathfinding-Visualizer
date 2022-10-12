function randomMaze(grid, start, end) {
    if (!start || !end || start === end) return false;
    let walls = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
           if (
            (row === start.row && col === start.col) ||
            (row === end.row && col === end.col)
           ) {
            continue;
           }
           if (Math.random() < 0.33) {
            walls.push([row,col]);
           }
        }
    }
    walls.sort(() => Math.random() - 0.5);
    return walls;
}

export default randomMaze