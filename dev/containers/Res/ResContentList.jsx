import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider } from 'antd';
import * as resAction from '../../actions/res';

export class ResContentList extends React.Component {
    constructor(props) {
        super(props);
        var type = this.props.router.query.type;
        var id = this.props.router.query.id;
        this.props.actions.getResContentList(type);
        this.props.actions.getResDetail(id);
    }


    dealResDetail(resDetail){
        if(resDetail===null) return [];
         var content = JSON.parse(resDetail.type_specification);
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
             dataIndex: "isOnline",
             key: "isOnline"
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
        var list = resContentList.content;
        var dataSource = [];
        var content = "";
        for(var i=0;i<list.length;i++){
             content = list[i].content;
             content['key'] = i+2;
             dataSource.push(content)
        }
        return dataSource;
    }



    render() {
        var columns = this.dealResDetail(this.props.resDetail);
        var dataSource = this.dealResContentList(this.props.resContentList);
        if(columns.length<=0||dataSource.length<=0) return <div></div>;
        let pagination = {
            total: this.props.resContentList.pageTotal,
            defaultCurrent: 1,
            pageSize: 5,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        }
        return (
            <div className="resContentList">
                <Table dataSource={dataSource} columns={columns}   pagination={pagination}  />
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