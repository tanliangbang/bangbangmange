import './index.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Input, Button,Switch,message,Select} from 'antd';
import {browserHistory} from "react-router";
import * as articleAction from '../../actions/article.jsx';
import UploadImg from '../../Components/Common/UploadImg.jsx';
import axios from "axios";
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

export class AddArticle extends React.Component {
    constructor(props) {
        super(props);
        let currId = this.props.myrouter.query.id;
        this.state = {
            commiting:false,
            currId:currId,
            contentId: null,
            typeList:[],
            oldTypeId:null
        }
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
    }

    componentDidMount(){
        let currId = this.state.currId
        let _this = this;
        if(currId){
            new Promise(function(resolve,reject){
                _this.props.actions.getArticleDetailById(currId,resolve,reject)
            }).then(function(res){
                var obj = {}
                obj['title'] = res['title']
                obj['breif'] = res['breif']
                obj['wherefrom'] = res['wherefrom']
                obj['seo_keys'] = res['seo_keys']
                obj['label'] = res['label']
                obj['is_show'] = res['is_show']==1?true : false
                obj['typeId'] = res['typeId']
                obj['content'] = res['content']
                if(res['imgUrl']){
                    if(_this.refs["art-imgUrl"]){
                        _this.refs["art-imgUrl"].setImgUrl(res['imgUrl']);
                    }
                }
                obj['imgUrl'] = res['imgUrl']
                _this.setState({
                    contentId: res['contentId'],
                    oldTypeId:res['typeId']
                })
                _this.initEditor(res['content'])
                _this.props.form.setFieldsValue(obj)
            }).catch(function(reason){
            });
        } else {
            this.initEditor ('')
        }
    }

    initEditor (content) {
        let editor = editormd("content", {
            width: "100%",
            height: 740,
            path: "./assets/plugins/editor.md-master/lib/",
            // theme: "dark",
            // editorTheme: "pastel-on-dark",
            codeFold: true,
            //syncScrolling : false,
            saveHTMLToTextarea: true,    // 保存 HTML 到 Textarea
            searchReplace: true,
            //watch : false,                // 关闭实时预览
            htmlDecode: "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
            //toolbar  : false,             //关闭工具栏
            //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
            emoji: true,
            taskList: true,
            tocm: true,         // Using [TOCM]
            tex: true,                   // 开启科学公式TeX语言支持，默认关闭
            flowChart: true,             // 开启流程图支持，默认关闭
            sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
            //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
            //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
            //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
            //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
            //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
            imageUpload: true,
            imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL: "./api/upload/uploadImg",
            onload: function () {
                editor.setMarkdown(content)
            },
        })
        this.setState({
            editor:editor
        })
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
                values['is_show'] = values['is_show'] ? 1 : 0
                values['content']=this.state.editor.getHTML()
                _this.setState({
                    commiting:true
                })
                if(currId!==undefined){
                    values.id = currId;
                }
                if(_this.state.oldTypeId!==null){
                    values.oldTypeId = _this.state.oldTypeId;
                }
                values.contentId = _this.state.contentId
                let typeList = _this.state.typeList;
                for (let i = 0; i< typeList.length; i++) {
                   if(values.typeId === typeList[i].id) {
                       values.typeName = typeList[i].content.name
                   }
                }
                new Promise(function(resolve,reject){
                    _this.props.actions.addOrEditorArticle(values,resolve,reject);
                }).then(function(){
                    _this.setState({
                        commiting:false,
                    })
                    _this.success("操作成功");
                    if (_this.props.preUrl) {
                        browserHistory.push(_this.props.preUrl);
                    }else {
                        browserHistory.push("/articleList");
                    }

                }).catch(function(reason){
                    _this.setState({
                        commiting:false
                    })
                    _this.error("操作失败");
                });
            }
        })
    }

    uploadCallback(titleName,response){
        var obj = {};
        obj[titleName] = response
        this.props.form.setFieldsValue(obj)
    }

    success(text) {
        message.success(text);
    }

    error(text){
        message.error(text);
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 24 }
        };
        const { getFieldDecorator } = this.props.form;
        const {commiting,currId,typeList} = this.state;
        let plainOptions = [];
        for (let i = 0; i < typeList.length; i++) {
            plainOptions.push(<Option key={i} value={typeList[i].id}>{typeList[i].content.name}</Option>);
        }
        return (
            <div className="addArticle">
                <Form ref="form" onSubmit={this.handleSubmit.bind(this)} >
                    <div className="my-common-title">添加资源</div>
                    <div className="resTitle">
                        <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    message: '请输入标题',
                                }],
                            })(
                                <Input placeholder="请输入标题" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="简介">
                            {getFieldDecorator('breif', {
                                rules: [{
                                    required: true,
                                    message: '请输入简介'
                                }],
                            })(
                                <TextArea rows={4} placeholder="请输入简介"></TextArea>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="来源">
                            {getFieldDecorator('wherefrom', {
                                rules: [{
                                    required: true,
                                    message: '请输入来源'
                                }],
                            })(
                                <Input placeholder="请输入来源" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="关键词">
                            {getFieldDecorator('seo_keys', {
                                rules: [{
                                    required: false,
                                    message: '关键词'
                                }],
                            })(
                                <Input placeholder="请输入来源" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="配图" >
                            {getFieldDecorator('imgUrl', {
                            })(
                                <div>
                                    <Input className="none"/>
                                    <UploadImg  ref="art-imgUrl" uploadCallback={this.uploadCallback.bind(this,'imgUrl')}  />
                                </div>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='是否显示' >
                            {getFieldDecorator('is_show', {
                                valuePropName: 'checked',
                                initialValue:true
                            })(
                                <Switch  checkedChildren="是"  unCheckedChildren="否"  />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='标签' >
                            {getFieldDecorator('label', {
                            })(
                                <Input placeholder="请输入标签" />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='文章类型' >
                            {getFieldDecorator('typeId', {
                                rules: [{
                                    required: true,
                                    message: '请选择文章类型'
                                }],
                            })(
                                <Select placeholder="--请选择--" >
                                    {plainOptions}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem {...formTextareaLayout} label='文章内容'>
                            {getFieldDecorator('content', {
                            })(
                                <div></div>
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




export default Form.create({})(connect((state)=>{
  return {
      myrouter:state.routing.locationBeforeTransitions,
      preUrl:state.article.preUrl
  }
}, (dispatch)=>{
  const allAction =Object.assign(articleAction);
  return {
      actions: bindActionCreators(allAction, dispatch)
  }
})(AddArticle));