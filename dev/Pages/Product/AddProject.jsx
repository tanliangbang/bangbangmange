import './style.scss'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';

import Tabs  from './../../Plugs/Tabs';
import * as projectAction from '../../actions/project';
import UploadFileds  from '../../containers/Common/UploadFileds';
import { Tool, merged } from '../../Tool';


export class AddProject extends Component {
    constructor(props) {
        super(props);
        var id = Tool.getQueryString(this.props.location.search,"id");
        var fileFieldType = [
            {"name":"融资主体详情",
                "value":[
                    {"name":"审计报表","value":[]},
                    {"name":"最新报表","value":[]},
                    {"name":"公司章程","value":[]},
                    {"name":"评级报告","value":[]},
                    {"name":"公司简介","value":[]},
                ],
            }, {"name":"股东详情",
                "value":[
                    {"name":"审计报表","value":[]},
                    {"name":"最新报表","value":[]},
                    {"name":"公司章程","value":[]},
                    {"name":"评级报告","value":[]},
                    {"name":"公司简介","value":[]},
                ],
            }, {"name":"增信方式",
                "value":[
                    {"name":"审计报表","value":[]},
                    {"name":"最新报表","value":[]},
                    {"name":"公司章程","value":[]},
                    {"name":"评级报告","value":[]},
                    {"name":"公司简介","value":[]},
                ],
            }
        ]

        if(id){
            this.props.actions.getProductDetail(id);
            this.state = {
                isShowAddBasicField:false,
                currUploadTypeTitle:null,
                currUploadContentTitle:null,
                mask:false,
                basicField:[],
                fileFieldType:fileFieldType,
                id:id
            }
        }else{
            this.state = {
                isShowAddBasicField:false,
                currUploadTypeTitle:null,
                currUploadContentTitle:null,
                mask:false,
                basicField:[
                    {"name":"项目名称","content":"","type":"projectName"},
                    {"name":"融资主体","content":"","type":"subject"},
                    {"name":"融资规模","content":"","type":"scale"},
                    {"name":"融资期限","content":"","type":"term"},
                    {"name":"融资利率","content":"","type":"rate"},
                    {"name":"主体评级","content":"","type":"grade"},
                    {"name":"增信方式","content":"","type":"increaseWay"},
                    {"name":"融资用途","content":"","type":"purpose"}
                ],
                fileFieldType:fileFieldType
            }
        }


    }


    componentDidMount(){
        //引入Plupload 、qiniu.js后
        var that = this;
        var node = "";
        Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: 'uploadBtn',       //上传选择的点选按钮，**必需**
            uptoken_url: '/api/v1/bond/upload_token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            domain: 'http://file.niustock.com/',   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
            max_file_size: '1024mb',           //最大文件体积限制
            max_retries: 1,                   //上传失败最大重试次数
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'FilesAdded': function(up, files) {
                    node = that.state.currClickNode;
                },
                'BeforeUpload': function(up, file) {
                    node.nextSibling.style.display="inLine-block"
                },
                'UploadProgress': function(up, file) {
                    node.nextSibling.firstChild.style.width=(up.total.loaded/up.total.size)*100+"%"
                },
                'FileUploaded': function(up, file, info) {
                    var domain = up.getOption('domain');
                    var res = JSON.parse(info.response);
                    var sourceLink = domain + res.key;
                    var fileSize = Tool.dealFileSize(file.size)
                    var upLoadedContent = {"url":sourceLink,"name":file.name,"size":fileSize}
                    var tempContent = that.state.fileFieldType
                    that.addFileContent(tempContent,upLoadedContent,that.state.currUploadTypeTitle,that.state.currUploadContentTitle)
                    that.setState({

                    })
                },
                'Error': function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                },
                'UploadComplete': function() {
                    node.nextSibling.style.display="none"
                    node.nextSibling.firstChild.style.width = "0px"
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var key = "";
                    return key
                }
            }
        });
    }

    addFileContent(tempContent,upLoadedContent,currUploadTypeTitle,currUploadContentTitle){
          for(var i=0;i<tempContent.length;i++){
              if(tempContent[i].name==currUploadTypeTitle){
                   for(var j=0;j<tempContent[i].value.length;j++){
                       if(tempContent[i].value[j].name==currUploadContentTitle){
                           tempContent[i].value[j].value.push(upLoadedContent)
                       }
                   }
              }
          }
        return tempContent;
    }

    uploadFn(fileTypeTitle,contentTitle,currClickNode){
        this.setState({
            currUploadTypeTitle:fileTypeTitle,
            currUploadContentTitle:contentTitle,
            currClickNode:currClickNode
        })
        this.refs.upBtn.click()
    }


    showAddBasicField(){
        this.setState({
            isShowAddBasicField:true
        })
    }
    addBasicField(){
        var basicFieldTitle = this.refs.basicFieldTitle.value;
        if(basicFieldTitle==""){
            alert("添加名称");
            return;
        }
        this.state.basicField.push({"name":basicFieldTitle,"content":"",type:"other"});
        console.log(this.state.basicField)
        this.setState({
            basicField:this.state.basicField,
            isShowAddBasicField:false
        })
        this.refs.basicFieldTitle.value = "";

    }

    closeMaskFn(){
        this.setState({
            mask: false
        })
    }
    addFileProjectFn(){
        var value = this.refs.titleInput.value;
        if(value==""){
            alert("请输入标题");
            return;
        }
       this.state.fileFieldType.push({"name":value,
           "value":[
               {"name":"审计报表","value":[]},
               {"name":"最新报表","value":[]},
               {"name":"公司章程","value":[]},
               {"name":"评级报告","value":[]},
               {"name":"公司简介","value":[]},
           ],
       })
        this.setState({
            fileFieldType:this.state.fileFieldType,
            mask:false
        })
        this.refs.titleInput.value = ""
    }


    addFileTypeContentFn(typeName,contentName){
         var fileFieldType = this.state.fileFieldType;
            for(var i=0;i<fileFieldType.length;i++){
                if(fileFieldType[i].name==typeName){
                    fileFieldType[i].value.push( {"name":contentName,"value":[]})
                    this.setState({
                        fileFieldType:fileFieldType
                    })
                }
            }
    }

    addBasicFieldContent(data,e){
        var basicField = this.state.basicField;
        var value = e.target.value;
        for(var i=0;i<basicField.length;i++){
            if(basicField[i].name==data){
                basicField[i].content = value;
                this.setState({
                    basicField:basicField
                });
                return;
            }
        }


    }
    callback(isSuccess,msg){
       if(isSuccess){
           alert(msg);
           browserHistory.push("index");
       }else{
           alert(msg);
       }
    }

    save(id){
        this.props.actions.addProject(this.state.basicField,this.state.fileFieldType,id,this.callback)
    }

  render() {
      const {mask,isShowAddBasicField} = this.state
      var basicField = this.state.basicField;
      var fileFieldType = this.state.fileFieldType;
      var productDetail = this.props.productDetail
      if(productDetail.id!=undefined){
         this.state.basicField= basicField = productDetail.summary;
          this.state.fileFieldType = fileFieldType = productDetail.details;

      }

      var that = this;
      var tabsData = {
          className : 'modelTableOpear',
          defaultVal : 0,
          animate : true,
          callBack: function(index,title){ //切换后的回调函数
              if(title=="+新增详情"){
                  that.setState({
                      mask: true
                  })
              }
          }
      }


    return (
        <div className="addProject" >
            <div className={mask?"Mask":"Mask none"}></div>
            <div className={mask?"MaskContent":"MaskContent none"}>
                  <div className="mcTitle">新增详情</div>
                     <div className="mcContent">
                         <span>标题：</span><input ref="titleInput" type="text"/>
                     </div>
                    <div className="optBtn">
                        <a onClick={this.closeMaskFn.bind(this)}>取消</a><a onClick={this.addFileProjectFn.bind(this)}>保存</a>
                    </div>
            </div>

            <div className="top">
                新增项目
            </div>

            <div className="basicField">
                <div>
                    <span>基本参数</span>
                </div>
                <div className="field">
                    {
                        basicField.map((item, key) => {
                            return (
                                <div key={key}>
                                    <span className="fTitle">{item.name}:</span><input defaultValue={item.content} onBlur={this.addBasicFieldContent.bind(this,item.name)}  className="fContent" type="text"/>
                                </div>
                            )
                        })
                    }


                     <div className={isShowAddBasicField?"":"none"}>
                             <input className="fTitleIpt" ref="basicFieldTitle" type="text"/><input  className="fContent" type="text"/><input className="addBasicFieldBtn" onClick={this.addBasicField.bind(this)} type="button" value="确定"/>
                     </div>
                    <a className="addBasicFieldeBtn" onClick={this.showAddBasicField.bind(this)}>新增基本参数</a>

                </div>
            </div>

            <div className="fileField">
                <input type="hidden" ref="upBtn"  id = "uploadBtn" value="上传"/>

                <Tabs {...tabsData}>


                    {
                        fileFieldType.map((item, key) => {
                            return (
                                <div key={key} title={item.name}>
                                   <UploadFileds uploadFn={this.uploadFn.bind(this)} addFileTypeContentFn={this.addFileTypeContentFn.bind(this)} fileData={item} action={this.props.actions} />
                                </div>
                            )
                        })
                    }
                    <div title="+新增详情"  className='communityList'>
                    </div>
                </Tabs>
            </div>

            <a className={this.state.id?"none":"save"} onClick={this.save.bind(this,null)}>添&nbsp;&nbsp;加</a>
            <a className={this.state.id?"save":"none"} onClick={this.save.bind(this,this.state.id)}>保&nbsp;&nbsp;存</a>

        </div>

    );
  }
};


export default  connect((state)=>{
    return {
        path: state.routing.locationBeforeTransitions.pathname,
        productDetail:state.product.productDetail

    }
}, (dispatch)=>{
    const allAction =Object.assign({},projectAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(AddProject);


