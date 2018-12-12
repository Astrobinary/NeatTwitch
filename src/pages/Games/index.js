import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchGames, fetchMoreGames } from "../../redux/actions";
import { Link } from "react-router-dom";
import { uid } from "react-uid";

import loadIcon from "./Preloader_5.gif";

import "./games.scss";

class Games extends Component {
	componentDidMount() {
		if (this.props.gameList.length === 0) this.props.fetch();
		window.scrollTo(0, 0);
	}

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
