import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'antd';


export class Mask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: '提示',
            visible: false,
            confirmLoading: false,
        }
    }

    showModal(text){
        this.setState({
            visible: true,
            ModalText:text
        });
    }
    handleOk(){
        if(this.props.callback){
            this.props.callback();
        }
        this.setState({
            visible: false,
        });
    }
    handleCancel(){
        this.setState({
            visible: false,
        });
    }


    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <div>
                <Modal title="提示"
                       visible={visible}
                       onOk={this.handleOk.bind(this)}
                       cancelText="取消"
                       okText="确定"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel.bind(this)}>
                    <p>{ModalText}</p>
                </Modal>
            </div>
        );
    }
}




export default  Mask;