import React, { Component, PropTypes } from 'react'

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as resAction from '../../actions/res.jsx';
import * as plateAction from '../../actions/plate.jsx';

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
        new Promise(function(resolve,reject){
            _this.props.actions.getPlateAndResList(resolve,reject);
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
        const{res, plateAndResList} = this.props
        let tempNum = 0;
        for(let i=0;i<plateAndResList.length; i++) {
            for(let j=0; j<plateAndResList[i].res.length; j++){
                plateAndResList[i].res[j]['m_num'] = tempNum++;
            }
        }
        if(res.length<=0){
            return<div></div>;
        }
        return (
               <div className="leftMenu">
                   <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"  openKeys={this.state.openKeys}
                         onOpenChange={this.onOpenChange.bind(this)} >
                       <SubMenu key="sub1" title={<span><Icon type="home" /><span>首页</span></span>}>
                           <Menu.Item key="1">
                               <Link  to='/'> 首页</Link>
                           </Menu.Item>
                       </SubMenu>

                       <SubMenu key="sub2" title={<span><Icon type="profile"  /><span>文章管理</span></span>}>
                           <Menu.Item key='2'><Link  to={{ pathname: '/articleList' }}>文章列表</Link></Menu.Item>
                           <Menu.Item key='3'><Link  to={{ pathname: '/addArticle' }}>添加文章</Link></Menu.Item>
                       </SubMenu>
                       <SubMenu key="sub3" title={<span><Icon type="profile"  /><span>评论管理</span></span>}>
                           <Menu.Item key='4'><Link  to={{ pathname: '/commentList' }}>评论列表</Link></Menu.Item>
                       </SubMenu>
                       <SubMenu key="sub4" title={<span><Icon type="profile"  /><span>模块管理</span></span>}>
                           <Menu.Item key='5'><Link  to={{ pathname: '/plateList' }}>模块列表</Link></Menu.Item>
                           <Menu.Item key='6'><Link  to={{ pathname: '/addplate' }}>添加模块</Link></Menu.Item>
                           <Menu.Item key='7'><Link  to={{ pathname: '/resAdd' }}>添加资源</Link></Menu.Item>
                       </SubMenu>

                       {
                           plateAndResList.map((plate, m) => {
                               return (
                                   <SubMenu key={m+5} title={<span><Icon type="profile"  /><span>{plate.detail}</span></span>}>
                                       {
                                           plate.res.map((item, k) => {
                                               return (
                                                   <Menu.Item key={parseInt(item['m_num'])+8}><Link to={{ pathname: '/resContentList',query:{id:item.id,type:item.name}}}>{item.cname}</Link></Menu.Item>
                                               )
                                           })
                                       }
                                   </SubMenu>
                               )
                           })
                       }

                   </Menu>
               </div>
        );
    }
}


export default  connect((state)=>{
    return {
        res:state.res.resList,
        plateAndResList: state.plate.plateAndResList
    }
}, (dispatch)=>{
    const allAction =Object.assign(resAction,plateAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(leftMenu);
