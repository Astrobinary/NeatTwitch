import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchFeedVideos } from "../../redux/actions";
import SimpleStorage from "react-simple-storage";
import PreviewItem from "../../components/previewItem";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import loadIcon from "../../images/loading.gif";

import "./feed.scss";
class Feed extends Component {
    constructor(props) {
        super(props);

        let currentFeed = JSON.parse(localStorage.getItem("_currentFeedSelection"));

        if (currentFeed === undefined || currentFeed === null) {
            currentFeed = "day";
        } else {
            currentFeed = JSON.parse(localStorage.getItem("_currentFeedSelection"));
        }

        this.state = {
            showMenu: false,
            currentFeedSelection: currentFeed,
            responsive: { 0: { items: 1 }, 600: { items: 3 }, 1000: { items: 3 }, 1400: { items: 4 }, 1700: { items: 5 }, 2000: { items: 6 }, 2560: { items: 7 } }
        };
    }

    componentWillMount() {
        console.log(this.props.clips[this.state.currentFeedSelection]);
        if (this.props.clips[this.state.currentFeedSelection] === undefined) this.props.fetchFeedVideos(this.state.currentFeedSelection);
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    handleOnDragStart = e => e.preventDefault();

    updateMenu = time => {
        this.setState({ showMenu: false, currentFeedSelection: time });

        if (this.props.clips[time] === undefined) {
            this.props.fetchFeedVideos(time);
        }
    };

    getClips = limit => {
        const original = this.props.clips[this.state.currentFeedSelection];
        let clip = original.filter((i, index) => index < limit);

        return clip.map((x, index, arr) => (
            <Link onDragStart={this.handleOnDragStart} key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
                <PreviewItem video={x} />
            </Link>
        ));
    };

    render() {
        const loadGif = <img src={loadIcon} alt="load icon" />;
        let clips;
        if (this.props.clips[this.state.currentFeedSelection] !== undefined) {
            clips = this.getClips(40);
        } else {
            clips = <div>No clips found this {this.state.currentFeedSelection}</div>;
        }

        return (
            <section>
                <SimpleStorage parent={this} blacklist={["showMenu", "back", "backURL", "name", "responsive"]} />

                <div className="top-title">TOP TWITCH CLIPS TODAY</div>
                <section className="clips-container-feed">
                    <AliceCarousel
                        stagePadding={{
                            paddingLeft: 50,
                            paddingRight: 0
                        }}
                        infinite={false}
                        items={[1, 2, 3]}
                        buttonsDisabled={true}
                        responsive={this.state.responsive}
                        mouseDragEnabled>
                        {this.props.loading ? loadGif : clips}
                    </AliceCarousel>
                </section>

                <div className="top-title">TOP YOUTUBE CLIPS TODAY</div>
                <section className="clips-container-feed">
                    <AliceCarousel
                        stagePadding={{
                            paddingLeft: 50,
                            paddingRight: 0
                        }}
                        infinite={false}
                        items={[1, 2, 3]}
                        buttonsDisabled={true}
                        responsive={this.state.responsive}
                        mouseDragEnabled>
                        {this.props.loading ? loadGif : clips}
                    </AliceCarousel>
                </section>

                <div className="top-title">STAFF PICKS</div>
                <section className="clips-container-feed">
                    <AliceCarousel
                        stagePadding={{
                            paddingLeft: 50,
                            paddingRight: 0
                        }}
                        infinite={false}
                        items={[1, 2, 3]}
                        buttonsDisabled={true}
                        responsive={this.state.responsive}
                        mouseDragEnabled>
                        {this.props.loading ? loadGif : clips}
                    </AliceCarousel>
                </section>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        clips: state.feedsReducer,
        loading: state.feedsReducer.loading,
        error: state.feedsReducer.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFeedVideos: time => dispatch(fetchFeedVideos(time))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Feed);
