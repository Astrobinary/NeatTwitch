import React, { Component } from "react";
import { connect } from "react-redux";

import { fetchUserComments } from "../../redux/actions/profileActions";
import "./profile.scss";

class Profile extends Component {
    componentDidMount() {
        if (!this.props.comments) this.props.fetchUserComments(this.props.match.params.user);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.user !== prevProps.match.params.user) {
            this.onRouteChanged();
        }
    }

    onRouteChanged = () => {
        if (this.props.comments === undefined) this.props.fetchUserComments(this.props.match.params.user);
    };

    render() {
        return (
            <section>
                <h1>{this.props.match.params.user}</h1>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        comments: state.profileReducer[ownProps.match.params.user]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserComments: name => dispatch(fetchUserComments(name))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
