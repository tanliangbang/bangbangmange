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

class Index extends Component {
	constructor(props) {
		super(props);
	}

    componentDidMount(){
		window.document.getElementById("app-loading").style.display="none";
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
