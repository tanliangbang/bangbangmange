import './style/index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider } from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';

export class Templete extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="resContentList">

            </div>
        );
    }
}




export default  connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,

    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(Templete);