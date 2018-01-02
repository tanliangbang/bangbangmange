/**
*
* @author : tanliangbang
* @date : 2017-12-28
*/
import './style.scss'
import React ,{Component} from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Menu from './../Common/Menu'
import Footer from './../Common/Footer'
import LeftMenu from './../Common/LeftMenu'

class Index extends Component {
	constructor(props) {
		super(props);
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
							{this.props.children}
						</article>
					</section>


				</div>
			);

  }
}

export default Index;
