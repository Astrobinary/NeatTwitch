import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGames, fetchMoreGames } from "../../redux/actions/gameActions";
import Waypoint from "react-waypoint";
import LazyLoad from "react-lazyload";
import { uid } from "react-uid";
import Img from "react-image";
import SimpleStorage from "react-simple-storage";

import Loading from "../../components/loading";
import Totop from "../../components/toTop";
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

        let items = ["all", "followed"];
        items = items.filter(item => {
            return item !== current;
        });

        this.state = {
            showMenu: false,
            currentGameSort: current,
            gameItems: items,
            offset: 0
        };
    }

    componentDidMount() {
        if (this.props.gameList.length === 0) this.props.fetch(this.state.offset);
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
        let normalize = ["all", "followed"];

        let items = normalize.filter(item => {
            return item !== time;
        });

        this.setState({ showMenu: false, currentGameSort: time, gameItems: items });

        console.log(`Game sort changed: ${time}`);
    };

    renderMenu = () => {
        return this.state.gameItems.map((sort, index) => (
            <div key={uid(index)} onClick={() => this.updateMenu(sort)}>
                {sort}
            </div>
        ));
    };

    render() {
        const gameItems = this.props.gameList.map((x, index) => (
            <Link className="games-item" key={uid(index)} to={`${this.props.match.url}/${encodeURIComponent(x.game.name)}`}>
                {index === Math.round(this.props.gameList.length / 1.25) ? <Waypoint onEnter={this.getMoreGames} /> : null}
                <LazyLoad height={214} once>
                    <Img alt={x.game.name} src={[x.game.box.medium, missingPreview]} loader={<img alt="missing" src={missingPreview} />} />
                </LazyLoad>
            </Link>
        ));

        const loadGif = (
            <div className="game-loader">
                <Loading />
            </div>
        );

        const menu = this.renderMenu();

        return (
            <section className="Games">
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "offset", "gameItems"]} />
                <Totop />
                <div className="sorting">
                    <img src={optionIcon} alt="options" />
                    <span>SORT TOP GAMES BY</span>
                    <span className="sort-choice" onClick={this.toggleMenu}>
                        {this.state.currentGameSort}
                    </span>
                    {this.state.showMenu ? <div className="sort-menu">{menu}</div> : null}
                </div>

                <section className="games-container">{this.props.loading ? loadGif : gameItems}</section>
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
