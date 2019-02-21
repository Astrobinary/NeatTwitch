import React, { Component } from "react";

import "./clipsInfo.scss";
import twitchIcon from "../../images/twitch.svg";

class clipsInfo extends Component {
    render() {
        if (this.props.type.streamerID && this.props.streamer !== undefined && this.props.streamer.details !== undefined) {
            return (
                <section className={"clips-info"}>
                    <img className={"clips-info-logo"} src={this.props.streamer.details.logo} alt="logo" />
                    <div className={"clips-info-name"}>
                        <div>
                            <a href={this.props.streamer.details.url} target="_blank" rel="noopener noreferrer">
                                {this.props.streamer.details.name} <img className={"clips-info-icon"} src={twitchIcon} alt="twitch icon" />
                            </a>
                        </div>

                        <div className={"clips-info-desc"}>{this.props.streamer.details.description}</div>
                    </div>
                </section>
            );
        } else if (this.props.type.gameID && this.props.streamer !== undefined) {
            return <div className="clips-info-game-title">{this.props.type.gameID}</div>;
        } else {
            return <div />;
        }
    }
}
export default clipsInfo;
