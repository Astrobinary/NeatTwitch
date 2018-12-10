import React, { Component } from "react";
import { Link } from "react-router-dom";
import SimpleStorage from "react-simple-storage";
import "babel-polyfill";
import "./videoplayer.css";

class videoplayer extends Component {
  constructor(props) {
    super(props);
    this.state = { src: "", video: this.props.location.state.video };
    console.log(this.props.location.state.video);
  }

  componentDidMount() {
    this.setState({
      src: this.getMp4(),
      height: window.innerWidth
    });

    // document.getElementsByClassName("player-contain")[0].style.backgroundImage = `url(${this.props.location.state.video.thumbnails.medium})`;
  }

  getMp4() {
    let img = this.props.location.state.video.thumbnails.small;
    img = img.split("-");
    img = img.slice(0, img.length - 2);
    img = img.join("-") + ".mp4";
    return img;
  }

  render() {
    return (
      <section className="playvideo">
        <SimpleStorage parent={this} blacklist={["src", "height", "video"]} />
        <div className="player-contain" style={{ backgroundImage: `url(${this.props.location.state.video.thumbnails.medium})` }}>
          <iframe allowFullScreen src={this.state.video.embed_url} frameBorder="0" title={this.state.video.title} scrolling="no" height="100%" width="100%" />

          <div className="player-bar">
            <div className="player-info-left">
              <div className="player-logo">
                <img alt="avatar" src={this.state.video.broadcaster.logo} />
              </div>

              <div className="player-title">
                <div className="player-title-text">{this.state.video.title}</div>
                <Link to={"/streamers/" + this.state.video.broadcaster.name}>
                  <div className="player-name">{this.state.video.broadcaster.display_name}</div>
                </Link>
              </div>
            </div>
            <div className="player-info-right">
              <div className="player-views">{this.state.video.views.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <img className="left" src={this.state.video.thumbnails.medium} alt="prev" />
        <img className="right" src={this.state.video.thumbnails.medium} alt="next" />
      </section>
    );
  }
}
export default videoplayer;
