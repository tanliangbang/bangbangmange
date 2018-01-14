import './style.scss'
import React, { Component, PropTypes } from 'react'

export class Home extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="home">
                   欢迎来到邦邦后台管理系统
            </div>
        );
    }
}




export default  Home;