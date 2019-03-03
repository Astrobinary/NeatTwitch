import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGames, fetchMoreGames } from "../../redux/actions/videoActions";
import Waypoint from "react-waypoint";
import LazyLoad from "react-lazyload";
import { uid } from "react-uid";
import Img from "react-image";
import SimpleStorage from "react-simple-storage";

import Loading from "../../components/loading";

import optionIcon from "../../images/sort.svg";
import missingPreview from "../../images/gameload.png";
import "./games.scss";

class Games extends Component {
    constructor(props) {
        super(props);

        let current = JSON.parse(localStorage.getItem("_currentGameSort"));
        if (current === undefined || current === null) {
            current = "all";
        } else {
            current = JSON.parse(localStorage.getItem("_currentGameSort"));
        }

        this.state = {
            showMenu: false,
            currentGameSort: current,
            offset: 0
        };
    }

    componentDidMount() {
        if (this.props.gameList.length === 0) this.props.fetch(this.state.offset);

        window.scrollTo(0, 0);
    }

    getMoreGames = () => {
        this.props.fetchMore(this.state.offset + 102);
        this.setState({ offset: this.state.offset + 102 });
        console.log("getting more!");
    };

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    updateMenu = time => {
        this.setState({ showMenu: false, currentGameSort: time });

        console.log(`Game sort changed: ${time}`);
    };

    render() {
        const gameItems = this.props.gameList.map(x => (
            <Link className="games-item" key={uid(x)} to={`${this.props.match.url}/${x.game.name}`}>
                <LazyLoad height={213} offset={413} once>
                    <Img alt={x.game.name} src={[x.game.box.medium, missingPreview]} loader={<img alt="missing" src={missingPreview} />} />
                </LazyLoad>
            </Link>
        ));

        const loadGif = (
            <div className="game-loader">
                <Loading />
            </div>
        );

        return (
            <section className="Games">
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "offset"]} />
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT TOP GAMES BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currentGameSort}
                    </span>
                    {this.state.showMenu ? (
                        <div className="sort-menu">
                            <div onClick={() => this.updateMenu("followed")}>Followed</div>
                            <div onClick={() => this.updateMenu("all")}>All</div>
                        </div>
                    ) : null}
                </div>

                <section className="games-container">
                    {this.props.loading ? loadGif : gameItems} <Waypoint topOffset={"430px"} onEnter={this.getMoreGames} />
                </section>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameList: state.gamesReducer.games,
        loading: state.gamesReducer.loading,
        error: state.gamesReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: offset => dispatch(fetchGames(offset)),
        fetchMore: offset => dispatch(fetchMoreGames(offset))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Games);
