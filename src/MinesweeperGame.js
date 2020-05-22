import React, { Component } from 'react';
import Board from "./components/Board";

class MinesweeperGame extends Component {
  state =
{ rows:10,
  colums:10,
  flags:10, 
  mines:10
}
  render(){
  return (
    <div className="minesweeper">
     <Board 
     rows= {this.state.rows}
     colums = {this.state.colums}
     mines = {this.state.mines}
     />

    </div>
  );
  }
}

export default MinesweeperGame;
