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
    }


    showAddResField(){
           this.formRef.showModal();
    }





    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const { getFieldDecorator } = this.props.form;


        const dataSource = [{
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号'
        }, {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号'
        }];

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
                 <ResFieldAdd wrappedComponentRef={(inst) => this.formRef = inst} />
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
