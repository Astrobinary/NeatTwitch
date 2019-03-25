import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStreamVideos, fetchMoreStreamerVideos } from "../../redux/actions/streamerActions";
import { fetchGameVideos, fetchMoreGameVideos } from "../../redux/actions/gameActions";
import LazyLoad from "react-lazyload";
import { uid } from "react-uid";
import SimpleStorage from "react-simple-storage";
import Waypoint from "react-waypoint";
import Info from "../clipsInfo";
import PreviewItem from "../previewItem";
import ToTop from "../toTop";

import optionIcon from "../../images/sort.svg";
import Loading from "../loading";

import "./previewContainer.scss";

class previewContainer extends Component {
    constructor(props) {
        super(props);

        let current = JSON.parse(localStorage.getItem("_currentClipSelection"));
        if (current === undefined || current === null) {
            current = "week";
        } else {
            current = JSON.parse(localStorage.getItem("_currentClipSelection"));
        }

        let split = this.props.location.pathname.split("/");
        let back = split[1];
        let name = split[2];
        let backURL = split.splice(1, split.length - 2);
        backURL = backURL.join("/");

        let items = ["day", "week", "month", "all"];

        if (items.length === 4) {
            items = items.filter(item => {
                return item !== current;
            });
        }

        this.state = {
            showMenu: false,
            currentClipSelection: current,
            clipSort: items,
            back,
            backURL,
            name,
            mod: 0
        };
    }

    componentDidMount() {
        if (this.props.match.params.streamerID) {
            if (this.props.videos === undefined) this.props.fetchStreamVideos(this.props.match.params.streamerID, this.state.currentClipSelection);
        }

        if (this.props.match.params.gameID) {
            if (this.props.videos === undefined) this.props.fetchGameVideos(this.props.match.params.gameID, this.state.currentClipSelection);
        }
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = time => {
        let normalize = ["day", "week", "month", "all"];

        let items = normalize.filter(item => {
            return item !== time;
        });

        if (this.props.match.params.streamerID) {
            if (this.props.videos[time] === undefined) this.props.fetchStreamVideos(this.props.match.params.streamerID, time);
        }

        if (this.props.match.params.gameID) {
            if (this.props.videos[time] === undefined) this.props.fetchGameVideos(this.props.match.params.gameID, time, "game");
        }
        this.setState({ showMenu: false, currentClipSelection: time, clipSort: items });
    };

    getClips = () => {
        if (this.props.videos[this.state.currentClipSelection].length < 1) {
            return <div>No clips found...</div>;
        }

        return this.props.videos[this.state.currentClipSelection].map((x, index, arr) => (
            <Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
                <LazyLoad height={174} offset={500} once>
                    <PreviewItem video={x} />
                </LazyLoad>
                {index === Math.round(this.props.videos[this.state.currentClipSelection].length / 1.25) ? <Waypoint onEnter={this.getMoreVideos} /> : null}
            </Link>
        ));
    };
    getMoreVideos = () => {
        if (this.props.match.params.gameID) if (this.props.videos.cursor) this.props.fetchMoreGameVideos(this.props.match.params.gameID, this.state.currentClipSelection, this.props.videos.cursor);
        if (this.props.match.params.streamerID) if (this.props.videos.cursor) this.props.fetchMoreStreamerVideos(this.props.match.params.streamerID, this.state.currentClipSelection, this.props.videos.cursor);
    };

    renderExtra = () => {
        let elements = [];
        let amount = 0;
        if (this.props.videos !== undefined) if (this.props.videos[this.state.currentClipSelection] !== undefined) amount = this.props.videos[this.state.currentClipSelection].length % 6;

        for (let index = 0; index < amount + 2; index++) {
            elements.push(<div key={uid(index)} style={{ width: "300px" }} />);
        }

        return elements;
    };

    renderMenu = () => {
        return this.state.clipSort.map((sort, index) => (
            <div key={uid(index)} onClick={() => this.updateMenu(sort)}>
                {sort}
            </div>
        ));
    };

    render() {
        const loadGif = <Loading />;
        let clips;
        if (this.props.videos !== undefined) {
            if (this.props.videos[this.state.currentClipSelection] !== undefined) {
                clips = this.getClips();
            } else {
                if (this.props.match.params.streamerID) {
                    if (this.props.videos === undefined) this.props.fetchStreamVideos(this.props.match.params.streamerID, this.state.currentClipSelection);
                }

                if (this.props.match.params.gameID) {
                    if (this.props.videos === undefined) this.props.fetchGameVideos(this.props.match.params.gameID, this.state.currentClipSelection);
                }
            }
        } else {
            clips = <div>{this.props.error}</div>;
        }

        const menu = this.renderMenu();
        let extra = this.renderExtra();

        return (
            <section>
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "mod", "clipSort"]} />
                <ToTop />
                <Info streamer={this.props.videos} type={this.props.match.params} />
                <div className="top-bar">
                    <div className="sorting">
                        <img src={optionIcon} alt="options" />
                        <span>SORT TOP CLIPS BY</span>
                        <span className="sort-choice" onClick={this.toggleMenu}>
                            {this.state.currentClipSelection}
                        </span>
                        {this.state.showMenu ? <div className="sort-menu">{menu}</div> : null}
                    </div>
                </div>
                {this.props.loading ? (
                    loadGif
                ) : (
                    <section className="clips-container">
                        {clips}
                        {extra}
                    </section>
                )}
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let key = Object.keys(ownProps.match.params)[0];
    let reducer = "";
    if (ownProps.match.params.streamerID) reducer = "streamersReducer";
    if (ownProps.match.params.gameID) reducer = "gamesReducer";

    return {
        videos: state[reducer][ownProps.match.params[key]],
        loading: state[reducer].loading,
        error: state[reducer].error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchStreamVideos: (id, time) => dispatch(fetchStreamVideos(id, time)),
        fetchGameVideos: (id, time) => dispatch(fetchGameVideos(id, time)),
        fetchMoreGameVideos: (id, time, cursor) => dispatch(fetchMoreGameVideos(id, time, cursor)),
        fetchMoreStreamerVideos: (id, time, cursor) => dispatch(fetchMoreStreamerVideos(id, time, cursor))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(previewContainer);
