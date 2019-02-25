import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleVideo } from "../../redux/actions";

import "babel-polyfill";
import Video from "../video";

import "./singlePlayer.scss";

class singlePlayer extends Component {
    componentWillMount() {
        this.props.fetchSingleVideo(this.props.match.params.videoID);
    }

    render() {
        let video;

        if (this.props.video !== undefined) {
            video = <Video videoInfo={this.props.video} />;
        } else {
            video = <h1>404</h1>;
        }

        return (
            <div>
                <section className="videoplayer">{video}</section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        video: state.feedsReducer.singleVideo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchSingleVideo: slug => dispatch(fetchSingleVideo(slug))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(singlePlayer);
