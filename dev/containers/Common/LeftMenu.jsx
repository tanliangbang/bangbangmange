import React, { Component, PropTypes } from 'react'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as resAction from '../../actions/res.jsx';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export class leftMenu extends Component {

    constructor(props) {
        super(props);
        this.rootSubmenuKeys = ['sub1', 'sub3'];
        this.state = {
            openKeys: ['sub1'],
        };

        var _this = this;
        new Promise(function(resolve,reject){
            _this.props.actions.getResList(resolve,reject);
        }).then(function(){

        })

    }


    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }


    render() {
        const{res} = this.props
        if(res.length<=0){
            return<div></div>;
        }
        return (
               <div className="leftMenu">
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"  openKeys={this.state.openKeys}
                              onOpenChange={this.onOpenChange.bind(this)} >
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
                                <Menu.Item key={res.length+1}><Link  to={{ pathname: '/resAdd'}}>添加资源</Link></Menu.Item>
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
