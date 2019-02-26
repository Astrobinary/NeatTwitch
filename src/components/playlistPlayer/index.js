import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Img from "react-image";
import "babel-polyfill";
import { uid } from "react-uid";

import Backto from "../backto";
import Video from "../video";

import loadPreview from "../../images/previewNot.png";
import missing from "../../images/missing_big.png";
import prevIcon from "./prev.svg";
import nextIcon from "./next.svg";
import "./playlistPlayer.scss";

class playlistPlayer extends Component {
    constructor(props) {
        super(props);

        if (this.props.location.state === undefined) {
            return;
        }

        let split = this.props.location.pathname.split("/");
        split = split.splice(1, split.length);

        let back = split[split.length - 2];

        let backURL = split.splice(2, split.length);
        backURL = split.join("/");

        if (backURL.includes("feed")) backURL = back;

        this.state = { back, backURL, video: this.props.location.state.videos[this.props.location.state.current], next: this.props.location.state.videos[this.props.location.state.next], prev: this.props.location.state.videos[this.props.location.state.prev] };
    }

    updateVideos = next => {
        if (next) {
            this.setState({ ...this.state, video: this.props.location.state.videos[this.props.location.state.current + 1], next: this.props.location.state.videos[this.props.location.state.next + 1], prev: this.props.location.state.videos[this.props.location.state.prev + 1] });
        } else {
            this.setState({ ...this.state, video: this.props.location.state.videos[this.props.location.state.current - 1], next: this.props.location.state.videos[this.props.location.state.next - 1], prev: this.props.location.state.videos[this.props.location.state.prev - 1] });
        }
    };

    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to={"/" + this.props.match.params.videoID} />;
        }

        return (
            <div>
                <Backto url={this.state.backURL} back={this.state.back} />
                <section className="videoplayer">
                    <div className="left">
                        {this.state.prev ? (
                            <Link key={uid(this.state.prev.slug)} to={{ pathname: `${this.state.prev.slug}`, state: { videos: this.props.location.state.videos, current: this.props.location.state.current - 1, next: this.props.location.state.next - 1, prev: this.props.location.state.prev - 1 } }}>
                                <div className="player-prev-icon">
                                    <img src={prevIcon} alt="prev" />
                                </div>
                                {/* <img src={this.state.prev.thumbnails.medium} alt="prev" onClick={() => this.updateVideos(false)} /> */}
                                <Img alt="prev" src={[this.state.prev.thumbnails.medium, missing]} loader={<img alt="loading" src={loadPreview} />} onClick={() => this.updateVideos(false)} />

                                <div className="player-prev-title">{this.state.prev.title}</div>
                            </Link>
                        ) : null}
                    </div>
                    <Video videoInfo={this.state.video} />
                    <div className="right">
                        {this.state.next ? (
                            <Link onClick={() => this.updateVideos(true)} key={uid(this.state.next.slug)} to={{ pathname: `${this.state.next.slug}`, state: { videos: this.props.location.state.videos, current: this.props.location.state.current + 1, next: this.props.location.state.next + 1, prev: this.props.location.state.prev + 1 } }}>
                                <div className="player-next-icon">
                                    <img src={nextIcon} alt="next" />
                                </div>
                                {/* <img src={this.state.next.thumbnails.medium} alt="next" onClick={() => this.updateVideos(true)} /> */}
                                <Img alt="next" src={[this.state.next.thumbnails.medium, missing]} loader={<img alt="loading" src={loadPreview} />} onClick={() => this.updateVideos(true)} />

                                <div className="player-next-title">{this.state.next.title}</div>
                            </Link>
                        ) : null}
                    </div>
                </section>
            </div>
        );
    }
}

export default playlistPlayer;
