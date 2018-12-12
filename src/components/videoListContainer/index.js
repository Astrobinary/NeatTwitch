import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchStreamVideos, fetchGameVideos } from "../../redux/actions";
import SimpleStorage from "react-simple-storage";
import VideoListItem from "./videoListItem";
import Backto from "../backto";

import optionIcon from "./options.svg";
import loadIcon from "./Preloader_5.gif";

import "./videolist.scss";
class videoListContainer extends Component {
	constructor(props) {
		super(props);

		let current = JSON.parse(localStorage.getItem("_currentSelection"));
		if (current === undefined || current === null) {
			current = "week";
		} else {
			current = JSON.parse(localStorage.getItem("_currentSelection"));
		}

		let split = this.props.location.pathname.split("/");
		let back = split[1];
		let name = split[2];
		let backURL = split.splice(1, split.length - 2);
		backURL = backURL.join("/");

		this.state = {
			showMenu: false,
			currentSelection: current,
			back,
			backURL,
			name
		};
	}

	componentWillMount() {
		if (this.props.match.params.streamerID) {
			if (this.props.videos === undefined) this.props.fetchStreamVideos(this.props.match.params.streamerID, this.state.currentSelection);
		}

		if (this.props.match.params.gameID) {
			if (this.props.videos === undefined) this.props.fetchGameVideos(this.props.match.params.gameID, this.state.currentSelection);
		}
	}

	toggleMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	};

	updateMenu = time => {
		this.setState({ showMenu: false, currentSelection: time });

		if (this.props.match.params.streamerID) {
			if (this.props.videos[time] === undefined) this.props.fetchStreamVideos(this.props.match.params.streamerID, time);
		}

		if (this.props.match.params.gameID) {
			if (this.props.videos[time] === undefined) this.props.fetchGameVideos(this.props.match.params.gameID, time, "game");
		}
	};

	getClips = () => {
		return this.props.videos[this.state.currentSelection].map((x, index, arr) => (
			<Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
				<VideoListItem video={x} />
			</Link>
		));
	};

	render() {
		const loadGif = <img src={loadIcon} alt="load icon" />;
		console.log(this.props);
		let clips;
		if (this.props.videos !== undefined) {
			if (this.props.videos[this.state.currentSelection] !== undefined) {
				clips = this.getClips();
			} else {
				clips = <div>No clips found this {this.state.currentSelection}</div>;
			}
		} else {
			clips = <div>Something went wrong...?</div>;
		}

		return (
			<section>
				<SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name"]} />

				<div className="top-bar">
					<Backto url={this.state.backURL} back={this.state.back} />
					<div className="videolist-options">
						<img src={optionIcon} alt="options" />
						<span>SORT TOP CLIPS BY</span>
						<span className="options-choice" onClick={this.toggleMenu}>
							{this.state.currentSelection}
						</span>
						{this.state.showMenu ? (
							<div className="time-menu">
								<div onClick={() => this.updateMenu("day")}>Day</div>
								<div onClick={() => this.updateMenu("week")}>Week</div>
								<div onClick={() => this.updateMenu("month")}>Month</div>
								<div onClick={() => this.updateMenu("all")}>All</div>
							</div>
						) : null}
					</div>
				</div>

				<section className="clips-container">{this.props.loading ? loadGif : clips}</section>
			</section>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let key = Object.keys(ownProps.match.params)[0];
	let reducer = "";
	if (ownProps.match.params.streamerID) reducer = "streamersReducer";
	if (ownProps.match.params.gameID) reducer = "gamesReducer";

	return {
		videos: state[reducer][ownProps.match.params[key]],
		loading: state[reducer].loading,
		error: state[reducer].error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchStreamVideos: (id, time) => dispatch(fetchStreamVideos(id, time)),
		fetchGameVideos: (id, time) => dispatch(fetchGameVideos(id, time))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(videoListContainer);
