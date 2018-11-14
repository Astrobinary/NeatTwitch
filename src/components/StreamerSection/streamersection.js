import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchChannel } from "../../actions";

import "./streamersection.css";

class streamersection extends Component {
	componentDidMount() {
		this.props.fetchChannel(this.props.match.params.streamerID);
	}

	render() {
		return (
			<section className="streamersection">
				<h1 className="App-title">{this.props.match.params.streamerID}</h1>
			</section>
		);
	}
}

const mapStateToProps = state => {
	return {
		channel: state.streamerReducer.channel,
		loading: state.streamerReducer.loading,
		error: state.streamerReducer.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchChannel: id => dispatch(fetchChannel(id))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(streamersection);
