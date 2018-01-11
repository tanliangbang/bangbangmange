import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Table, Icon, Divider,Button,message } from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';
import  Mask  from '../../Components/Common/Mask';

export class ResContentList extends React.Component {
    constructor(props) {
        super(props);
        var _this = this;
        var type = this.props.router.query.type;
        var id = this.props.router.query.id;

        var pagination = {
            total: 0,
            defaultCurrent: 1,
            pageSize: 5,
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
            id:id
        }
    }

    componentWillReceiveProps(nextProps){
        var currId = this.props.router.query.id;
        var type = nextProps.router.query.type;
        var id = nextProps.router.query.id;
        if(currId!=nextProps.router.query.id){
            this.getListData(type,id);
        }
    }

    componentWillMount(){
        var type = this.state.type;
        var id = this.state.id;
        this.getListData(type,id);
    }
    showMask(){
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
            _this.success("删除失败");
        });
    }


    editRes(){
        browserHistory.push("resAdd?id="+this.state.id)
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
            _this.props.actions.getResContentList(type,1,5,resolve,reject);
        })
        let pResDetail = new Promise(function(resolve,reject){
            _this.props.actions.getResDetail(id,resolve,reject);
        })
        Promise.all([pResList, pResDetail]).then(values => {
            _this.setState({loading:false})
        });
    }


    dealResDetail(resDetail){
        if(resDetail===null) return [];
        if(resDetail.type_specification===""){
            content = "";
        }else{
            var content = JSON.parse(resDetail.type_specification);
        }
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
             render: (text, record) => (
                 <span>
                  <a href="#"> <Icon type="edit" /></a>
                  <Divider type="vertical" />
                  <a href="#"><Icon type="delete" /></a>
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
                         render: text => <img src={text}/>,
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
                    <Button type="primary" className="main-btn"  htmlType="button" >添 加 数 据</Button>
                    <Button type="primary" className="main-btn" onClick={this.editRes.bind(this)}
                            htmlType="button" >修 改 资 源</Button>
                    <Button type="primary" loading={delLoading} onClick={this.showMask.bind(this)}
                            className="main-btn" htmlType="button" >删 除 资 源</Button>
                </div>
                <div className="common-title">{resDetail.cname+"("+resDetail.name+")列表"}</div>
                <Table dataSource={dataSource} columns={columns} loading={loading}  pagination={pagination}  />
                <Mask callback={this.delCurrRes.bind(this)} ref="mask"/>
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
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ResContentList);