import React, { Component } from "react";
import { Link } from "react-router-dom";

import "babel-polyfill";
import moment from "moment";

import downloadIcon from "./download.svg";
import shareIcon from "./share.svg";
import vodIcon from "./vod.svg";
import likeIcon from "./like.svg";
import "./video.scss";

class video extends Component {
    constructor(props) {
        super(props);
        this.sizeRef = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        const width = this.sizeRef.current.getBoundingClientRect().width;
        let height = width * 9;
        height /= 16;

        document.getElementsByClassName("player-contain")[0].style.height = height + "px";
    };

    getMp4() {
        let url = this.props.videoInfo.thumbnails.small;
        url = url.split("-");
        url = url.slice(0, url.length - 2);
        url = url.join("-") + ".mp4";
        return url;
    }

    render() {
        return (
            <div ref={this.sizeRef} className="player-contain" style={{ backgroundImage: `url(${this.props.videoInfo.thumbnails.medium})` }}>
                <iframe allowFullScreen src={this.props.videoInfo.embed_url} frameBorder="0" title={this.props.videoInfo.title} scrolling="no" height="100%" width="100%" />

                <div className="player-bar">
                    <div className="player-info-left">
                        <div className="player-logo">
                            <img alt="avatar" src={this.props.videoInfo.broadcaster.logo} />
                        </div>

                        <div className="player-title">
                            <div className="player-title-text">{this.props.videoInfo.title}</div>
                            <div className="player-name">
                                <div className="player-link">
                                    <Link to={"/streamers/" + this.props.videoInfo.broadcaster.name}>{this.props.videoInfo.broadcaster.display_name}</Link>
                                </div>
                                <div className="player-iswhat">&nbsp;from&nbsp;</div>
                                <div className="player-link">
                                    <Link to={"/games/" + this.props.videoInfo.game}>{this.props.videoInfo.game}</Link>
                                </div>
                                <div className="player-iswhat">&nbsp;{moment(this.props.videoInfo.created_at).fromNow()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="player-info-right">
                        <div className="player-icons">
                            <img src={likeIcon} alt="like icon" />
                            <img src={shareIcon} alt="share icon" />
                            {this.props.videoInfo.vod ? (
                                <a href={this.props.videoInfo.vod.url} target="_blank" rel="noopener noreferrer">
                                    <img src={vodIcon} alt="vod icon" />
                                </a>
                            ) : null}

                            <a href={this.getMp4()} download target="_blank" rel="noopener noreferrer">
                                <img src={downloadIcon} alt="download icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default video;
