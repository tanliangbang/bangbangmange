import React, { Component, PropTypes } from 'react'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as resAction from '../../actions/res';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export class leftMenu extends Component {

    constructor(props) {
        super(props);
        this.props.actions.getResList();
    }


    render() {
        return (
               <div className="leftMenu">
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
                            <SubMenu key="sub1" title={<span><Icon type="database" /><span>资源管理</span></span>}>
                                <SubMenu key="sub2" title={<span>资源列表</span>}>
                                    <Menu.Item key="2">前端资源</Menu.Item>
                                    <Menu.Item key="3">后端资源</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="4">添加资源</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" title={<span><Icon type="profile"  /><span>文章管理</span></span>}>
                                <Menu.Item key="5">文章列表</Menu.Item>
                                <Menu.Item key="6">添加文章</Menu.Item>
                            </SubMenu>
                        </Menu>
               </div>
        );
    }
}


export default  connect((state)=>{
    return {
    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(leftMenu);
