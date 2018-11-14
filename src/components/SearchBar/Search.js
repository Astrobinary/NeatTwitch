import React from "react";
import "./search.css";
import searchIcon from "./search.svg";

const Search = props => (
	<div className="Search">
		<img src={searchIcon} alt={"logo"} />
		<input placeholder={props.holder} />
	</div>
);

export default Search;
