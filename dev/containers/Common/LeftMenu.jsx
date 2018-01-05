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
        const{res} = this.props
        if(res.length<=0){
            return<div></div>;
        }
        return (
               <div className="leftMenu">
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
                            <SubMenu key="sub1" title={<span><Icon type="database" /><span>资源管理</span></span>}>
                                <SubMenu key="sub2" title={<span>资源列表</span>}>
                                    {
                                        res.map((item, k) => {
                                            return (
                                                <Menu.Item key={k}> <Link  to={{ pathname: '/resContentList', query: { type: item.name,id:item.id } }}>{item.cname}</Link></Menu.Item>
                                            )
                                        })
                                    }

                                </SubMenu>
                                <Menu.Item key={res.length+1}>添加资源</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" title={<span><Icon type="profile"  /><span>文章管理</span></span>}>
                                <Menu.Item key={res.length+2}>文章列表</Menu.Item>
                                <Menu.Item key={res.length+3}>添加文章</Menu.Item>
                            </SubMenu>
                        </Menu>
               </div>
        );
    }
}


export default  connect((state)=>{
    return {
        res:state.res.resList
    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(leftMenu);
