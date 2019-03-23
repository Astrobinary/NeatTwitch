import React, { Component } from "react";

import "./toTop.scss";
import up from "../../images/scrollup.svg";

class toTop extends Component {
    constructor(props) {
        super(props);
        this.state = { showBtn: false, root: document.getElementById("root") };
    }

    componentWillMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = x => {
        const h = window.innerHeight;
        const height = window.pageYOffset;
        if (height < 400 && this.state.showBtn) return this.setState({ showBtn: false });
        if (height > 500 && !this.state.showBtn) return this.setState({ showBtn: true });
    };

    scrollUp = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    };

    render() {
        let btn = null;

        if (this.state.showBtn)
            btn = (
                <div className="to-top" onClick={this.scrollUp}>
                    <img src={up} alt="up" />
                </div>
            );

        return <div>{btn}</div>;
    }
}

export default toTop;
