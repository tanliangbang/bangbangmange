import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Icon, Divider,Switch,message,Popconfirm,Select,Button,Form } from 'antd';
import * as articleAction from '../../actions/article.jsx';
import  Mask  from '../../Components/Common/Mask.jsx';
import {browserHistory} from "react-router";
import {Tool} from "../../utils/Tool.jsx";
import axios from "axios";
const Option = Select.Option;
const FormItem = Form.Item;

export class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        let current = this.props.router.query.page
        current = current?parseInt(current):1

        let pagination = {
            total: 0,
            pageSize: 10,
            loading:false,
            defaultCurrent: current,
            showSizeChanger: true,
            onShowSizeChange: () => {
                _this.getDate();
            },
            onChange:(current) => {
                _this.getDate({current:current})
            },
        }
        let community = this.props.router.query.community;
        this.state = {
            pagination:pagination,
            loading:false,
            community:community,
            typeList: [],
            current: current
        }
    }

    componentWillReceiveProps(nextProps){
        let community = this.props.router.query.community;
        let nextCommunity = nextProps.router.query.community;
        if(community !== nextCommunity && nextProps.router.pathname==='/articleList'){
            this.setState({
                community:nextCommunity
            })
            this.getDate({nextCommunity:(nextCommunity?nextCommunity:0)})
        }
    }

    getDate(obj = {}){
        let _this = this;
        let community = obj['nextCommunity']===undefined?this.props.router.query.community:obj.obj['nextCommunity'];
        let pageSize = this.state.pagination.pageSize
        let current = 1;
        if(obj['currPage']) {
            current = obj['currPage']
        }else {
            current = this.state.pagination.defaultCurrent
        }
        let param = {
            start:(current-1)*pageSize,
            pageSize:pageSize,
            community:community
        }
        let query = {}
        if (obj['otherParam']) {
            var otherQuery = {}
            let str = "?"
            for (let item in obj['otherParam']) {
                if (obj['otherParam'][item]!=='-1') {
                    str += (item +"="+ obj['otherParam'][item]+"&")
                    otherQuery[item] = obj['otherParam'][item]
                }
            }
            if(str!=="?") {
                str = str.substring(0,str.length-1)
            }else {
                str = ""
            }
            if (current!==1) {
                str = str +"&page="+current;
            }
            browserHistory.push("/articleList"+str);
            query = otherQuery
        }else {
            query = this.props.router.query
        }






        for (let item in query) {
            param[item] = query[item]
        }
        _this.setState({loading:true})
        new Promise(function(resolve,reject){
            _this.props.actions.getArticleListByType(param,resolve,reject);
        }).then(function(){
            _this.setState({loading:false})
        })
    }


    async componentWillMount(){
        let typeList = await new Promise(function(resolve,reject){
            axios.get("/api/res/getResContentList?name=article_type").then(function (res) {
                resolve(res.data.data.content)
            }).catch(function (err) {
                reject(err)
            });
        })
        this.setState({
            typeList:typeList
        })
        this.getDate()
    }

    handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFields((err, values) => {
            _this.getDate({otherParam:values})
        })
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
        this.props.actions.setPreUrl(this.props.router.pathname+this.props.router.search)
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
                <Switch defaultChecked={parseInt(text)===1?true:false} onChange={this.onChange.bind(this,{id:record.id,opera:'show'})}  checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否推荐',
            dataIndex: 'is_recommend',
            key:'is_recommend',
            render: (text, record) => (
                <Switch defaultChecked={parseInt(text)===1?true:false} onChange={this.onChange.bind(this,{id:record.id,opera:'recommend'})}  checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否顶置',
            dataIndex: 'is_top',
            key:'is_top',
            render: (text, record) => (
                   <Switch defaultChecked={parseInt(text)===1?true:false} onChange={this.onChange.bind(this,{id:record.id,opera:'top'})} checkedChildren="是"  unCheckedChildren="否"/>
            ),
        },{
            title: '是否好文章',
            dataIndex: 'is_good',
            key:'is_good',
            render: (text, record) => (
                <Switch defaultChecked={parseInt(text)===1?true:false} onChange={this.onChange.bind(this,{id:record.id,opera:'good'})} checkedChildren="是"  unCheckedChildren="否"/>
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
                  <Divider type="vertical" />
                  <a target="_blank" href={'https://www.tanliangbang.club/articleDetail?id='+record.id}><Icon type="eye" /></a>
                </span>
            ),
        }];


        const {loading, pagination, typeList} = this.state
        const {articleList} = this.props;
        let dataSource = articleList.content
        pagination.total = articleList.pageTotal
        dataSource = dataSource?dataSource:[]
        for(let i = 0; i < dataSource.length; i++) {
            dataSource[i].key = dataSource[i]['id']
            dataSource[i]['modifiedTime'] = Tool.formatDate2(dataSource[i].modifiedTime,"-");
            dataSource[i]['createTime'] = Tool.formatDate2(dataSource[i].createTime,"-");
        }
        let plainOptions = [];
        for (let i = 0; i < typeList.length; i++) {
            plainOptions.push(<Option key={i+1} value={typeList[i].id}>{typeList[i].content.name}</Option>);
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="articleList">
                <div className="search">
                    <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem  label='文章类型' >
                            {getFieldDecorator('typeId', {
                                initialValue:'-1'
                            })(
                                <Select  style={{ width: 150 }}  >
                                    <Option key="0" value="-1">全部</Option>
                                    {plainOptions}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem  label='显示' >
                            {getFieldDecorator('show', {
                                initialValue:'-1'
                            })(
                                <Select  style={{ width: 150 }} >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem  label='推荐' >
                            {getFieldDecorator('recommend', {
                                initialValue:'-1'
                            })(
                                <Select  style={{ width: 150 }} >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem  label='顶置' >
                            {getFieldDecorator('top', {
                                initialValue:'-1'
                            })(
                                <Select  style={{ width: 150 }} >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem  label='好文' >
                            {getFieldDecorator('good', {
                                initialValue:'-1'
                            })(
                                <Select  style={{ width: 150 }} >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem>
                   <Button type="primary"    htmlType="submit">搜 索</Button>
                    </Form>
                </div>
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

export default Form.create({})(connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        articleList:state.article.articleList,
    }
}, (dispatch)=>{
    const allAction =Object.assign(articleAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ArticleList));