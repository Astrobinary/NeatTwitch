import React, { Component } from "react";
import { connect } from "react-redux";

import "./favorites.scss";

class Favorites extends Component {
    componentDidMount() {
        console.log(this.props.favorites.favs);
    }

    render() {
        return (
            <section>
                <h1>my favorites</h1>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        favorites: state.videoReducer
    };
};

export default connect(
    mapStateToProps,
    null
)(Favorites);
