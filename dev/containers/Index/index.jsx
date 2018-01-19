/**
*
* @author : tanliangbang
* @date : 2017-12-28
*/
import './../../style/style.scss'
import './style.scss'
import React ,{Component} from 'react'
import Menu from './../Common/Menu.jsx'
import LeftMenu from './../Common/LeftMenu.jsx'
import {Spin } from 'antd';

class Index extends Component {
	constructor(props) {
		super(props);
		this.state={
			loading:false
		}
    }

    componentDidMount(){
        window.document.getElementById("app-loading").style.display="none";
    }

	hideLoading(){
		this.setState({
			loading:false
		})
	}

	showLoading(){
        this.setState({
            loading:true
        })
	}



  render() {
			return (
				<div className="index">
					<header>
						<Menu />
					</header>
					<section>
						<aside><LeftMenu/></aside>
						<article>
                            <Spin spinning={this.state.loading} >
							    {this.props.children && React.cloneElement(this.props.children, {
                                    hideLoading: this.hideLoading.bind(this),
                                    showLoading: this.showLoading.bind(this)
                                })}
							</Spin>
						</article>
					</section>
				</div>
			);

  }
}

export default Index;
