import './style.scss'
import React, { Component } from 'react'

export default class Tabs extends Component{
    constructor(props) {
        super(props);
        this.showCurrContent = this.showCurrContent.bind(this)
        this.state = {
            defaultVal : this.props.defaultVal
        }
    }

    callBack (index,name){
        if(this.props.callBack != undefined){
            this.props.callBack(index,name);
        }
    }


    showCurrContent(e){
        var index = e.currentTarget.dataset.index
        var content = e.currentTarget.dataset.content
        if(content=="+新增详情"){
            this.callBack(index,content);
            return;
        }
        this.setState({
            defaultVal : index
        });
        setTimeout(function(){
            //点击后的回调
            this.callBack(index,content);
        }.bind(this),0);
    }

    analysisChildrens(children){
        var temp =[]
        children.map(function(elem,index) {
            if(elem.length){
                elem.map(function(currItem,index) {
                    temp.push(currItem)
                })
            }else{
                temp.push(elem)
            }
        })
        return temp;
    }

    theader(){
         var arr = []
         var childs = this.analysisChildrens(this.props.children)
        childs.map(function(elem,index) {
            arr.push(<li onClick={this.showCurrContent}  data-index={index} data-content ={elem.props.title} className={index==this.state.defaultVal?'mt-tabs-active':''} key={index}><a>{elem.props.title}</a> </li>)
        }.bind(this))

        return arr
    }
    tbody(){
        var arr = [];
        var childs = this.analysisChildrens(this.props.children)
        childs.map(function(elem,index) {
            arr.push(<div className={index==this.state.defaultVal?'':'content-hidden'} key={index}>{elem} </div>)
        }.bind(this))

        return arr
    }

    render() {
        var animate = ' mt-tabs-animate';
        if(!this.props.animate){
            animate="";
        }
        return(
            <div className={"myTabs " + this.props.className} >
                <ul className="myTabs-header">
                    {this.theader()}
                </ul>
                <div className={"myTabs-content" +animate}>
                    {this.tbody()}
                </div>
            </div>
        )
    }
}
