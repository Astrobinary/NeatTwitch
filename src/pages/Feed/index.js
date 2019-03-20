import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchFeedVideos, fetchMoreFeedVideos } from "../../redux/actions/feedActions";
import SimpleStorage from "react-simple-storage";
import Waypoint from "react-waypoint";
import Loading from "../../components/loading";

import PreviewItem from "../../components/previewItem";
import optionIcon from "../../images/sort.svg";

import "./feed.scss";
class Feed extends Component {
    constructor(props) {
        super(props);

        let currentFeed = JSON.parse(localStorage.getItem("_currentFeedSelection"));

        if (currentFeed === undefined || currentFeed === null) {
            currentFeed = "day";
        } else {
            currentFeed = JSON.parse(localStorage.getItem("_currentFeedSelection"));
        }

        this.state = {
            showMenu: false,
            currentFeedSelection: currentFeed
        };
    }

    componentWillMount() {
        if (this.props.clips[this.state.currentFeedSelection] === undefined) this.props.fetchFeedVideos(this.state.currentFeedSelection);
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    handleOnDragStart = e => e.preventDefault();

    updateMenu = time => {
        this.setState({ showMenu: false, currentFeedSelection: time });

        if (this.props.clips[time] === undefined) {
            this.props.fetchFeedVideos(time);
        }
    };

    getClips = limit => {
        const clip = this.props.clips[this.state.currentFeedSelection];

        return clip.map((x, index, arr) => (
            <Link onDragStart={this.handleOnDragStart} key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
                <PreviewItem video={x} />
            </Link>
        ));
    };
    getMoreVideos = () => {
        if (this.props.cursor) this.props.fetchMoreFeedVideos(this.state.currentFeedSelection, this.props.cursor);
    };

    render() {
        const loadGif = (
            <div className="feed-loader">
                <Loading />
            </div>
        );
        let clips;
        if (this.props.clips[this.state.currentFeedSelection] !== undefined) {
            clips = this.getClips(100);
        } else {
            clips = <div>No clips found this {this.state.currentFeedSelection}</div>;
        }

        return (
            <section>
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "responsive"]} />
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT TOP CLIPS BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currentFeedSelection}
                    </span>
                    {this.state.showMenu ? (
                        <div className="sort-menu">
                            <div onClick={() => this.updateMenu("day")}>Day</div>
                            <div onClick={() => this.updateMenu("week")}>Week</div>
                            <div onClick={() => this.updateMenu("month")}>Month</div>
                            <div onClick={() => this.updateMenu("all")}>All</div>
                        </div>
                    ) : null}
                </div>

                <section className="clips-container-feed">
                    {this.props.loading ? loadGif : clips}
                    <Waypoint topOffset={"174px"} onEnter={this.getMoreVideos} />
                </section>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        clips: state.feedsReducer,
        loading: state.feedsReducer.loading,
        cursor: state.feedsReducer.cursor,
        error: state.feedsReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFeedVideos: time => dispatch(fetchFeedVideos(time)),
        fetchMoreFeedVideos: (time, cursor) => dispatch(fetchMoreFeedVideos(time, cursor))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Feed);
