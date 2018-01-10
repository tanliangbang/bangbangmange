import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Form, Input,Switch, Icon, AutoComplete} from 'antd';
import { Tool } from '../../utils/Tool';
const FormItem = Form.Item;

export class ResFieldAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        }

    }


    showModal()  {
        this.setState({
            visible: true,
        });
    }



    handleOk(){
        this.refs.commit.handleClick();
    }
    handleCancel(){
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    handleSubmit(e){
        console.log("aaaaaa")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };

        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <Form ref="form" onSubmit={this.handleSubmit} className="resAddFieldForm">
                <Modal title="添加字段"
                       visible={visible}
                       cancelText="取消"
                       okText="添加"
                       onOk={this.handleOk.bind(this)}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel.bind(this)}>

                    <FormItem {...formItemLayout} label="中文名称">
                        {getFieldDecorator('dataChinaName', {
                            rules: [{
                                required: true,
                                message: '请输入资源表名',
                            }],
                        })(<Input placeholder="请输入资源表名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="英文名称">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: '请输入资源表名',
                            }],
                        })(
                            <Input placeholder="请输入资源表名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('brief', {
                            rules: [{
                                required: true,
                                message: '请输入资源表名',
                            }],
                        })(
                            <Input placeholder="请输入资源表名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型">
                        {getFieldDecorator('dataType', {
                            rules: [{
                                required: true,
                                message: '请输入资源表名',
                            }],
                        })(
                            <Input placeholder="请输入资源表名" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否必须">
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否显示">
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" ref="commit" htmlType="submit" />
                    </FormItem>

                </Modal>
            </Form>
        );
    }
}

export default  Form.create()(ResFieldAdd);