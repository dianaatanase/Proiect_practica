import React, { Component } from 'react';
import Row  from "../Row";

class Board extends Component {
constructor(props)
{
    super(props);
    this.state = 
    {
        rows: this.createBoard(props)
    }
}
  createBoard = props => {
      let board = [];
      for(let i =0; i<props.rows; i++)
      {
          board.push([]);

          for(let j=0; j<props.colums; j++)
          {
              board[i].push({
                  x: j,
                  y: i,
                  count: 0,
                  isOpen: false,
                  hasMine: false,
                  hasFlag: false
              });      
          }
      }

      for(let i =0; i<props.mines; i++)
      {
        let randomRow = Math.floor(Math.random()*props.rows)
        let randomColumn = Math.floor(Math.random()*props.colums);  

        let cell =board[randomRow][randomColumn];
        if(cell.hasMine)
        {
            i--;
        }
        else
        {
            cell.hasMine = true;
        }
      }
      return board;
      //console.table(board);
  }
  render(){
    let rows = this.state.rows.map((row, index) => {
        return(
            <Row 
            cells = {row}
            key =  {index}
            />
        )

    })
  return (
    <div className = "Board">
        {rows}
    </div>
  );
  }
}

export default Board;
