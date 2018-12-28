import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStreamers, fetchMoreStreamers } from "../../redux/actions";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import "./streamers.scss";
import Img from "react-image";

import loadIcon from "../../images/loading.gif";
import optionIcon from "../../images/sort.svg";
import missingPreview from "../../images/streamerload.png";

class Streamers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            menuItems: ["youtube", "followed"],
            currntMenu: "twitch"
        };
    }

    componentDidMount() {
        if (this.props.twitch.length === 0) this.props.fetch();
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = newItem => {
        let temp = this.state.menuItems.filter(i => i !== newItem);
        temp.push(this.state.currntMenu);

        this.setState({ currntMenu: newItem, menuItems: temp, showMenu: !this.state.showMenu });
    };

    render() {
        const streamerItems = this.props.twitch.map(x => (
            <Link className="streamer-item" key={uid(x)} to={`${this.props.match.url}/${x.channel.name}`}>
                <Img alt={x.channel.name} src={[x.channel.logo.replace("300x300", "150x150"), missingPreview]} loader={<img alt="missing" src={missingPreview} />} />
                <div className="streamer-name">{x.channel.name}</div>
            </Link>
        ));

        const loadGif = (
            <div>
                <img src={loadIcon} alt="load icon" />
            </div>
        );

        return (
            <section className="Streamers">
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currntMenu}
                    </span>
                    {this.state.showMenu ? (
                        <div className="sort-menu">
                            <div onClick={() => this.updateMenu("followed")}>Followed</div>
                            <div onClick={() => this.updateMenu("youtube")}>YouTube</div>
                            <div onClick={() => this.updateMenu("twitch")}>Twitch</div>
                            <div onClick={() => this.updateMenu("all")}>All</div>
                        </div>
                    ) : null}
                    <span>STREAMERS</span>
                </div>

                <section className="streamer-container">{this.props.loading ? loadGif : streamerItems}</section>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        twitch: state.streamersReducer._twitch,
        loading: state.streamersReducer.loading,
        error: state.streamersReducer.error,
        offset: state.streamersReducer.offset
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: () => dispatch(fetchStreamers()),
        fetchAgain: offset => dispatch(fetchMoreStreamers(offset))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Streamers);
