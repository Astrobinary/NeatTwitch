import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStreamers, fetchMoreStreamers } from "../../redux/actions";
import { Link } from "react-router-dom";
import loadIcon from "./Preloader_5.gif";
import { uid } from "react-uid";
import "./streamers.scss";
import optionIcon from "./options.svg";

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

  getMoreStreamers = () => {
    this.props.fetchAgain(this.props.offset + 101);
  };

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
      <Link className="streamer-item" key={uid(x)} to={`${this.props.match.url}/${x.channel.name}?sort=week`}>
        <img src={x.channel.logo.replace("300x300", "150x150")} alt={x.channel.name} />
        <div className="streamer-name">{x.channel.name}</div>
      </Link>
    ));

    const loadGif = (
      <div>
        <img src={loadIcon} alt="load icon" />
      </div>
    );

    const menu = (
      <div className="menu">
        {this.state.menuItems.map(item => {
          return (
            <span onClick={() => this.updateMenu(item)} key={uid(item)}>
              {item}
            </span>
          );
        })}
      </div>
    );

    return (
      <section className="Streamers">
        <div className="streamers-options">
          <img src={optionIcon} alt="options" />
          <span>SORT BY</span>
          {this.state.showMenu ? menu : null}
          <span className="options-choice" onClick={this.toggleMenu}>
            {this.state.currntMenu}
          </span>
          <span>STREAMERS</span>
        </div>

        <section className="streamer-container">{this.props.loading ? loadGif : streamerItems}</section>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    twitch: state.streamers._twitch,
    loading: state.streamers.loading,
    error: state.streamers.error,
    offset: state.streamers.offset
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
