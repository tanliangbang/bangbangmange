import './style.scss'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import * as projectAction from '../../actions/project';
import { Tool, merged } from '../../Tool';
import Tabs  from './../../Plugs/Tabs';


export class ProductDetail extends Component {
    constructor(props) {
        super(props);
        var id = Tool.getQueryString(this.props.location.search,"id");
        this.props.actions.getProductDetail(id);
    }
    componentWillMount() {
    }

  render() {
      const {productDetail} = this.props;
      console.log(productDetail.details)
      var tabsData = {
          className : 'modelTableOpear',
          defaultVal : 0,
          animate : true,
          callBack: function(index,title){ //切换后的回调函数
          }
      }

      if(productDetail.id==undefined){
          return <div></div>;
      }else{
          return (
              <div className="productDetail" >
                     <div className="basicField">
                         <p>{(productDetail.summary)[0].content}</p>
                         <div><span>项目编号:{productDetail.id}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{productDetail.published_date.split(" ")[0]}</span></div>
                         <p>规模：{(productDetail.summary)[1].content}</p>
                         <p>期限：{(productDetail.summary)[2].content}</p>
                         <p>利率：{(productDetail.summary)[3].content}</p>
                         <p>评级：{(productDetail.summary)[4].content}</p>
                         <p>增信：{(productDetail.summary)[5].content}</p>
                         <p>用途：{(productDetail.summary)[6].content}</p>
                     </div>

                   <div>
                       <Tabs {...tabsData}>
                           {
                               productDetail.details.map((item, i) => {
                                   return (
                                       <div className="fileListContent" key={i} title={item.name}>
                                           {
                                               item.value.map((item, j) => {
                                                   return (
                                                      <div key = {j}>
                                                          <p className="fileTypeTitle">{item.name}</p>
                                                            {
                                                                  item.value.map((item, k) => {
                                                                      return (
                                                                          <a key={k}  target="_blank" href={item.url}>{item.name}&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}<br/></a>
                                                                      )
                                                                  })
                                                              }
                                                      </div>

                                                   )
                                               })
                                           }
                                       </div>
                                   )
                               })
                           }

                       </Tabs>

                   </div>



              </div>
          );
      }
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
})(ProductDetail);