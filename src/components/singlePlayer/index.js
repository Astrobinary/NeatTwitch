import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleVideo } from "../../redux/actions/feedActions";
import { withRouter } from "react-router";

import "babel-polyfill";
import Video from "../video";

import Loading from "../loading";

import PostComment from "../postComment";
import CommentsContainer from "../commentsContainer";

import "./singlePlayer.scss";

class singlePlayer extends Component {
    componentDidMount() {
        this.props.fetchSingleVideo(this.props.match.params.videoID);
    }

    render() {
        let video;
        console.log(this.props);

        if (this.props.video !== undefined) {
            video = <Video videoInfo={this.props.video} />;
        } else {
            video = <Loading />;
        }

        return (
            <div>
                <section className="single-videoplayer">{this.props.loading ? <Loading /> : video}</section>
                <section className="playlist-comments">
                    <PostComment videoID={this.props.match.params.videoID} placeHolder={"any thoughts?"} />
                    <div className="comment-jump">user comments</div>
                    <CommentsContainer videoID={this.props.match.params.videoID} />
                </section>
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(singlePlayer)
);

//  connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(singlePlayer);
