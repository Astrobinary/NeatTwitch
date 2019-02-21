import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import "babel-polyfill";
import { uid } from "react-uid";
import SimpleStorage from "react-simple-storage";
import moment from "moment";

import Backto from "../backto";
// import Comments from "../comments";

import downloadIcon from "./download.svg";
import shareIcon from "./share.svg";
import vodIcon from "./vod.svg";
import likeIcon from "./like.svg";
import prevIcon from "./prev.svg";
import nextIcon from "./next.svg";
import "./videoPlayer.scss";

class videoPlayer extends Component {
    constructor(props) {
        super(props);

        if (this.props.location.state === undefined) {
            this.state = { toVideo: true };
            return;
        } else {
            let split = this.props.location.pathname.split("/");
            split = split.splice(1, split.length);

            let back = split[split.length - 2];

            let backURL = split.splice(2, split.length);
            backURL = split.join("/");

            if (backURL.includes("feed")) backURL = back;

            this.sizeRef = React.createRef();
            this.state = { back, backURL, src: "", video: this.props.location.state.videos[this.props.location.state.current], next: this.props.location.state.videos[this.props.location.state.next], prev: this.props.location.state.videos[this.props.location.state.prev] };
        }
    }

    componentDidMount() {
        if (this.state.toFeed || this.props.location.state === undefined) return;

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

    updateVideos = next => {
        if (next) {
            this.setState({ ...this.state, video: this.props.location.state.videos[this.props.location.state.current + 1], next: this.props.location.state.videos[this.props.location.state.next + 1], prev: this.props.location.state.videos[this.props.location.state.prev + 1] });
        } else {
            this.setState({ ...this.state, video: this.props.location.state.videos[this.props.location.state.current - 1], next: this.props.location.state.videos[this.props.location.state.next - 1], prev: this.props.location.state.videos[this.props.location.state.prev - 1] });
        }
    };

    getMp4() {
        let url = this.state.video.thumbnails.small;
        url = url.split("-");
        url = url.slice(0, url.length - 2);
        url = url.join("-") + ".mp4";

        return url;
    }

    render() {
        if (this.state.toVideo === true) {
            let split = this.props.location.pathname.split("/");
            let slug = split[split.length - 1];
            return <Redirect to={"/" + slug} />;
        }

        return (
            <div>
                <Backto url={this.state.backURL} back={this.state.back} />
                <section className="videoplayer">
                    <SimpleStorage parent={this} blacklist={["src", "height", "video", "next", "prev", "back", "backURL"]} />

                    <div className="left">
                        {this.state.prev ? (
                            <Link key={uid(this.state.prev.slug)} to={{ pathname: `${this.state.prev.slug}`, state: { videos: this.props.location.state.videos, current: this.props.location.state.current - 1, next: this.props.location.state.next - 1, prev: this.props.location.state.prev - 1 } }}>
                                <div className="player-prev-icon">
                                    <img src={prevIcon} alt="prev" />
                                </div>
                                <img src={this.state.prev.thumbnails.medium} alt="prev" onClick={() => this.updateVideos(false)} />
                                <div className="player-prev-title">{this.state.prev.title}</div>
                            </Link>
                        ) : null}
                    </div>
                    <div ref={this.sizeRef} className="player-contain" style={{ backgroundImage: `url(${this.state.video.thumbnails.medium})` }}>
                        <iframe allowFullScreen src={this.state.video.embed_url} frameBorder="0" title={this.state.video.title} scrolling="no" height="100%" width="100%" />

                        <div className="player-bar">
                            <div className="player-info-left">
                                <div className="player-logo">
                                    <img alt="avatar" src={this.state.video.broadcaster.logo} />
                                </div>

                                <div className="player-title">
                                    <div className="player-title-text">{this.state.video.title}</div>
                                    <div className="player-name">
                                        <div className="player-link">
                                            <Link to={"/streamers/" + this.state.video.broadcaster.name}>{this.state.video.broadcaster.display_name}</Link>
                                        </div>
                                        <div className="player-iswhat">&nbsp;from&nbsp;</div>
                                        <div className="player-link">
                                            <Link to={"/games/" + this.state.video.game}>{this.state.video.game}</Link>
                                        </div>
                                        <div className="player-iswhat">&nbsp;{moment(this.state.video.created_at).fromNow()}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="player-info-right">
                                {/* <div className="player-views">{this.state.video.views.toLocaleString()} views</div> */}
                                <div className="player-icons">
                                    <img src={likeIcon} alt="like icon" />
                                    <img src={shareIcon} alt="share icon" />
                                    {this.state.video.vod ? (
                                        <a href={this.state.video.vod.url} target="_blank" rel="noopener noreferrer">
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
                    <div className="right">
                        {this.state.next ? (
                            <Link key={uid("s")} to={{ pathname: `${this.state.next.slug}`, state: { videos: this.props.location.state.videos, current: this.props.location.state.current + 1, next: this.props.location.state.next + 1, prev: this.props.location.state.prev + 1 } }}>
                                <div className="player-next-icon">
                                    <img src={nextIcon} alt="next" />
                                </div>
                                <img src={this.state.next.thumbnails.medium} alt="next" onClick={() => this.updateVideos(true)} />
                                <div className="player-next-title">{this.state.next.title}</div>
                            </Link>
                        ) : null}
                    </div>
                </section>
                {/* <Comments /> */}
            </div>
        );
    }
}
export default videoPlayer;
