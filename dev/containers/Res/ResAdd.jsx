import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table,Form, Input, Icon, Button, AutoComplete } from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';
import ResFieldAdd from "../../Components/Res/ResFieldAdd";


const FormItem = Form.Item;

export class ResAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
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





    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const { getFieldDecorator } = this.props.form;
        const {dataSource} = this.state;
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
        }];


        return (
            <div className="resAdd">
                    <div className="common-title">添加资源</div>
                    <div className="resTitle">
                        <FormItem {...formItemLayout} label="资源表名">
                            {getFieldDecorator('res_name', {
                                rules: [{
                                    required: true,
                                    message: '请输入资源表名',
                                }],
                            })(
                                <Input placeholder="请输入资源表名" />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="资源名称">
                            {getFieldDecorator('res_desc', {
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
                 <ResFieldAdd addFieldFn={this.addFieldFn.bind(this)} wrappedComponentRef={(inst) => this.formRef = inst} />
            </div>
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
