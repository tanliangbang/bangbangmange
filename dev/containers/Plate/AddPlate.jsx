import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Input, Button,message} from 'antd';
import {browserHistory} from "react-router";
import * as plateAction from '../../actions/plate.jsx';

const FormItem = Form.Item;

export class AddPlate extends React.Component {
    constructor(props) {
        super(props);
        let currId = this.props.router.query.id;
        this.state = {
            commiting:false,
            currId:currId
        }
    }

    componentWillMount(){
        let currId = this.state.currId
        let _this = this;
        if(currId){
            new Promise(function(resolve,reject){
                _this.props.actions.getPlateDetailById(currId,resolve,reject)
            }).then(function(res){
                _this.props.form.setFieldsValue({name:res.name,detail:res.detail,type:res.type})
            }).catch(function(reason){
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        let currId = this.state.currId;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.setState({
                    commiting:true
                })
                if(currId!==undefined){
                    values.id = currId;
                }
                new Promise(function(resolve,reject){
                    _this.props.actions.addOrEditorPlate(values,resolve,reject);
                }).then(function(){
                    _this.setState({
                        commiting:false,
                    })
                    _this.success("操作成功");
                    browserHistory.push("/plateList");
                }).catch(function(reason){
                    _this.setState({
                        commiting:false
                    })
                    _this.error("操作失败");
                });
            }
        })
    }
    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 }
        };
        const { getFieldDecorator } = this.props.form;
        const {commiting,currId} = this.state;
        return (
            <div className="addPlate">
                <Form ref="form" onSubmit={this.handleSubmit.bind(this)} >
                    <div className="my-common-title">添加资源</div>
                    <div className="resTitle">
                        <FormItem {...formItemLayout} label="名称">
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    message: '请输入名称',
                                }],
                            })(
                                <Input placeholder="请输入名称" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator('type', {
                                rules: [{
                                    required: true,
                                    message: '请输入类型'
                                }],
                            })(
                                <Input placeholder="请输入类型" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述">
                            {getFieldDecorator('detail', {
                                rules: [{
                                    required: true,
                                    message: '请输入描述'
                                }],
                            })(
                                <Input placeholder="请输入描述" />
                            )}
                        </FormItem>

                    </div>
                    <div className="text-center mgt-10">
                        <Button type="primary" loading={commiting}   htmlType="submit" >{currId?"修 改":"添 加"}</Button>
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
        }
    }, (dispatch)=>{
        const allAction =Object.assign(plateAction);
        return {
            actions: bindActionCreators(allAction, dispatch)
        }
})(AddPlate));