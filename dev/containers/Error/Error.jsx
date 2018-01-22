import './style.scss'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';



export class Error extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        window.document.getElementById("app-loading").style.display="none";
    }



    render() {


        return (
            <div className="error">
                <div>
                  <p>404</p>
                  <p>SORRY</p>
                  <p>The Page You're Looking For Was Not Found.</p>
                    <Link  to='/' >返回首页</Link>
                </div>
            </div>
        );
    }
};



export default Error;
