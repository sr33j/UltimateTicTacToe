import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from "jquery";

function Cell(props){
  var classStr = "cell cell-"+props.i+'-'+props.j;
  return (
    <button className={classStr} onClick={() => props.handleClick(props.i,props.j)}>
      {props.value}
    </button>
  );
}

class Square extends React.Component {

  renderCell(j) {
    return (
      <Cell value={this.props.value[j]}
            i={this.props.whichSquare}
            j={j}
            handleClick={this.props.handleClick.bind(this)}/>
    );
  }
  render() {
    var classStr = "square square-"+this.props.whichSquare;
    return (
      <div className={classStr}>
        <div className="square-row">
          {this.renderCell(0)}
          {this.renderCell(1)}
          {this.renderCell(2)}
        </div>
        <div className="square-row">
          {this.renderCell(3)}
          {this.renderCell(4)}
          {this.renderCell(5)}
        </div>
        <div className="square-row">
          {this.renderCell(6)}
          {this.renderCell(7)}
          {this.renderCell(8)}
        </div>
      </div>
    );
  }
}


class Board extends React.Component {
  constructor(props) {
    super(props);
    var winSquareX = Array(9).fill(null);
    var cell;
    for (cell = 0; cell < 9; cell++) {
      if (cell%2===0) {
        winSquareX[cell] = 'X';
      }
    }

    var winSquareO = Array(9).fill(null);
    for (cell = 0; cell < 9; cell++) {
      if (cell !== 4) {
        winSquareO[cell] = 'O';
      }
    }

    this.state = {
      squares: Array(9).fill(Array(9).fill(null)),
      winSquareO: winSquareO,
      winSquareX: winSquareX,
      xIsNext: true,
      prevJ: -1,
    };
  }

  handleClick(i, j) {
    var squares = this.state.squares.map(function(arr) {
        return arr.slice();
    });
    if (this.state.prevJ !== i && this.state.prevJ !== -1 && canMove(squares[this.state.prevJ])) {
      return;
    }
    if (calculateWinner(squares) || typeof squares[i] === 'string' || squares[i][j]) {
      return;
    }
    if (this.state.prevJ !== -1 ) {
      $('.square-'+this.state.prevJ)[0].style.background = "";
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares[i]);
    if (winner) {
      squares[i] = winner;
    }
    if (canMove(squares[j])) {
      $('.square-'+j)[0].style.background = 'rgba(200, 54, 54, 0.5)';
    }
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      prevJ: j,
    });
  }


  renderSquare(i) {
    if (typeof this.state.squares[i] === 'string') {
      var winSquare;
      if (this.state.squares[i] === 'X' ) {
        winSquare = this.state.winSquareX;
      }
      else {
        winSquare = this.state.winSquareO;
      }
      return (
        <Square value={winSquare}
              whichSquare={i} 
              handleClick={this.handleClick.bind(this)}/>
      );
    }
    else {
      return (
        <Square value={this.state.squares[i]} 
                whichSquare={i} 
                handleClick={this.handleClick.bind(this)}/>
      );
    }
  }

  render() {
    var winner = calculateWinner(this.state.squares);
    var status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else if (!canMove(this.state.squares)) {
      status = "Tie Game"
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <React.Fragment>
        {status}
        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

function canMove(arr) {
  console.log(arr);
  if (Array.isArray(arr)) {
    for (var i = 0; i < 9; i++) {
      if (canMove(arr[i])) {
        return true;
      }
    }
    return false;
  }
  else {
    if (arr === null) {
      return true;
    }
    else {
      return false;
    }
  }
}

function calculateWinner(arr) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (typeof arr[a] === 'string' && arr[a] === arr[b] && arr[a] === arr[c]) {
      return arr[a];
    }
  }
  return null;
}