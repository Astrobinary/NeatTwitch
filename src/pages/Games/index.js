import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchGames, fetchMoreGames } from "../../redux/actions";

import SimpleStorage from "react-simple-storage";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import Img from "react-image";

import loadIcon from "./Preloader_5.gif";
import optionIcon from "./options.svg";
import missingPreview from "./404.png";

import "./games.scss";

class Games extends Component {
	constructor(props) {
		super(props);

		let current = JSON.parse(localStorage.getItem("_currentGameSort"));
		if (current === undefined || current === null) {
			current = "all";
		} else {
			current = JSON.parse(localStorage.getItem("_currentGameSort"));
		}

		this.state = {
			showMenu: false,
			currentSelection: current
		};
	}

	componentDidMount() {
		if (this.props.gameList.length === 0) this.props.fetch();
		window.scrollTo(0, 0);
	}

	toggleMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	};

	updateMenu = time => {
		this.setState({ showMenu: false, currentSelection: time });

		console.log(`Game sort changed: ${time}`);
	};

	render() {
		const gameItems = this.props.gameList.map(x => (
			<Link className="games-item" key={uid(x)} to={`${this.props.match.url}/${x.game.name}`}>
				<Img alt={x.game.name} src={[x.game.box.medium, missingPreview]} loader={<img alt="missing" src={missingPreview} />} />
			</Link>
		));

		const loadGif = (
			<div>
				<img src={loadIcon} alt="load icon" />
			</div>
		);

		return (
			<section className="Games">
				<SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name"]} />
				<div className="videolist-options">
					<img src={optionIcon} alt="options" />
					<span>SORT TOP GAMES BY</span>
					<span className="options-choice" onClick={this.toggleMenu}>
						{this.state.currentSelection}
					</span>
					{this.state.showMenu ? (
						<div className="time-menu">
							<div onClick={() => this.updateMenu("followed")}>Followed</div>
							<div onClick={() => this.updateMenu("all")}>All</div>
						</div>
					) : null}
				</div>

				<section className="games-container">{this.props.loading ? loadGif : gameItems} </section>
			</section>
		);
	}
}

const mapStateToProps = state => {
	return {
		gameList: state.gamesReducer.games,
		loading: state.gamesReducer.loading,
		error: state.gamesReducer.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetch: () => dispatch(fetchGames()),
		fetchAgain: offset => dispatch(fetchMoreGames(offset))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Games);
