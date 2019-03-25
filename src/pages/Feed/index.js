import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchFeedVideos, fetchMoreFeedVideos } from "../../redux/actions/feedActions";
import SimpleStorage from "react-simple-storage";
import LazyLoad from "react-lazyload";
import Waypoint from "react-waypoint";
import Loading from "../../components/loading";
import Totop from "../../components/toTop";
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

        let items = ["day", "week", "month", "all"];

        if (items.length === 4) {
            items = items.filter(item => {
                return item !== currentFeed;
            });
        }

        this.state = {
            showMenu: false,
            currentFeedSelection: currentFeed,
            feedItems: items
        };
    }

    componentWillMount() {
        if (this.props.clips[this.state.currentFeedSelection] === undefined) this.props.fetchFeedVideos(this.state.currentFeedSelection);
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = time => {
        let normalize = ["day", "week", "month", "all"];

        let items = normalize.filter(item => {
            return item !== time;
        });

        this.setState({ showMenu: false, currentFeedSelection: time, feedItems: items });

        if (this.props.clips[time] === undefined) {
            this.props.fetchFeedVideos(time);
        }
    };

    getClips = () => {
        const clip = this.props.clips[this.state.currentFeedSelection];

        let clips = clip.map((x, index, arr) => (
            <Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
                <LazyLoad height={174} offset={500} once>
                    <PreviewItem video={x} />
                </LazyLoad>
                {index === Math.round(clip.length / 1.25) ? <Waypoint onEnter={this.getMoreVideos} /> : null}
            </Link>
        ));

        return clips;
    };
    getMoreVideos = () => {
        if (this.props.cursor) this.props.fetchMoreFeedVideos(this.state.currentFeedSelection, this.props.cursor);
        console.log("fetch more from feed!");
    };

    renderMenu = () => {
        return this.state.feedItems.map((sort, index) => (
            <div key={uid(index)} onClick={() => this.updateMenu(sort)}>
                {sort}
            </div>
        ));
    };

    renderExtra = () => {
        let elements = [];
        let amount = 0;
        if (this.props.clips !== undefined) if (this.props.clips[this.state.currentFeedSelection] !== undefined) amount = this.props.clips[this.state.currentFeedSelection].length % 6;

        for (let index = 0; index < amount + 2; index++) {
            elements.push(<div key={uid(index)} style={{ width: "300px" }} />);
        }

        return elements;
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

        const menu = this.renderMenu();
        let extra = this.renderExtra();

        return (
            <section>
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "responsive", "allSort", "feedItems", "menuComp"]} />
                <Totop />
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT TOP CLIPS BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currentFeedSelection}
                    </span>
                    {this.state.showMenu ? <div className="sort-menu">{menu}</div> : null}
                </div>

                <section className="clips-container-feed">
                    {this.props.loading ? loadGif : clips}
                    {extra}
                    {/* <div style={{ width: "100%" }}>{this.props.loading ? null : <Waypoint onEnter={this.getMoreVideos} />}</div> */}
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
