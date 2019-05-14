import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { fetchUserComments, fetchUserProfile } from "../../redux/actions/profileActions";
import Comment from "../../components/profileComment";
import "./profile.scss";

const shortid = require("shortid");

class Profile extends Component {
    componentDidMount = () => {
        if (this.props.profile === undefined) this.props.fetchUserProfile(this.props.match.params.user);
    };

    fetchComments = () => {
        if (!this.props.profile.comments) this.props.fetchUserComments(this.props.match.params.user);
    };

    renderComments = () => {
        if (this.props.profile !== undefined)
            if (this.props.profile.comments !== undefined) {
                return this.props.profile.comments.map((comment, index) => (
                    <Link key={shortid.generate()} to={`/${comment.videoID}`}>
                        <Comment videoID={comment.videoID} {...comment} index={index} title={comment.title} />
                    </Link>
                ));
            }
    };

    render() {
        return (
            <section>
                {this.props.loading ? (
                    <div>loading</div>
                ) : this.props.profile != null ? (
                    <section className="profile-header" onClick={this.fetchComments}>
                        <img src={this.props.profile.logo} alt="logo" />
                        {this.props.match.params.user}
                    </section>
                ) : (
                    <div>User not found</div>
                )}

                <section className="profile-comments">{this.renderComments()}</section>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profileReducer[ownProps.match.params.user],
        loading: state.profileReducer.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserComments: name => dispatch(fetchUserComments(name)),
        fetchUserProfile: name => dispatch(fetchUserProfile(name))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Profile)
);
