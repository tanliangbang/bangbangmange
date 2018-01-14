import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table,Form, Input,Divider, Icon, Button,
    message,DatePicker,TimePicker,Switch,Select,Checkbox} from 'antd';
import * as resAction from '../../actions/res.jsx';
import { Tool } from '../../utils/Tool.jsx';
import UploadImg from '../../Components/Common/UploadImg.jsx';
import {browserHistory,withRouter } from "react-router";
import moment from 'moment';

require('./../../assets/plugins/ueditor/ueditor.config.js');
require('./../../assets/plugins/ueditor/ueditor.all.js');
require('./../../assets/plugins/ueditor/lang/zh-cn/zh-cn.js');

const FormItem = Form.Item;
const Option = Select.Option;


export class ResAddContent extends React.Component {
    constructor(props) {
        super(props);
        let id = this.props.myrouter.query.id;
        let type = this.props.myrouter.query.type;
        let resContentId = this.props.myrouter.query.resContentId;
        this.state = {
            id:id,
            type:type,
            resContentId:resContentId,
            textarea:[],
            fieldList:[],
            startValue: null,
            endValue: null,
            endOpen: false,
            commiting:false,
        }

    }

    routerWillLeave(nextLocation) {
        let fieldList = this.state.fieldList;
        for(let i=0;i<fieldList.length;i++){
            if(fieldList[i].dataType==="textarea"){
                UE.getEditor(fieldList[i]["my-title"]).destroy();
            }
        }
    }



    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    }

    componentWillMount(){
        let id = this.state.id;
        let resContentId = this.state.resContentId;
        let name = this.state.type
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getResDetail(id,resolve,reject);
        }).then(function(res){
            let resDetail = res;
            let type_specification = JSON.parse(resDetail.type_specification);
            let fieldList = _this.dealField(type_specification);
            _this.setState({
                fieldList:fieldList
            })
            if(resContentId){
                _this.getResContentDate(type_specification,resContentId,name)
            }
        }).catch(function(reason){
        });

    }
    getResContentDate(typeList,resContentId,name){
        console.log(resContentId)

        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getResContent(resContentId,name,resolve,reject);
        }).then(function(res){
            let isOnLine = res.isOnLine==1?true:false;
            let dateFormat = "'YYYY/MM/DD' HH:mm:ss";
            let startTime = Tool.formatDate2(res.startTime,"-");
            let endTime = Tool.formatDate2(res.endTime,"-");
            let content = {
                startTime:moment(startTime, dateFormat),
                endTime:moment(endTime, dateFormat),
                isOnLine:isOnLine
            }
            let fieldList = res.content;
            for(let item in typeList){
                if(typeList[item].dataType==="textarea"){
                        UE.getEditor(item).ready(function(){
                            UE.getEditor(item).setContent(fieldList[item],false);
                        })
                }else if(typeList[item].dataType==="boolean"){
                    content[item] = fieldList[item]==1?true:false
                }else if(typeList[item].dataType==="date"){
                    content[item] = moment(fieldList[item],dateFormat)
                }else if(typeList[item].dataType==="time"){
                    content[item] = moment(fieldList[item],"HH:mm:ss")
                }else{
                    content[item] = fieldList[item]
                }
            }

            _this.props.form.setFieldsValue(content)
        }).catch(function(reason){
        });
    }

    disabledStartDate (startValue) {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate (endValue) {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onStartChange(value){
        this.onChange('startValue', value);
    }

    onEndChange (value) {
        this.onChange('endValue', value);
    }

    handleStartOpenChange (open) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange (open) {
        this.setState({ endOpen: open });
    }






    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        let id = this.state.id;
        let type = this.state.type;
        this.props.form.validateFields((err, values) => {
            values["startTime"] = values["startTime"].format('X');
            values["endTime"] = values["endTime"].format('X');
            if (!err) {
                let fieldList = _this.state.fieldList;
                let value = "";
                 for(let i=0;i<fieldList.length;i++){
                     if(fieldList[i].dataType==="date"){
                         value = fieldList[i]["my-title"];
                         if(values[value]){
                             values[value] = values[value].format('YYYY-MM-DD HH:mm:ss')
                         }
                     }
                     if(fieldList[i].dataType==="time"){
                         value = fieldList[i]["my-title"];
                         if(values[value]){
                             values[value] = values[value].format('HH:mm:ss')
                         }
                     }
                     if(fieldList[i].dataType==="textarea"){
                         value = fieldList[i]["my-title"]
                         values[value]=UE.getEditor(value).getContent()
                     }
                     if(fieldList[i].dataType==="boolean"){
                         value = fieldList[i]["my-title"];
                         values[value]=values[value]?"1":"0"
                     }
                 }
                 let resContentId = this.state.resContentId;
                 this.setState({commiting:true})
                new Promise(function(resolve,reject){
                    _this.props.actions.addOrEditorResContent(values,type,resContentId,resolve,reject)
                }).then(function(){
                     message.success("操作成功")
                     browserHistory.push("resContentList?id="+id+"&type="+type)
                }).catch(function(reason){
                });

            }
        });
    }


    uploadCallback(titleName,response){
        var obj = {};
         obj[titleName] = response
         this.props.form.setFieldsValue(obj)
    }



    dealField(type_specification){
        let tempArr = [];
        let content = null;
        for(let item in type_specification){
            content = type_specification[item];
            content["my-title"] = item;
            tempArr.push(content);
            if(content.dataType==="textarea"){
                setTimeout(function(){
                    UE.getEditor(item)
                },10);
            }
        }
        return tempArr;
    }


    dealType(item,key){
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };
        const { getFieldDecorator } = this.props.form;
        var rules = [];

        if(item.dataType==="text"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请输入'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules: rules
                    })(
                        <Input placeholder={"请输入"+item.dataChinaName}/>
                    )}
                </FormItem>
            )
        }

        if(item.dataType==="date"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules: rules
                    })(
                        <DatePicker format={'YY-MM-DD HH:mm:ss'}  showTime={true} />
                    )}
                </FormItem>
            )
        }


        if(item.dataType==="time"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules: rules
                    })(
                        <TimePicker format={'HH:mm:ss'}  showTime={true} />
                    )}
                </FormItem>
            )
        }

        if(item.dataType==="boolean"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        valuePropName: 'checked',
                        initialValue:true
                    })(
                        <Switch  checkedChildren="是"  unCheckedChildren="否"  />
                    )}
                </FormItem>
            )
        }

        if(item.dataType==="file"){

            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            let imgUrl = this.props.form.getFieldValue(item["my-title"]);
            let _this = this;
            if(imgUrl){
                setTimeout(function(){
                   _this.refs[item["my-title"]+"-imgUrl"].setImgUrl(imgUrl);
               })
            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules:rules
                    })(
                        <div>
                            <Input className="none"/>
                            <UploadImg  ref={item["my-title"]+"-imgUrl"} uploadCallback={this.uploadCallback.bind(this,item["my-title"])}  />
                        </div>
                    )}
                </FormItem>
            )
        }

        if(item.dataType==="textarea"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: false,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            return (
                <FormItem {...formTextareaLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules:rules
                    })(
                        <div  type="text/plain" style={{width:"100%",height:"800px",position:"relative"}}></div>
                    )}
                </FormItem>
            )
        }

        if(item.dataType==="enum"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            let options = item.enumVal.split(",");
            let plainOptions = [];
            let value = "";
            for (let i = 0; i < options.length; i++) {
                if(options[i].split(":")[1]){
                    value = options[i].split(":")[1];
                }else{
                    value = options[i].split(":")[0];
                }
                plainOptions.push(<Checkbox key={i} value={value}>{options[i].split(":")[0]}</Checkbox>);

            }
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules:rules
                    })(
                        <Checkbox.Group >
                            {plainOptions}
                        </Checkbox.Group>
                    )}
                </FormItem>
            )
        }


        if(item.dataType==="select"){
            if(item.dataIsNeed==1){
                rules = [{
                    required: true,
                    message: '请选择'+item.dataChinaName,
                }]
            }else{
                rules = [];
            }
            let options = item.enumVal.split(",");
            let children = [];
            let optionValue = "";
            let optionName = "";
            for (let i = 0; i < options.length; i++) {
                optionName = options[i].split(":")[0];
                if(options[i].split(":")[1]){
                    optionValue = options[i].split(":")[1];
                }else{
                    optionName = options[i].split(":")[0];
                }
                children.push(<Option key={i} value= {optionValue} >{optionName}</Option>);
            }

            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules:rules
                    })(
                        <Select placeholder="--请选择--" >
                            {children}
                        </Select>
                    )}
                </FormItem>
            )
        }









    }


    render() {

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const { getFieldDecorator } = this.props.form;
        const {fieldList,startValue, endValue, endOpen,resContentId,commiting} = this.state;
        if(fieldList.length<=0) return <div></div>;
        let _this = this;
        return (
            <div className="res-add-content">
                <div className="common-title">添加资源</div>
                <form className="resAddContentForm" onSubmit={this.handleSubmit.bind(this)}>
                    {
                        fieldList.map(function (item,key) {
                            return _this.dealType(item,key);
                        })
                    }

                    <FormItem {...formItemLayout} label="是否上线" >
                        {getFieldDecorator("isOnLine", {
                            valuePropName: 'checked',
                            initialValue:true
                        })(
                            <Switch  checkedChildren="是"  unCheckedChildren="否"  />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="开始时间">
                        {getFieldDecorator("startTime", {
                            initialValue:startValue,
                            rules: [{
                                required: true,
                                message: '请选择开始时间',
                            }],
                        })(
                            <DatePicker
                                disabledDate={this.disabledStartDate.bind(this)}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="Start"
                                onChange={this.onStartChange.bind(this)}
                                onOpenChange={this.handleStartOpenChange.bind(this)}
                            />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="结束时间">
                        {getFieldDecorator("endTime", {
                            initialValue:endValue,
                            rules: [{
                                required: true,
                                message: '请输入结束时间',
                            }],
                        })(
                            <DatePicker
                                disabledDate={this.disabledEndDate.bind(this)}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="End"
                                onChange={this.onEndChange.bind(this)}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange.bind(this)}
                            />
                        )}
                    </FormItem>

                    <div className="text-center">
                        <Button type="primary"  loading={commiting}  htmlType="submit" >{resContentId?"修 改":"添 加"}</Button>
                    </div>
                </form>

            </div>
        );
    }
}



export default withRouter(Form.create({})(
     connect((state)=>{
        return {
            myrouter:state.routing.locationBeforeTransitions,
            resDetail:state.res.resDetail
        }
    }, (dispatch)=>{
        const allAction =Object.assign(resAction);
        return {
            actions: bindActionCreators(allAction, dispatch)
        }
    })(ResAddContent)));