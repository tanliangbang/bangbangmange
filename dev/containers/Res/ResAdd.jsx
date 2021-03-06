import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Table, Form, Input, Divider, Icon, Button, message, Select} from 'antd';
import * as resAction from '../../actions/res.jsx';
import ResFieldAdd from "../../Components/Res/ResFieldAdd.jsx";
const FormItem = Form.Item;
const Option = Select.Option;

export class ResAdd extends React.Component {
    constructor(props) {
        super(props);
        let currId = this.props.router.query.id;
        let isEdit = false;
        if(currId!==undefined){
            isEdit = true;
        }
        this.state = {
            dataSource:[],
            commiting:false,
            currId:currId,
            isEdit:isEdit,
            oldTableName:""
        }

    }

    componentDidMount(){
        let currId = this.state.currId;
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getPlateList(resolve,reject)
        })
        if(this.state.isEdit){
            new Promise(function(resolve,reject){
                _this.props.actions.getResDetail(currId,resolve,reject)
            }).then(function(res){
                _this.props.form.setFieldsValue({name:res.name,cname:res.cname,res_type:parseInt(res.res_type)})
               let dataSource = _this.dealResFieldList(res.type_specification)
                _this.setState({
                    dataSource:dataSource,
                    oldTableName:res.name
                })
            }).catch(function(reason){
            });
        }
    }

    dealResFieldList(type_specification){
        let tempArr = [];
        let currData = JSON.parse(type_specification);
        let currIndex = 0;
        for(let item in currData){
            currData[item].key = currIndex;
            currData[item].name = item;
            tempArr.push(currData[item]);
            currIndex++;
        }
        return tempArr;
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
        console.log(currData)
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
        let _this = this;
        let currId = this.state.currId;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.setState({
                    commiting:true
                })
                values.type_specification = this.deal_fieldFn(this.state.dataSource)
                if(currId!==undefined){
                    values.id = currId;
                    values.tempTableName = this.state.oldTableName;
                }
                new Promise(function(resolve,reject){
                      _this.props.actions.addOrEditRes(values,resolve,reject);
                }).then(function(){
                    _this.setState({
                        commiting:false,
                        dataSource:[]
                    })
                    _this.props.form.resetFields();
                    _this.success("操作成功");
                    if(currId!==undefined){
                        browserHistory.push("resContentList?id="+currId+"&type="+values.name)
                    }
                }).catch(function(reason){
                    _this.setState({
                        commiting:false
                    })
                    _this.error("操作失败");
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
            str =str+ '"'+arr[i].name+'":{"dataChinaName":"'+ arr[i].dataChinaName
                +'","dataType":"'+arr[i].dataType+'","dataIsNeed":"'+arr[i].dataIsNeed
                +'","brief":"'+arr[i].brief+'","isShow":"'+arr[i].isShow+'","enumVal":"'+arr[i].enumVal+'"},'
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
        const {plateList} = this.props;
        const {dataSource,commiting,isEdit} = this.state;

        let plainOptions = [];
        for (let i = 0; i < plateList.length; i++) {
            plainOptions.push(<Option key={i} value={plateList[i].id}>{plateList[i].name+"("+plateList[i].type+")"}</Option>);
        }
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
            <div className="resAdd">
              <Form ref="form" onSubmit={this.handleSubmit.bind(this)} >
                <div className="my-common-title">添加资源</div>
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

                            <FormItem {...formItemLayout} label='资源类型' >
                                {getFieldDecorator('res_type', {
                                    rules: [{
                                        required: true,
                                        message: '请选择资源类型'
                                    }],
                                })(
                                    <Select placeholder="--请选择--" >
                                         {plainOptions}
                                    </Select>
                                )}
                            </FormItem>

                    </div>

                <div className="res-field">
                     <div className="my-common-title mgt-20">字段  <Icon onClick={this.showAddResField.bind(this)} className="add-field-btn" type="plus-square" /></div>
                    <Table dataSource={dataSource} columns={columns} pagination={false}/>
                </div>
                 <ResFieldAdd changeField={this.changeField.bind(this)} addFieldFn={this.addFieldFn.bind(this)} wrappedComponentRef={(inst) => this.formRef = inst} />

                  <div className="text-center">
                      <Button type="primary" loading={commiting}   htmlType="submit" >{isEdit?"修 改":"添 加"}</Button>
                  </div>
              </Form>
            </div>
        );
    }
}


export default Form.create({})(
    connect((state)=>{
    return {
        router:state.routing.locationBeforeTransitions,
        plateList:state.plate.plateList
    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ResAdd));
