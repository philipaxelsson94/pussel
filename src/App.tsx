import "./App.css";
import React, { useEffect, useState, useCallback } from "react";
import Tile from "./Tile";

function App() {
	const ROWS = 3;
	const COLS = 5;

	type Board = (number | null)[][];

	const [board, setBoard] = useState<Board>([]);
	const [solved, setSolved] = useState(false);

	const initBoard = useCallback(() => {
		const numbers: (number | null)[] = [];

		for (let i = 1; i < ROWS * COLS; i++) {
			const j = Math.floor(Math.random() * (numbers.length + 1));
			numbers.splice(j, 0, i); // insert number i at random index j
		}

		numbers.push(null);
		const newBoard: Board = [];
		for (let r = 0; r < ROWS; r++) {
			newBoard.push(numbers.slice(r * COLS, (r + 1) * COLS));
		}
		return newBoard;
	}, [ROWS, COLS]);

	const checkIfSolved = useCallback(() => {
		const flatBoard = board.flat();
		const correct: (number | null)[] = [
			...Array.from({ length: ROWS * COLS - 1 }, (_, i) => i + 1),
			null,
		];
		if (JSON.stringify(flatBoard) === JSON.stringify(correct)) {
			setSolved(true);
		}
	}, [board]);

	useEffect(() => {
		setBoard(initBoard());
	}, [initBoard]);

	useEffect(() => {
		checkIfSolved();
	}, [checkIfSolved]);

	// This function finds the position of the empty tile (null) in the board.
	const findEmpty = (): [number, number] => {
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				if (board[r][c] === null) return [r, c];
			}
		}
		return [-1, -1];
	};

	// This function handles the logic of moving tiles. It checks if the clicked tile
	// is in the same row or column as the empty space and shifts the tiles accordingly.
	const handleClick = (row: number, col: number) => {
		const [er, ec] = findEmpty();

		if (row === er && col !== ec) {
			const newBoard = board.map((r) => [...r]);
			if (col < ec) {
				for (let c = ec; c > col; c--) {
					newBoard[er][c] = newBoard[er][c - 1];
				}
			} else {
				for (let c = ec; c < col; c++) {
					newBoard[er][c] = newBoard[er][c + 1];
				}
			}
			newBoard[er][col] = null;
			setBoard(newBoard);
		}

		if (col === ec && row !== er) {
			const newBoard = board.map((r) => [...r]);
			if (row < er) {
				for (let r = er; r > row; r--) {
					newBoard[r][ec] = newBoard[r - 1][ec];
				}
			} else {
				for (let r = er; r < row; r++) {
					newBoard[r][ec] = newBoard[r + 1][ec];
				}
			}
			newBoard[row][ec] = null;
			setBoard(newBoard);
		}
	};
	// This function reshuffles the board by setting a new
	// randomized board and resets the solved state.
	const reshuffle = () => {
		setBoard(initBoard());
		setSolved(false);
	};

	// This checks if the board is in a solved state by comparing the current board
	// to the correct sequence of numbers.

	return (
		<div className="board-container">
			<div className="board-grid">
				{board.map((row, r) =>
					row.map((value, c) => (
						<Tile
							key={`${r}-${c}`}
							value={value}
							onClick={() => handleClick(r, c)}
						/>
					))
				)}
			</div>

			<button onClick={reshuffle} className="shuffle-button">
				Slumpa
			</button>
			{solved && (
				<p className="board-solved-text">Grattis, du löste pusslet!</p>
			)}
		</div>
	);
}

export default App;
