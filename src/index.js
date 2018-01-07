import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Cell(props){
  return (
    <button className="cell" onClick={() => props.handleClick(props.i,props.j)}>
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
    return (
      <div className="square">
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
    };
  }

  handleClick(i, j) {
    var squares = this.state.squares.map(function(arr) {
        return arr.slice();
    });
    if (calculateWinner(squares) || typeof squares[i] === 'string' || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares[i]);
    if (winner) {
      squares[i] = winner;
    }
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
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
      // console.log(this.state.squares[i]);
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
    else if (tie(this.state.squares)) {
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

function tie(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].constructor === Array) {
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === null) {
          return false;
        }
      }
    }
  }
  return true;
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