import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchGames, fetchGamesAgain } from "../../actions";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import Waypoint from "react-waypoint";

import SearchBar from "../../components/SearchBar/Search";

import loadIcon from "./Preloader_5.gif";

import "./games.css";

class Games extends Component {
	componentDidMount() {
		if (this.props.gameList.length === 0) this.props.fetch();
		window.scrollTo(0, 0);
	}

	getMoreGames = () => {
		this.props.fetchAgain(this.props.offset + 101);
	};

	render() {
		const gameItems = this.props.gameList.map(x => (
			<Link className="games-item" key={uid(x)} to={`${this.props.match.url}/${x.game.name}`}>
				<img src={x.game.box.medium} alt={x.game.name} />
			</Link>
		));

		const loadGif = (
			<div>
				<img src={loadIcon} alt="load icon" />
			</div>
		);

		return (
			<section className="Games">
				<SearchBar holder="search games..." />
				<section className="games-container">{this.props.loading ? loadGif : gameItems} </section>
				<Waypoint topOffset="99%" onEnter={this.getMoreGames} />
			</section>
		);
	}
}

const mapStateToProps = state => {
	return {
		gameList: state.gameReducer.games,
		loading: state.gameReducer.loading,
		error: state.gameReducer.error,
		offset: state.streamerReducer.offset
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetch: () => dispatch(fetchGames()),
		fetchAgain: offset => dispatch(fetchGamesAgain(offset))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Games);
