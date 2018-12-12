import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./backto.scss";

import backToIcon from "./backto.svg";

class backto extends Component {
	render() {
		return (
			<div className={"back-to"}>
				<Link to={`/${this.props.url || "feed"}`}>
					<img src={backToIcon} alt="backIcon" />
					Back to <b>{this.props.back}</b>
				</Link>
			</div>
		);
	}
}
export default backto;
