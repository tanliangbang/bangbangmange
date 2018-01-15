import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox , Icon, Input, Button,Form,message } from 'antd';
import axios  from 'axios';
import {Tool}  from '../../utils/Tool.jsx';
import { browserHistory } from 'react-router';

const FormItem = Form.Item;


export class Login extends Component {
    constructor(props) {

        super(props);

    }


    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let username = values.username;
                let password = Tool.hex_md5(values.password)
                axios.post("/api/users/login",{username:username,password:password}).then(function (res) {
                    let data = res.data;
                    console.log(data)
                    if(data.data===null||data.statusCode==500||data.data.username!="tanliangbang"){
                        message.error("用户名密码错误")
                    }else{
                        Tool.localItem("userInfo","tanliangbang");
                        message.success("登入成功");
                        browserHistory.push("/")
                    }
                }).catch(function (response) {
                    console.log("登入失败")
                });
            }
        });
    }


    render() {

        const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <p>登&nbsp;&nbsp;入</p>
                    <div>
                        <FormItem {...formItemLayout}>
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true,
                                    message: '请输入用户名',
                                }],
                            })(
                                <Input prefix={<Icon type="user"  style={{fontSize: 20,marginRight:10, color: 'rgba(0,0,0,.25)' }} />} defaultValue=""  size="large"  placeholder="请输入用户名"/>)}
                        </FormItem>
                    </div>
                    <div>
                        <FormItem {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: '请输入用户名',
                                }],
                            })(
                                <Input prefix={<Icon type="lock"  style={{ fontSize: 20,marginRight:10,color: 'rgba(0,0,0,.25)' }}  />} defaultValue="" size="large"  type="password" placeholder="请输入密码"/>)}
                        </FormItem>
                    </div>
                    <div>
                        <Checkbox  />记住密码
                        <a>忘记密码</a>
                    </div>
                    <Button  type="primary" htmlType="submit">登&nbsp;&nbsp;入</Button>
                </Form>
            </div>
        );
    }
};



export default Form.create({})(
    connect((state)=>{
        return {
        }
    }, (dispatch)=>{
        const allAction =Object.assign({});
        return {
            actions: bindActionCreators(allAction)
        }
    })(Login)
);