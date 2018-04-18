import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider,Button,message } from 'antd';
import * as plateAction from '../../actions/plate.jsx';
import  Mask  from '../../Components/Common/Mask.jsx';
import {browserHistory} from "react-router";

export class PlateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }

    componentWillMount(){
        var _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getPlateList(resolve,reject);
        })
    }
    showMask(maskCallback){
        this.setState({
            maskCallback:maskCallback
        })
        this.refs.mask.showModal("确定删除当前模块？")
    }

    delCurrPlate(id){
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.delPlate(id,resolve,reject)
        }).then(function(){
            _this.success("删除成功");
        }).catch(function(res){
            _this.error("删除失败");
        });
    }

    editPlate(id) {
        browserHistory.push("/addPlate?id="+id);
    }

    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }


    render() {
        const columns = [{
            title: 'id',
            dataIndex: 'id',
        }, {
            title: '名称',
            dataIndex: 'name',
        }, {
            title: '类型',
            dataIndex: 'type',
        }, {
            title: '描述',
            dataIndex: 'detail',
        },{
            title: '操作',
            key: 'option',
            className:"operaIcon",
            render: (text, record,index) => (
                <span>
                  <a> <Icon type="edit" onClick={this.editPlate.bind(this,record.id)} /></a>
                  <Divider type="vertical" />
                  <a><Icon type="delete" onClick={this.showMask.bind(this,this.delCurrPlate.bind(this,record.id))} /></a>
                </span>
            ),
        }];

        const {plateList} = this.props;
        for(let i = 0; i < plateList.length; i++) {
            plateList[i]['key'] = plateList[i]['id']
        }
        return (
            <div className="plateList">
                <div className="my-common-title">模块列表</div>
                <Table dataSource={plateList} columns={columns}   pagination={false}  />
                <Mask callback={this.state.maskCallback} ref="mask"/>
            </div>
        );
    }
}




export default  connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        plateList:state.plate.plateList,
    }
}, (dispatch)=>{
    const allAction =Object.assign(plateAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(PlateList);