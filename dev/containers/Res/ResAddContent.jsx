import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table,Form, Input,Divider, Icon, Button,message,DatePicker,TimePicker,Switch} from 'antd';
import * as resAction from '../../actions/res';
import { Tool } from '../../utils/Tool';
import UploadImg from '../../Components/Common/UploadImg';
import moment from 'moment';
const FormItem = Form.Item;


export class ResAddContent extends React.Component {
    constructor(props) {
        super(props);
        let id = this.props.router.query.id;
        let type = this.props.router.query.type;
        this.state = {
            id:id,
            type:type,
            textarea:[]
        }
    }

    componentWillMount(){
        let id = this.state.id;
        let _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getResDetail(id,resolve,reject);
        }).then(function(res){
            let resDetail = _this.props.resDetail;
            let type_specification = JSON.parse(resDetail.type_specification);
            for(let item in type_specification){
                if(type_specification[item].dataType==="textarea"){
                    UE.getEditor(item);
                }
            }
        }).catch(function(reason){
        });
    }
    componentDidMount(){

    }



    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
               console.log(values)
            }
        });
    }


    uploadCallback(titleName,response){
        var obj = {};
         obj[titleName] = response
         this.props.form.setFieldsValue(obj)
    }



    dealField(type_specification){
        var tempArr = [];
        var value = null;
        for(let item in type_specification){
            value = type_specification[item];
            value["my-title"] = item;
            tempArr.push(value);
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
            return (
                <FormItem {...formItemLayout} label={item.dataChinaName} key={key}>
                    {getFieldDecorator(item["my-title"], {
                        rules:rules
                    })(
                        <div>
                            <Input className="none"/>
                            <UploadImg uploadCallback={this.uploadCallback.bind(this,item["my-title"])}  />
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
                        <div  type="text/plain" style={{width:"100%",height:"800px"}}></div>
                    )}
                </FormItem>
            )
        }









    }


    render() {


        const {resDetail} = this.props;
        if(resDetail===null) return <div></div>;
        let type_specification = JSON.parse(resDetail.type_specification);
        let filedList = this.dealField(type_specification);
        let _this = this;
        return (
            <div className="res-add-content">
                <div className="common-title">添加资源</div>
                <form className="resAddContentForm" onSubmit={this.handleSubmit.bind(this)}>
                    {
                        filedList.map(function (item,key) {
                            return _this.dealType(item,key);
                        })
                    }

                    <div className="text-center">
                        <Button type="primary" className="main-btn"  htmlType="submit" >添 加</Button>
                    </div>
                </form>

            </div>
        );
    }
}




export default  Form.create({})(
     connect((state)=>{
        return {
            router:state.routing.locationBeforeTransitions,
            resDetail:state.res.resDetail
        }
    }, (dispatch)=>{
        const allAction =Object.assign(resAction);
        return {
            actions: bindActionCreators(allAction, dispatch)
        }
    })(ResAddContent));