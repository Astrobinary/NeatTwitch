import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStreamers, fetchMoreStreamers, fetchFollowedStreamers, fetchMoreFollowedStreamers } from "../../redux/actions/streamerActions";
import { Link } from "react-router-dom";
import SimpleStorage from "react-simple-storage";

import LazyLoad from "react-lazyload";
import { uid } from "react-uid";
import "./streamers.scss";
import Img from "react-image";
import Waypoint from "react-waypoint";
import Loading from "../../components/loading";
import Totop from "../../components/toTop";
import optionIcon from "../../images/sort.svg";
import missingPreview from "../../images/streamerload.png";

class Streamers extends Component {
    constructor(props) {
        super(props);

        let current = JSON.parse(localStorage.getItem("_currentStreamerSelection"));
        if (current === undefined || current === null) {
            current = "twitch";
        } else {
            current = JSON.parse(localStorage.getItem("_currentStreamerSelection"));
        }

        let items = ["twitch", "followed"];

        items = items.filter(item => {
            return item !== current;
        });

        this.state = {
            showMenu: false,
            currentStreamerSelection: current,
            streamersSort: items,
            twitchOffset: 0,
            followedOffset: 0
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.auth.isEmpty !== this.props.auth.isEmpty) {
            if (this.props.reducer.followed === undefined && this.state.currentStreamerSelection === "followed") this.props.fetchFollowedStreamers(this.props.auth.uid.substr(7));
        }
    }
    onRouteChanged = () => {
        this.props.fetchComments(this.props.videoID);
    };

    componentDidMount() {
        // if (this.state.currentStreamerSelection === "followed" && this.props.auth.isEmpty) this.setState({ currentStreamerSelection: "twitch", showMenu: false });
        if (this.props.reducer.twitch === undefined && this.state.currentStreamerSelection === "twitch") this.props.fetch();
        if (this.props.reducer.followed === undefined && !this.props.auth.isEmpty) this.props.fetchFollowedStreamers(this.props.auth.uid.substr(7));
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = sort => {
        if (sort === "followed") if (this.props.reducer.followed === undefined && !this.props.auth.isEmpty) this.props.fetchFollowedStreamers(this.props.auth.uid.substr(7));
        if (sort === "twitch") if (this.props.reducer.twitch === undefined) this.props.fetch();

        let normalize = ["twitch", "followed"];

        let items = normalize.filter(item => {
            return item !== sort;
        });

        this.setState({ currentStreamerSelection: sort, streamersSort: items, showMenu: !this.state.showMenu });
    };

    getMoreStreamers = () => {
        console.log("more?");

        if (this.state.currentStreamerSelection === "twitch") {
            this.props.fetchAgain(this.state.twitchOffset + 102);
            this.setState({ twitchOffset: this.state.twitchOffset + 102 });
        } else {
            let offSet = this.props.reducer[this.state.currentStreamerSelection].length;
            console.log(offSet);

            if (offSet + 1 >= this.props.reducer.followTotal) return;

            this.props.fetchMoreFollowedStreamers(this.props.auth.uid.substr(7), offSet - 1);
            this.setState({ followedOffset: this.state.followedOffset + offSet });
        }
    };

    renderStreamers = () => {
        if (this.props.reducer[this.state.currentStreamerSelection].length < 1) {
            return <div>No streamers found...</div>;
        }

        return this.props.reducer[this.state.currentStreamerSelection].map((x, index) => (
            <Link className="streamer-item" key={uid(index)} to={`${this.props.match.url}/${x.channel.name}`}>
                <LazyLoad height={154} offset={300} once>
                    <Img alt={x.channel.name} src={[x.channel.logo.replace("300x300", "150x150"), missingPreview]} loader={<img alt="missing" src={missingPreview} />} />{" "}
                </LazyLoad>
                <div className="streamer-name">{x.channel.name}</div>
                {index === Math.round(this.props.reducer[this.state.currentStreamerSelection].length / 1.25) ? <Waypoint onEnter={this.getMoreStreamers} /> : null}
            </Link>
        ));
    };

    renderMenu = () => {
        return this.state.streamersSort.map((sort, index) => (
            <div key={uid(index)} onClick={() => this.updateMenu(sort)}>
                {sort}
            </div>
        ));
    };

    render() {
        let streamers;

        if (this.props.reducer[this.state.currentStreamerSelection] !== undefined) {
            streamers = this.renderStreamers();
        }

        if (this.state.currentStreamerSelection === "followed" && this.props.auth.isEmpty) {
            streamers = <div>You need to sign in to view your followed streamers.</div>;
        }

        const loadGif = (
            <div className="streamer-loader">
                <Loading />
            </div>
        );

        const menu = this.renderMenu();

        return (
            <section className="Streamers">
                <SimpleStorage parent={this} blacklist={["showMenu", "offset", "streamersSort", "twitchOffset", "followedOffset"]} />
                <Totop />
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currentStreamerSelection}
                    </span>
                    {this.state.showMenu ? <div className="sort-menu">{menu}</div> : null}
                    <span>STREAMERS</span>
                </div>

                <section className="streamer-container">{this.props.loading ? loadGif : streamers}</section>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        reducer: state.streamersReducer,
        twitch: state.streamersReducer.twitch,
        loading: state.streamersReducer.loading,
        error: state.streamersReducer.error,
        offset: state.streamersReducer.offset,
        auth: state.firebaseReducer.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: () => dispatch(fetchStreamers()),
        fetchAgain: offset => dispatch(fetchMoreStreamers(offset)),
        fetchFollowedStreamers: id => dispatch(fetchFollowedStreamers(id)),
        fetchMoreFollowedStreamers: (id, offset) => dispatch(fetchMoreFollowedStreamers(id, offset))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Streamers);
