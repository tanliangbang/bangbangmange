import './style.scss'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import * as projectAction from '../../actions/project';


export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.props.actions.getProductList();
    }
    componentWillMount() {
    }

    delProduct(id){
        this.props.actions.delProduct(id)
    }

  render() {
    return (
        <div className="index" >
            <div>
                <div className="productListTitle">
                    项目列表  <a href="addProject">添加项目</a>
                </div>
                <table className="productList">
                    <thead>
                    <tr>
                        <th width="20">项目名称</th>
                        <th width="10%">融资主体</th>
                        <th width="5%">规模</th>
                        <th width="5%">期限</th>
                        <th width="5%">利率</th>
                        <th width="10%">评级</th>
                        <th width="10%">增信方式</th>
                        <th width="10%">用途</th>
                        <th width="5%">项目状态</th>
                        <th width="10%">发布时间</th>
                        <th width="10%">操作</th>

                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.props.productList.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <td width="20%" >
                                        <Link to={{pathname:`/productDetail`,query:{id:item.id}}}> {(item.summary)[0].content}</Link>
                                    </td>
                                    <td width="10%" >{(item.summary)[1].content}</td>
                                    <td width="5%">{(item.summary)[2].content}</td>
                                    <td width="5%" >{(item.summary)[3].content}</td>
                                    <td width="5%" >{(item.summary)[4].content}</td>
                                    <td width="10%" >{(item.summary)[5].content}</td>
                                    <td width="10%" >{(item.summary)[6].content}</td>
                                    <td width="10%" >{(item.summary)[7].content}</td>
                                    <td width="5%" >{item.status=="online"?"融资中":"融资结束"}</td>
                                    <td width="10%" >{item.published_date}</td>
                                    <td width="10%" > <Link to={{pathname:`/addProject`,query:{id:item.id}}}> 修改</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={this.delProduct.bind(this,item.id)} className="del">删除</a></td>
                                </tr>
                            )
                        })
                    }


                    </tbody>

                </table>

            </div>
        </div>

    );
  }
};




export default  connect((state)=>{
    return {
        path: state.routing.locationBeforeTransitions.pathname,
        productList:state.product.productList
    }
}, (dispatch)=>{
    const allAction =Object.assign({},projectAction);
    return {
        actions: bindActionCreators(allAction, dispatch)
    }
})(ProductList);