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



    handleCancel(){
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
                this.props.addFieldFn(values)
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
        const { visible, confirmLoading, ModalText } = this.state;
        return (
                <Modal title="添加字段" visible={visible} onCancel={this.handleCancel.bind(this)} footer = {null}>
                    <Form ref="form" onSubmit={this.handleSubmit.bind(this)} className="resAddFieldForm">

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
                        {getFieldDecorator('dataIsNeed', {
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={true} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否显示">
                        {getFieldDecorator('isShow', {
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={true} />
                        )}
                    </FormItem>
                        <div className="text-center">
                            <Button type="primary" ref="commit" htmlType="submit" >添 加</Button>
                        </div>
                    </Form>

                </Modal>
        );
    }
}

export default  Form.create()(ResFieldAdd);