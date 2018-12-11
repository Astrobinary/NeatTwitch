import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { uid } from "react-uid";
import SimpleStorage from "react-simple-storage";
import "babel-polyfill";
import "./videoplayer.scss";
import prevIcon from "./prev.svg";
import nextIcon from "./next.svg";

class videoplayersingle extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.log(this.props.location);
	}

	render() {
		return <section className="videoplayersingle">SINGLE</section>;
	}
}
export default videoplayersingle;
