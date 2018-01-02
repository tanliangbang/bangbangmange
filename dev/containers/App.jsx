/**
* 整个项目的入口
* @author : tanliangbang
* @date : 2017-12-28
*/
import React ,{Component} from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class App extends Component {
	constructor(props) {
		super(props);
	}
  render() {
			return (
				<div className="app">
					{this.props.children}
				</div>
			);

  }
}

export default App;
