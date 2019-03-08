import React, { Component } from "react";
import moment from "moment";
import Img from "react-image";

import "./previewItem.scss";
import loadPreview from "../../images/previewNot.png";
import missing from "../../images/missing.png";

class previewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
            error: false
        };

        this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover() {
        this.setState({ isHovered: !this.state.isHovered });
    }

    render() {
        let image = <Img className="preview-thumb" alt="preview" src={[this.props.video.thumbnails.medium, missing]} loader={<img alt="loading" src={loadPreview} />} />;

        return (
            <div className="preview-item" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                <div className="preview-top-banner">
                    <img className="preview-logo-corner" src={this.props.video.broadcaster.logo} alt="logo" />
                    <div className="preview-view-container">
                        <div className="preview-view-count">{this.props.video.views.toLocaleString()}</div>
                        <div className="preview-view-count">{this.props.video.broadcaster.name}</div>
                    </div>

                    <span className="preview-date-added">{moment(this.props.video.created_at).fromNow()}</span>
                </div>

                {image}
                <div className="preview-name">{this.props.video.title}</div>
            </div>
        );
    }
}

export default previewItem;
