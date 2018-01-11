import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Form, Input,Switch,Select, Icon, AutoComplete} from 'antd';
import { Tool } from '../../utils/Tool';
const FormItem = Form.Item;
const Option = Select.Option;

export class ResFieldAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            currId:null
        }
    }

    showModal()  {
        this.setState({
            visible: true,
        });
    }

    edit(currData){
        this.showModal();
        this.setState({
            currId:currData.key
        });
        delete currData.key;
        this.props.form.setFieldsValue(currData)
    }


    handleCancel(){
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.isShow===undefined||values.isShow===true){
                    values.isShow = 1;
                }else{
                    values.isShow = 0;
                }
                if(values.dataIsNeed===undefined||values.dataIsNeed===true){
                    values.dataIsNeed = 1;
                }else{
                    values.dataIsNeed = 0;
                }
                if(this.state.currId!=null){
                    this.props.changeField(values,this.state.currId);
                    this.setState({
                        currId:null
                    })
                }else{
                    this.props.addFieldFn(values)
                }
                this.props.form.resetFields();
                this.handleCancel();
            }
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };

        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading, ModalText,currId } = this.state;
        return (
                <Modal title="添加字段" visible={visible} onCancel={this.handleCancel.bind(this)} footer = {null}>
                    <Form ref="form" onSubmit={this.handleSubmit.bind(this)} className="resAddFieldForm">
                    <FormItem {...formItemLayout} label="中文名称">
                        {getFieldDecorator('dataChinaName', {
                            initialValue:"",
                            rules: [{
                                required: true,
                                message: '请输入名称',
                            }],
                        })(<Input placeholder="请输入名称" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="字段名称">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: '请输入字段名称',
                            }],
                        })(
                            <Input placeholder="请输入字段名称" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('brief', {
                            rules: [{
                                required: true,
                                message: '请输入资源描述',
                            }],
                        })(
                            <Input placeholder="请输入资源描述" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型">
                        {getFieldDecorator('dataType', {
                            rules: [{
                                required: true,
                                message: '请选择类型',
                            }],
                        })(
                            <Select >
                                <Option value="text">text</Option>
                                <Option value="textarea">textarea</Option>
                                <Option value="file">file</Option>
                                <Option value="date">date</Option>
                                <Option value="time">time</Option>
                                <Option value="boolean">boolean</Option>
                                <Option value="enum">enum</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否必须">
                        {getFieldDecorator('dataIsNeed', {
                            valuePropName: 'checked',
                            initialValue:true
                        })(
                            <Switch   checkedChildren="是"  unCheckedChildren="否"  />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否显示">
                        {getFieldDecorator('isShow', {
                            valuePropName: 'checked',
                            initialValue:true
                        })(
                            <Switch  checkedChildren="是"  unCheckedChildren="否"  />
                        )}
                    </FormItem>
                        <div className="text-center">
                            <Button type="primary" className="main-btn"  htmlType="submit" >{currId===null?"添 加":"修 改"}</Button>
                        </div>
                    </Form>

                </Modal>
        );
    }
}

export default  Form.create()(ResFieldAdd);