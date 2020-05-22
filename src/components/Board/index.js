import React, { Component } from "react";
import Row from "../Row";

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: this.createBoard(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.openCells > nextProps.openCells ||
      this.props.columns !== nextProps.columns
    ) {
      this.setState({
        rows: this.createBoard(nextProps)
      });
    }
  }

  createBoard = props => {
       // cream o structura tabelara in fucntie de numarul de linii si coloane date de props
    let board = [];
    for (let i = 0; i < props.rows; i++) {
      board.push([]);
      for (let j = 0; j < props.columns; j++) {
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
      // selectam aleator niste pozitii unde sa apara mine
    for (let i = 0; i < props.mines; i++) {
      let randomRow = Math.floor(Math.random() * props.rows);
      let randomCol = Math.floor(Math.random() * props.columns);

      let cell = board[randomRow][randomCol];

      if (cell.hasMine) {
       // daca avem o mina in celula respectiva, decrementam i si cautam, in aceeasi etapa a buclei, o celula libera
        // altfel s-ar pune pe tabla cu o mina mai putin, pentru ca in aceeasi celula nu se pot pune 2 mine
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    return board;
  };

  // cream o functie pentru a porni/opri flag-urile
  flag = cell => {
    if (this.props.status === "ended") {
      return;
    }
    let rows = this.state.rows;

    cell.hasFlag = !cell.hasFlag;
    this.setState({ rows });
    this.props.changeFlagAmount(cell.hasFlag ? -1 : 1);
  };

  open = cell => {
    if (this.props.status === "ended") {
      return;
    }
     // va trebui sa calculam numarul minelor din jurul celulei, altfel nu respecta logica jocului
    let asyncCountMines = new Promise(resolve => {
      let mines = this.findMines(cell);
      resolve(mines);
    });

    asyncCountMines.then(numberOfMines => {
      let rows = this.state.rows;

      let current = rows[cell.y][cell.x];

      if (current.hasMine && this.props.openCells === 0) {
        console.log("mine was on first click");
        let newRows = this.createBoard(this.props);
        this.setState({ rows: newRows }, () => {
          this.open(cell);
        });
      } else {
        if (!cell.hasFlag && !current.isOpen) {
          this.props.onCellClick();

          current.isOpen = true;
          current.count = numberOfMines;

          this.setState({ rows });
         // daca stim ca celula nu contine nici flag si nici mina, atunci incercam sa deschidem celule din jurul ei in continuare
          if (!current.hasMine && numberOfMines === 0) {
            this.openAroundCell(cell);
          }

          if (current.hasMine && this.props.openCells !== 0) {
            this.props.endGame();
          }
        }
      }
    });
  };

  findMines = cell => {
    let minesInProximity = 0;
       // cautam in blocul celulelor vecine daca exista mine
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length
          ) {
            if (
              this.state.rows[cell.y + row][cell.x + col].hasMine &&
              !(row === 0 && col === 0)
            ) {
              minesInProximity++;
            }
          }
        }
      }
    }
    return minesInProximity;
  };

  openAroundCell = cell => {
    let rows = this.state.rows;

     // parcurgem celula cu celula pana cand gasim o mina
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length
          ) {
            if (
              !this.state.rows[cell.y + row][cell.x + col].hasMine &&
              !rows[cell.y + row][cell.x + col].isOpen
            ) {
              this.open(rows[cell.y + row][cell.x + col]);
            }
          }
        }
      }
    }
  };

  render() {
    let rows = this.state.rows.map((cells, index) => (
      <Row
        cells={cells}
        open={this.open}
        flag={this.flag}
        key={index}
      />
    ));
    return <div className="board">{rows}</div>;
  }
}

export default Board;