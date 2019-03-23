import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStreamers, fetchMoreStreamers, fetchFollowedStreamers } from "../../redux/actions/streamerActions";
import { Link } from "react-router-dom";
import SimpleStorage from "react-simple-storage";
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
            offset: 0
        };
    }

    componentDidMount() {
        if (this.state.currentStreamerSelection === "followed" && this.props.auth.isEmpty) this.setState({ currentStreamerSelection: "twitch", showMenu: false });
        if (this.props.reducer.twitch === undefined) this.props.fetch();
        if (this.props.reducer.followed === undefined && !this.props.auth.isEmpty) this.props.fetchFollowedStreamers(this.props.auth.uid.substr(7), "followed");
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = time => {
        if (time === "followed") if (this.props.reducer.followed === undefined && !this.props.auth.isEmpty) this.props.fetchFollowedStreamers(this.props.auth.uid.substr(7), "followed");

        let normalize = ["twitch", "followed"];

        let items = normalize.filter(item => {
            return item !== time;
        });

        this.setState({ currentStreamerSelection: time, streamersSort: items, showMenu: !this.state.showMenu });
    };

    getMoreStreamers = () => {
        this.props.fetchAgain(this.state.offset + 102);
        this.setState({ offset: this.state.offset + 102 });
    };

    renderStreamers = () => {
        if (this.props.reducer[this.state.currentStreamerSelection].length < 1) {
            return <div>No streamers found...</div>;
        }

        return this.props.reducer[this.state.currentStreamerSelection].map(x => (
            <Link className="streamer-item" key={uid(x)} to={`${this.props.match.url}/${x.channel.name}`}>
                <Img alt={x.channel.name} src={[x.channel.logo.replace("300x300", "150x150"), missingPreview]} loader={<img alt="missing" src={missingPreview} />} />
                <div className="streamer-name">{x.channel.name}</div>
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

        const loadGif = (
            <div className="streamer-loader">
                <Loading />
            </div>
        );

        const menu = this.renderMenu();

        return (
            <section className="Streamers">
                <SimpleStorage parent={this} blacklist={["showMenu", "offset", "streamersSort"]} />
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

                <section className="streamer-container">
                    {this.props.loading ? loadGif : streamers}
                    <Waypoint topOffset={"430px"} onEnter={this.getMoreStreamers} />
                </section>
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
        fetchFollowedStreamers: (id, sort) => dispatch(fetchFollowedStreamers(id, sort))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Streamers);
