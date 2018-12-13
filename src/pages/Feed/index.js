import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchFeedVideos } from "../../redux/actions";
import SimpleStorage from "react-simple-storage";
import VideoListItem from "../../components/videoListContainer/videoListItem";

import optionIcon from "./options.svg";
import loadIcon from "./Preloader_5.gif";

import "./feed.scss";
class Feed extends Component {
	constructor(props) {
		super(props);

		let current = JSON.parse(localStorage.getItem("_currentSelection"));
		if (current === undefined || current === null) {
			current = "day";
		} else {
			current = JSON.parse(localStorage.getItem("_currentSelection"));
		}

		this.state = {
			showMenu: false,
			currentSelection: current
		};
	}

	componentWillMount() {
		console.log(this.props.clips);
		this.props.fetchFeedVideos(this.state.currentSelection);
		if (this.props.clips.length < 1) {
			console.log(this.props.clips);
		}
	}

	toggleMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	};

	updateMenu = time => {
		this.setState({ showMenu: false, currentSelection: time });

		if (this.props.clips[time] === undefined) {
			console.log("wut");
			this.props.fetchFeedVideos(time);
		}
	};

	getClips = limit => {
		const original = this.props.clips[this.state.currentSelection];
		let clip = original.filter((i, index) => index < 10);

		return clip.map((x, index, arr) => (
			<Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
				<VideoListItem video={x} />
			</Link>
		));
	};

	render() {
		const loadGif = <img src={loadIcon} alt="load icon" />;
		let clips;
		if (this.props.clips[this.state.currentSelection] !== undefined) {
			clips = this.getClips(10);
		} else {
			clips = <div>No clips found this {this.state.currentSelection}</div>;
		}

		return (
			<section>
				<SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name"]} />
				<div className="top-bar">
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
	return {
		clips: state.feedsReducer.clips,
		loading: state.feedsReducer.loading,
		error: state.feedsReducer.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchFeedVideos: time => dispatch(fetchFeedVideos(time))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Feed);
