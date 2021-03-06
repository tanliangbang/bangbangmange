import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory,Link } from 'react-router';
import { Table, Icon, Divider,Button,message } from 'antd';
import * as resAction from '../../actions/res.jsx';
import * as articleAction from '../../actions/article.jsx';

import { Tool } from '../../utils/Tool.jsx';
import  Mask  from '../../Components/Common/Mask.jsx';

export class ResContentList extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        let type = this.props.router.query.type;
        let id = this.props.router.query.id;
        let pagination = {
            total: 0,
            defaultCurrent: 1,
            pageSize: 100,
            loading:false,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                _this.getDate(current, pageSize);
                var pagination = this.state.pagination;
                pagination.pageSize = pageSize;
                _this.setState({
                    pagination:pagination
                })
            },
            onChange:(current, pageSize) => {
                _this.getDate(current, pageSize)
            },
        }
        this.state = {
            loading:false,
            delLoading:false,
            pagination:pagination,
            type:type,
            id:id,
            maskCallback:null
        }
        this.props.hideLoading();
    }

    componentWillReceiveProps(nextProps){
        let currId = this.props.router.query.id;
        let type = nextProps.router.query.type;
        let id = nextProps.router.query.id;
        if(currId!=nextProps.router.query.id){
            this.setState({
                type:type,
                id:id
            })
            this.getListData(type,id);
        }
    }

    componentWillMount(){
        let type = this.props.router.query.type;
        let id = this.props.router.query.id;
        this.getListData(type,id);
    }
    showMask(maskCallback){
        this.setState({
            maskCallback:maskCallback
        })
        this.refs.mask.showModal("确定删除当前资源和资源里面的内容？")
    }

    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }

    delCurrRes(){
        var id = this.state.id;
        var _this = this;
        _this.setState({
            delLoading:true
        })
        new Promise(function(resolve,reject){
            _this.props.actions.delRes(id,resolve,reject)
        }).then(function(){
            _this.success("删除成功");
            _this.setState({
                delLoading:false
            })
        }).catch(function(reason){
            _this.setState({
                delLoading:false
            })
            _this.error("删除失败");
        });
    }


    editRes(){
        browserHistory.push("resAdd?id="+this.state.id)
    }

    delCurrResContent(index,id){
        let _this = this;
        let type = this.state.type
        new Promise(function(resolve,reject){
            _this.props.actions.delResContent(id,type,resolve,reject)
        }).then(function(){
            _this.success("删除成功");
        }).catch(function(res){
            _this.error("删除失败");
        });
    }


    getDate(current, pageSize){
        var type = this.state.type;
        var _this = this;
        _this.setState({loading:true})
        new Promise(function(resolve,reject){
            _this.props.actions.getResContentList(type,current, pageSize,resolve,reject);
        }).then(function(){
            _this.setState({loading:false})
        })
    }


    getListData(type,id){
        let _this = this;
        _this.setState({loading:true})
        let pResList =  new Promise(function(resolve,reject){
            _this.props.actions.getResContentList(type,1,_this.state.pagination.pageSize,resolve,reject);
        })
        let pResDetail = new Promise(function(resolve,reject){
            _this.props.actions.getResDetail(id,resolve,reject);
        })
        Promise.all([pResList, pResDetail]).then(values => {
            _this.setState({loading:false})
        });
    }

    toAddResContent(){
        let id = this.state.id;
        let type = this.state.type;
        browserHistory.push("resAddContent?id="+id+"&type="+type);
        this.props.showLoading();
    }

    editResContent(resId,id,type){
        this.props.showLoading();
        browserHistory.push("/resAddContent?resContentId="+id+"&id="+resId+"&type="+type);
    }


    dealResDetail(resDetail){
        if(resDetail===null) return [];
        if(resDetail.type_specification===""){
            content = "";
        }else{
            var content = JSON.parse(resDetail.type_specification);
        }
        let resId = this.state.id;
        let resName = this.state.type;
         var column = {};
         var columns = [];
         var nomalColumn = [{
             title: "创建时间",
             dataIndex: "createTime",
             key: "createTime"
         },{
             title: "修改时间",
             dataIndex: "modifiedTime",
             key: "modifiedTime"
         },{
             title: "是否上线",
             dataIndex: "isOnLine",
             key: "isOnLine"
         }, {
             title: '操作',
             key: 'option',
             className:"operaIcon",
             render: (text, record,index) => (
                 <span>
                  <a onClick={this.editResContent.bind(this,resId,record.id,resName)}> <Icon type="edit" /></a>
                  <Divider type="vertical" />
                  <a onClick={this.showMask.bind(this,this.delCurrResContent.bind(this,index,record.id))}><Icon type="delete" /></a>
                </span>
             ),
         }]



         for(var item in content){
             if(content[item].isShow!=0){
                 if(content[item].dataType==="file"){
                     column = {
                         title: content[item].dataChinaName,
                         key: item,
                         dataIndex: item,
                         render: text => text?<img src={text}/>:'无',
                         className:"fileImg"
                     }
                 }else{
                     column = {
                         title: content[item].dataChinaName,
                         dataIndex: item,
                         key: item
                     }
                 }
                 columns.push(column)
             }
         }
        return columns.concat(nomalColumn);

    }

    dealResContentList(resContentList){
        if(resContentList===null) return [];
        let pagination = this.state.pagination;
        pagination.total = resContentList.pageTotal;
        var list = resContentList.content;
        var dataSource = [];
        var content = "";
        for(var i=0;i<list.length;i++){
             content = list[i].content;
            if(typeof content !== 'object'){
                content = {}
            }
            for(let item in content){
                 if(content[item] instanceof Array){
                   content[item] = content[item].join(",")
                 }
             }
             content["id"] = list[i].id;
             content['createTime'] = Tool.formatDate2(list[i].createTime,"-");
             content['modifiedTime'] = Tool.formatDate2(list[i].modifiedTime,"-");
            if(list[i].isOnLine==1){
                content['isOnLine'] ="是"
            }else{
                content['isOnLine'] ="否"
            }
            content['key'] = i+2;
             dataSource.push(content)
        }
        return dataSource;
    }



    render() {
        const {loading,pagination,delLoading} = this.state;
        const {resDetail,resContentList} = this.props;
        if(resDetail==null||resContentList==null) return <div></div>;
        let columns = this.dealResDetail(resDetail);
        let dataSource = this.dealResContentList(resContentList);
        return (
            <div className="resContentList">
                    <div>
                        <Button type="primary"  onClick={this.toAddResContent.bind(this)}  htmlType="button" >添 加 数 据</Button>
                        <Button type="primary"  onClick={this.editRes.bind(this)}
                                htmlType="button" >修 改 资 源</Button>
                        <Button type="primary" loading={delLoading} onClick={this.showMask.bind(this,this.delCurrRes.bind(this))}
                                 htmlType="button" >删 除 资 源</Button>
                    </div>
                    <div className="my-common-title">{resDetail.cname+"("+resDetail.name+")列表"}</div>
                    <Table dataSource={dataSource} columns={columns} loading={loading}   pagination={pagination}  />
                    <Mask callback={this.state.maskCallback} ref="mask"/>
            </div>
        );
    }
}




export default  connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        resContentList:state.res.resContentList,
        resDetail:state.res.resDetail
    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction,articleAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ResContentList);