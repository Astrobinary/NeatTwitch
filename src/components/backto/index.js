import React, { Component } from "react";
import { Link } from "react-router-dom";

import backToIcon from "../../images/backbutton.svg";
import "./backto.scss";

class backto extends Component {
    render() {
        return (
            <div className={"back-to"}>
                <Link to={`/${this.props.url || "feed"}`}>
                    <img src={backToIcon} alt="backIcon" />
                    Back to <b>{this.props.back}</b>
                </Link>
            </div>
        );
    }
}
export default backto;
