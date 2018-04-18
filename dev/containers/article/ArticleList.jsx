import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider,Switch,message,Popconfirm } from 'antd';
import * as ArticleAction from '../../actions/article.jsx';
import  Mask  from '../../Components/Common/Mask.jsx';
import {browserHistory} from "react-router";
import {Tool} from "../../utils/Tool.jsx";

export class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        let pagination = {
            total: 0,
            defaultCurrent: 1,
            pageSize: 10,
            loading:false,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                _this.getDate(current, pageSize);
                let pagination = this.state.pagination;
                pagination.pageSize = pageSize;
                _this.setState({
                    pagination:pagination
                })
            },
            onChange:(current, pageSize) => {
                _this.getDate(current, pageSize)
            },
        }
        let community = this.props.router.query.community;
        this.state = {
            pagination:pagination,
            loading:false,
            community:community
        }
    }

    componentWillReceiveProps(nextProps){
        let community = this.props.router.query.community;
        let nextCommunity = nextProps.router.query.community;
        if(community !== nextCommunity && nextProps.router.pathname==='/articleList'){
            this.setState({
                community:nextCommunity
            })
            this.getDate(1,this.state.pagination.pageSize,nextCommunity?nextCommunity:0)
        }
    }

    getDate(current, pageSize,nextCommunity){
        let _this = this;
        let community = 0;
        if(parseInt(nextCommunity)===0||parseInt(nextCommunity)===1){
            community = nextCommunity;
        }else{
            community = this.state.community
        }
        let param = {
            start:(current-1)*pageSize,
            pageSize:pageSize,
            community:community
        }
        _this.setState({loading:true})
        new Promise(function(resolve,reject){
            _this.props.actions.getArticleListByType(param,resolve,reject);
        }).then(function(){
            _this.setState({loading:false})
        })
    }


    componentWillMount(){
        this.getDate(1,this.state.pagination.pageSize)
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

    updateAritle(id) {
        browserHistory.push("/addArticle?id="+id);
    }

    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }
    onChange(obj,bool) {
        obj.num = bool?1:0
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.operaArticle(obj,resolve,reject)
        }).then(function(){
            _this.success("操作成功");
        }).catch(function(){
            _this.error("操作失败");
        });
    }


    render() {
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key:'title'
        }, {
            title: '来源',
            dataIndex: 'wherefrom',
            key:'wherefrom'
        }, {
            title: "类型",
            dataIndex: 'typeName',
            key:'typeName'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key:'createTime'
        }, {
            title: '是否显示',
            dataIndex: 'is_show',
            key:'is_show',
            render: (text, record) => (
                <Switch defaultChecked={text} onChange={this.onChange.bind(this,{id:record.id,opera:'show'})}  checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否推荐',
            dataIndex: 'is_recommend',
            key:'is_recommend',
            render: (text, record) => (
                <Switch defaultChecked={text} onChange={this.onChange.bind(this,{id:record.id,opera:'recommend'})}  checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否顶置',
            dataIndex: 'is_top',
            key:'is_top',
            render: (text, record) => (
                   <Switch defaultChecked={text} onChange={this.onChange.bind(this,{id:record.id,opera:'top'})} checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否好文章',
            dataIndex: 'is_good',
            key:'is_good',
            render: (text, record) => (
                <Switch defaultChecked={text} onChange={this.onChange.bind(this,{id:record.id,opera:'good'})} checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '操作',
            key: 'option',
            className:"operaIcon",
            render: (text, record) => (
                <span>
                  <a> <Icon type="edit" onClick={this.updateAritle.bind(this,record.id)} /></a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定删除?" okText="确 定" cancelText="取 消" placement="top" onConfirm={this.delCurrPlate.bind(this,record.id)}>
                      <a href="javascript:;"><Icon type="delete" /></a>
                   </Popconfirm>
{/*
                  <a><Icon type="delete" onClick={this.showMask.bind(this,this.delCurrPlate.bind(this,record.id))} /></a>
*/}
                  <Divider type="vertical" />
                  <a target="_blank" href={'https://www.tanliangbang.club/articleDetail?id='+record.id}><Icon type="eye" /></a>
                </span>
            ),
        }];
        const {loading, pagination} = this.state
        const {articleList} = this.props;
        let dataSource = articleList.content
        pagination.total = articleList.pageTotal
        dataSource = dataSource?dataSource:[]
        for(let i = 0; i < dataSource.length; i++) {
            dataSource[i].key = dataSource[i]['id']
            dataSource[i]['modifiedTime'] = Tool.formatDate2(dataSource[i].modifiedTime,"-");
            dataSource[i]['createTime'] = Tool.formatDate2(dataSource[i].createTime,"-");
            dataSource[i]['is_top'] = dataSource[i]['is_top'] === 1 ? true:false
            dataSource[i]['is_show'] = dataSource[i]['is_show'] === 1 ? true:false
            dataSource[i]['is_recommend'] = dataSource[i]['is_recommend'] === 1 ? true:false
            dataSource[i]['is_good'] = dataSource[i]['is_good'] === 1 ? true:false
        }
        return (
            <div className="articleList">
                <div className="my-common-title">模块列表</div>
                <Table dataSource={dataSource} columns={columns}
                       expandedRowRender={record =>
                           <div className="otherInfo">
                               <span>来源 : {record.wherefrom}</span>
                               <span>图片 : <img src={record.imgUrl} /></span>
                               <span>作者 : {record.nick!==null?record.nick:record.username}</span>
                               <span>点赞数 : {record.likeNum}</span>
                               <span>评论数 : {record.comment_num}</span>
                               <span>修改时间 : {record.modifiedTime}</span>
                               <span>浏览数 : {record.ready_num}</span>
                               <span>标签 : {record.label}</span>
                               <span>关键字 : {record.seo_keys}</span>
                           </div>
                       }
                       loading={loading}   pagination={pagination}  />
                <Mask callback={this.state.maskCallback} ref="mask"/>
            </div>
        );
    }
}




export default  connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        articleList:state.article.articleList,
    }
}, (dispatch)=>{
    const allAction =Object.assign(ArticleAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ArticleList);