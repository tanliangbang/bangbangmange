import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider } from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';

export class ResContentList extends React.Component {
    constructor(props) {
        super(props);
        var _this = this;
        var type = this.props.router.query.type;
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
            pagination:pagination
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
        var type = this.props.router.query.type;
        var id = this.props.router.query.id;
        this.getListData(type,id);
    }

    getDate(current, pageSize){
        var type = this.props.router.query.type;
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
        const {loading,pagination} = this.state;
        const {resDetail,resContentList} = this.props;
        let columns = this.dealResDetail(resDetail);
        let dataSource = this.dealResContentList(resContentList);
        let _this = this;
        if(columns.length<=0||dataSource.length<=0) return <div></div>;
        return (
            <div className="resContentList">
                <div className="common-title">{resDetail.cname+"("+resDetail.name+")列表"}</div>
                <Table dataSource={dataSource} columns={columns} loading={loading}  pagination={pagination}  />
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