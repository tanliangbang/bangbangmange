import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table,Form, Input,Divider, Icon, Button, AutoComplete,Select,message } from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';
import ResFieldAdd from "../../Components/Res/ResFieldAdd";


const FormItem = Form.Item;

export class ResAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            commiting:false
        }
    }


    showAddResField(){
           this.formRef.showModal();
    }

    addFieldFn(item){
        let dataSource = this.state.dataSource;
         item.key = dataSource.length;
         dataSource.push(item);
        this.setState({
            dataSource:dataSource
        })
    }

    delCurrField(index){
        let dataSource = this.state.dataSource;
        dataSource.splice(index,1);
        this.setState({
            dataSource:dataSource
        })
    }

    editCurrField(index){
        let dataSource = this.state.dataSource;
        var currData = dataSource[index];
        if(currData.dataIsNeed==1){
            currData.dataIsNeed = true;
        }else{
            currData.dataIsNeed = false;
        }
        if(currData.isShow==1){
            currData.isShow = true;
        }else{
            currData.isShow = false;
        }
        this.formRef.edit(currData)
    }

    changeField(currDate,index){
        let dataSource = this.state.dataSource;
        currDate.key = index
        dataSource[index] = currDate;
        this.setState({
            dataSource:dataSource
        })
    }

    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }


    handleSubmit(e){
        e.preventDefault();
        var _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.setState({
                    commiting:true
                })
                values.type_specification = this.deal_fieldFn(this.state.dataSource)
                new Promise(function(resolve,reject){
                    _this.props.actions.addRes(values,resolve,reject);
                }).then(function(){
                    _this.setState({
                        commiting:false,
                        dataSource:[]
                    })
                    _this.props.form.resetFields();
                    _this.success("添加成功");
                }).catch(function(reason){
                    _this.setState({
                        commiting:false
                    })
                    _this.success("添加失败");
                });
            }
        });
    }



    deal_fieldFn(arr){
        if(arr.length<=0){
            return "";
        }
        var str = "{";
        for(var i=0;i<arr.length;i++){
            str =str+ '"'+arr[i].name+'":{"dataChinaName":"'+ arr[i].dataChinaName+'","dataType":"'+arr[i].dataType+'","dataIsNeed":"'+arr[i].dataIsNeed+'","brief":"'+arr[i].brief+'","isShow":"'+arr[i].isShow+'","enumVal":"'+arr[i].enumVal+'"},'
        }
        str = str.substr(0,str.length-1) + "}";
        return str;
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const { getFieldDecorator } = this.props.form;
        const {dataSource,commiting} = this.state;
        const columns = [{
            title: '中文名称',
            dataIndex: 'dataChinaName',
            key: 'dataChinaName'
        }, {
            title: '字段名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '描述',
            dataIndex: 'brief',
            key: 'brief'
        }, {
            title: '类型',
            dataIndex: 'dataType',
            key: 'dataType'
        }, {
            title: '是否必须',
            dataIndex: 'dataIsNeed',
            key: 'dataIsNeed'
        }, {
            title: '是否显示',
            dataIndex: 'isShow',
            key: 'isShow'
        }, {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            render: (text, record,index) => (
                <span className="opera">
                  <a onClick={this.editCurrField.bind(this,index)}><Icon type="edit" /></a>
                  <Divider type="vertical" />
                  <a onClick={this.delCurrField.bind(this,index)}><Icon type="delete" /></a>
                </span>
            ),
        }];


        return (
              <Form ref="form" onSubmit={this.handleSubmit.bind(this)} className="resAdd">
                <div className="common-title">添加资源</div>
                    <div className="resTitle">
                            <FormItem {...formItemLayout} label="资源表名">
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '请输入资源表名',
                                    }],
                                })(
                                    <Input placeholder="请输入资源表名" />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="资源名称">
                                {getFieldDecorator('cname', {
                                    rules: [{
                                        required: true,
                                        message: '请输入资源名称'
                                    }],
                                })(
                                    <Input placeholder="请输入资源名称" />
                                )}
                            </FormItem>
                    </div>

                <div className="res-field">
                     <div className="common-title mgt-20">字段  <Icon onClick={this.showAddResField.bind(this)} className="add-field-btn" type="plus-square" /></div>
                    <Table dataSource={dataSource} columns={columns} pagination={false}/>
                </div>
                 <ResFieldAdd changeField={this.changeField.bind(this)} addFieldFn={this.addFieldFn.bind(this)} wrappedComponentRef={(inst) => this.formRef = inst} />

                  <div className="text-center">
                      <Button type="primary" loading={commiting} className="main-btn"  htmlType="submit" >添 加</Button>
                  </div>
              </Form>
        );
    }
}


export default Form.create({})(
    connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,

    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ResAdd));
