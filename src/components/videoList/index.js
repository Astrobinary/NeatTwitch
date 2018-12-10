import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchChannel } from "../../redux/actions";
import SimpleStorage from "react-simple-storage";
import VideoPreview from "../videopreview";

import optionIcon from "./options.svg";
import loadIcon from "./Preloader_5.gif";

import "./videos.scss";
class videoList extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.search.split("=")[1] || "";
    console.log(query);

    let current = JSON.parse(localStorage.getItem("_currentSelection"));
    console.log(current);
    if (current === undefined || current === null) {
      current = "week";
    } else {
      current = JSON.parse(localStorage.getItem("_currentSelection"));
    }

    this.state = {
      showMenu: false,
      currentSelection: current,
      query
    };
  }

  componentWillMount() {
    if (this.props.channel === undefined) this.props.fetchChannel(this.props.match.params.streamerID, this.state.currentSelection);
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  updateMenu = time => {
    this.setState({ showMenu: false, currentSelection: time });

    if (this.props.channel[time] === undefined) this.props.fetchChannel(this.props.match.params.streamerID, time);
  };

  getClips = () => {
    return this.props.channel[this.state.currentSelection].map(x => (
      <Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { video: x } }}>
        <VideoPreview video={x} />
      </Link>
    ));
  };

  render() {
    const loadGif = <img src={loadIcon} alt="load icon" />;

    let clips;
    if (this.props.channel !== undefined) {
      if (this.props.channel[this.state.currentSelection] !== undefined) {
        clips = this.getClips();
      } else {
        clips = <div>No clips found this {this.state.currentSelection}</div>;
      }
    } else {
      clips = <div>Something went wrong...?</div>;
    }

    return (
      <section>
        <SimpleStorage parent={this} blacklist={["showMenu"]} />
        <div className="streamers-options">
          <img src={optionIcon} alt="options" />
          <span>SORT TOP CLIPS BY</span>
          <span className="options-choice" onClick={this.toggleMenu}>
            {this.state.currentSelection}
          </span>
          {this.state.showMenu ? (
            <div className="time-menu">
              <span onClick={() => this.updateMenu("day")}>Day</span>
              <span onClick={() => this.updateMenu("week")}>Week</span>
              <span onClick={() => this.updateMenu("month")}>Month</span>
              <span onClick={() => this.updateMenu("all")}>All</span>
            </div>
          ) : null}
        </div>

        <section className="clips-container">{this.props.loading ? loadGif : clips}</section>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    channel: state.streamers[ownProps.match.params.streamerID],
    loading: state.streamers.loading,
    error: state.streamers.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChannel: (id, time) => dispatch(fetchChannel(id, time))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(videoList);
