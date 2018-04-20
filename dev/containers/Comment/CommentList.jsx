import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider,Button,message } from 'antd';
import  Mask  from '../../Components/Common/Mask.jsx';
import {browserHistory} from "react-router";
import * as commentAction from '../../actions/comment.jsx';

export class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }

    componentWillMount(){
        var _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getCommentList(resolve,reject);
        })
    }
    showMask(maskCallback){
        this.setState({
            maskCallback:maskCallback
        })
        this.refs.mask.showModal("确定删除当前评论及回复？")
    }

    delCurrComent(id){
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.delComment(id,resolve,reject)
        }).then(function(){
            //let commentList = _this.props.commentList.filter(item => item.id !== id)
            var commentList = [..._this.props.commentList];
            commentList = commentList.filter(item => item.id !== id)
           _this.props.actions.setCommentList(commentList)
            _this.success("删除成功");
        }).catch(function(err){
            console.log(err)
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
        },{
            title: '用户名',
            dataIndex: 'username',
        }, {
            title: '内容',
            dataIndex: 'content',
        },{
            title: '操作',
            key: 'option',
            className:"operaIcon",
            render: (text, record,index) => (
                <span>
                  <a><Icon type="delete" onClick={this.showMask.bind(this,this.delCurrComent.bind(this,record.id))} /></a>
                </span>
            ),
        }];

        const {commentList} = this.props;
        for(let i = 0; i < commentList.length; i++) {
            commentList[i]['key'] = commentList[i]['id']
        }
        return (
            <div className="commentList">
                <div className="my-common-title">评论列表</div>
                <Table dataSource={commentList} columns={columns}   pagination={false}  />
                <Mask callback={this.state.maskCallback} ref="mask"/>
            </div>
        );
    }
}




export default  connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        commentList:state.comment.commentList,
    }
}, (dispatch)=>{
    const allAction =Object.assign(commentAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(CommentList);