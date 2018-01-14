import './style.scss'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox , Icon, Input, Button } from 'antd';

export class Login extends Component {
    constructor(props) {

        super(props);

    }


    render() {
        return (
            <div className="login">
                <form >
                    <p>登&nbsp;&nbsp;入</p>
                    <div>
                        <Input prefix={<Icon type="user"  style={{fontSize: 20,marginRight:10, color: 'rgba(0,0,0,.25)' }} />} defaultValue=""  size="large"  placeholder="Username"/>
                    </div>
                    <div>
                        <Input prefix={<Icon type="lock"  style={{ fontSize: 20,marginRight:10,color: 'rgba(0,0,0,.25)' }}  />} defaultValue="" size="large"  type="password" placeholder="Username"/>
                    </div>
                    <div>
                        <Checkbox  />记住密码
                        <a>忘记密码</a>
                    </div>
                    <Button  type="primary" >登&nbsp;&nbsp;入</Button>
                </form>
            </div>
        );
    }
};



export default  connect((state)=>{
    return {
    }
}, (dispatch)=>{
    const allAction =Object.assign({});
    return {
        actions: bindActionCreators(allAction)
    }
})(Login);