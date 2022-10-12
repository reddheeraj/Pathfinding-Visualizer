import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, finalthing} from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';
import Navbar from '../components/Navbar';
import randomMaze from '../algorithms/randomMaze';
import { verticalMaze } from '../algorithms/VerticalMaze';
import { bfs, finalthingbfs } from '../algorithms/bfs';

const getRandomStartRow = () => {
  const row = Math.floor(Math.random() * 20);
  //console.log(row, col);
  return row;
}

const getRandomStartCol = () => {
  const col = Math.floor(Math.random() * 60);
  //console.log(col);
  return col;
}

const getRandomFinishRow = () => {
  while (true) {
    const row = Math.floor(Math.random() * 20);
    if (row !== START_NODE_ROW) {
      //console.log(row);
      return row;
    }
  }
}

const getRandomFinishCol = () => {
  while(true) {
    const col = Math.floor(Math.random() * 60);
    if (col !== START_NODE_COL) {
      //console.log(col);
      return col;
    }
  }
}

let START_NODE_ROW = getRandomStartRow();
let START_NODE_COL = getRandomStartCol();
let FINISH_NODE_ROW = getRandomFinishRow();
let FINISH_NODE_COL = getRandomFinishCol();

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mousePressed: false,
      visualizingAlgorithm: false,
      generatingMaze: false,
    };
  }

  handleMouseDown(row, col) {
    const newGrid = getGridWithWallToggled(this.state.grid, row, col);
    this.setState({
        grid: newGrid,
        mousePressed: true,
    });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mousePressed) return;
    const newGrid = getGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mousePressed: false});
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  clearGrid() {
    if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
    for (let row = 0; row < this.state.grid.length; row++) {
      for (let col = 0; col < this.state.grid[0].length; col++) {
        if (!(
          (row === START_NODE_ROW && col === START_NODE_COL) ||
          (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
        ))
        document.getElementById(`node-${row}-${col}`).className = 'node';
        if (document.getElementById(`node-${row}-${col}`).className === 'node node-shortest-path') {
          document.getElementById(`node-${row}-${col}`).className = 'node';
        }

        if ((row === START_NODE_ROW && col === START_NODE_COL)) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
          document.getElementById(`node-${row}-${col}`).style.backgroundColor = 'green';
        }
        if ((row === FINISH_NODE_ROW && col === FINISH_NODE_COL)) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
          document.getElementById(`node-${row}-${col}`).style.backgroundColor = 'red';
        }
      }
    }
    const newGrid = getInitialGrid();
    this.setState({
      grid: newGrid,
      visualizingAlgorithm: false,
      generatingMaze: false,
    });
  }

  animateBFS(visitedNodes, final) {
    let defGrid = this.state.grid.slice();
    for (let row of defGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
        };
        defGrid[node.row][node.col] = newNode;
      }
    }
    this.setState({
      grid: defGrid,
    });
    for (let i = 1; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animatefinalpath(final);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateDijkstra(visitedNodes, final) {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animatefinalpath(final);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animatefinalpath(final) {
    for (let i = 0; i < final.length; i++) {
      setTimeout(() => {
        const node = final[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
    this.setState({
      visualizingAlgorithm: false,
    });
  }

  visualizeDijkstra() {
    if (this.state.generatingMaze || this.state.visualizingAlgorithm) return;
    this.setState({
      visualizingAlgorithm: true,
    });
    const {grid} = this.state;
    const start = grid[START_NODE_ROW][START_NODE_COL];
    const end = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodes = dijkstra(grid, start, end);
    const final = finalthing(end);
    this.animateDijkstra(visitedNodes, final);
  }

  visualizeBFS() {
    if (this.state.generatingMaze || this.state.visualizingAlgorithm) return;
    this.setState({
      visualizingAlgorithm: true,
    });
    const {grid} = this.state;
    const start = grid[START_NODE_ROW][START_NODE_COL];
    const end = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodes = bfs(grid, start, end);
    const final = finalthingbfs(end);
    this.animateBFS(visitedNodes, final);
  }

  animateMaze(walls) {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          this.clearGrid();
          let newGrid = getNewGridWithMaze(this.state.grid, walls);
          this.setState({ grid: newGrid, generatingMaze: false });
        }, i * 10);
        return;
      }
      let wall = walls[i];
      let node = this.state.grid[wall[0]][wall[1]];
      setTimeout(() => {        
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall-animated";
      }, i * 10);
    }
  }

  generateRandomMaze() {
    if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
    this.clearGrid();
    this.setState({
      generatingMaze: true,
    });
    const {grid} = this.state;
    const start = grid[START_NODE_ROW][START_NODE_COL];
    const end = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const walls = randomMaze(grid, start, end);
    this.animateMaze(walls);
  }

  gernerateVerticalMaze() {
    if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
    this.clearGrid();
    this.setState({
      generatingMaze: true,
    });
    const {grid} = this.state;
    const start = grid[START_NODE_ROW][START_NODE_COL];
    const end = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const walls = verticalMaze(grid, start, end);
    this.animateMaze(walls);
  }

  render() {
    const { grid, mousePressed } = this.state;

    return (
      <>
        <Navbar />
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeBFS()}>Visualize BFS</button>
        <button id='clear' onClick={() =>  
        this.clearGrid()
        }>Clear Grid</button>
        <button id ='maze' onClick={() => this.generateRandomMaze()}>
          Generate Random Maze
        </button>
        <button id='maze' onClick={() => this.gernerateVerticalMaze()}>
          Generate Vertical Maze
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        row={row}
                        mouseIsPressed={mousePressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col) 
                        }
                        onMouseUp={() => this.handleMouseUp()}
                      ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 60; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};