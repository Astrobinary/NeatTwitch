import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAllFavorites } from "../../redux/actions/videoActions";
import LazyLoad from "react-lazyload";
import { uid } from "react-uid";
import Loading from "../../components/loading";
import PreviewItem from "../../components/previewItem";
import { Link } from "react-router-dom";
import "./favorites.scss";

class Favorites extends Component {
    componentDidMount() {
        if (!this.props.auth.isEmpty && this.props.favorites.length === 0) this.props.fetchAllFavorites();
    }
    componentWillReceiveProps(prev, next) {
        console.log(prev);
        if (!prev.auth.isEmpty && prev.favorites.length === 0) prev.fetchAllFavorites();
    }

    getClips = () => {
        if (this.props.favorites.length === 0 && !this.props.auth.isEmpty) {
            this.props.fetchAllFavorites();
        }
        const clip = this.props.favorites;

        let clips = clip.map((x, index, arr) => (
            <Link key={uid(index)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { videos: arr, current: index, next: index + 1, prev: index - 1 } }}>
                <LazyLoad height={174} offset={500} once>
                    <PreviewItem video={x} />
                </LazyLoad>
            </Link>
        ));

        return clips;
    };

    render() {
        const loadGif = (
            <div className="feed-loader">
                <Loading />
            </div>
        );

        let clips;
        if (this.props.favorites.length !== 0) {
            clips = this.getClips();
        } else {
            clips = <div>No favorites found</div>;
        }

        return (
            <section className="clips-container-feed">
                {this.props.favorites.length === 0 ? loadGif : clips}
                {/* <div style={{ width: "100%" }}>{this.props.loading ? null : <Waypoint onEnter={this.getMoreVideos} />}</div> */}
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        favorites: state.videoReducer.myFavs,
        auth: state.firebaseReducer.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllFavorites: () => dispatch(fetchAllFavorites())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Favorites);
