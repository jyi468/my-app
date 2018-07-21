import React from 'react';
import ReactDOM from 'react-dom'
import './index.css'

/**
 * Square component. When<
 */
// Make square a functional component. Implicitly only contains a render method
function Square(props) {
    // Only the <button> onClick will call the call back function
    // If you return template/JSX with onClick, it pass in the value to whatever component you are referencing
    // in a functional component, you can simply pass the function into onClick and not call it explicitly
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
/*class Square extends React.Component {
    // props is data fed into the component
    // If you are not keeping track of the state, you might not need a constructor
    /!*constructor(props) {
        // Use super to define constructor of subclass
        // All user created react components are subclasses of React.Component
        super(props);
        this.state = {
            value: null,
        };
    }*!/

    render() {
        // onClick is from the react, where you can bind a function onClick
        return (
            // the onClick here is calling the parent component's onClick
            <button className="square"
                    onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}*/

class Board extends React.Component {
    renderSquare(i) {
        // we are passing in onClick as a prop to square
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
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
        );
    }
}

function calculateWinner(squares) {
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        // We will hold the state from the Game down to the Board component
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        };
    }

    // Handle click is on the top game level instead of the squares level
    handleClick(i) {
        const history = this.state.history;
        // history[0] returns default value
        const current = history[history.length - 1];
        // return shallow copy - don't want to directly edit squares yet
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'O' : 'X';
        this.setState({
            // Use concat instead of push because it doesn't mutate the original array
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
