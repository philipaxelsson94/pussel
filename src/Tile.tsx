import React from "react";
import "./Tile.css";

interface TileProps {
	value: number | null;
	onClick: () => void;
}

function Tile({ value, onClick }: TileProps) {
	const isEmpty = value === null;

	return (
		<div
			onClick={isEmpty ? undefined : onClick}
			className={`tile ${isEmpty ? "empty" : "filled"}`}
		>
			{value}
		</div>
	);
}

export default Tile;
