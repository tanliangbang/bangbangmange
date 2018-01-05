import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute} from 'react-router' // 路由

//index为入口
import App from './containers/App';
import Login from './containers/Login';
import Index from './containers/Index';
import ResContentList from './containers/Res/ResContentList';

export const routes = {
	path: '/',
	component: App,
	indexRoute: {component: Index},
	childRoutes: [{
		component: Index,
		childRoutes: [{
			path: 'ResContentList',
			component: ResContentList,
		}]
	},{
		path: 'login',
		component: Login
	}]
}

class Routers extends Component {
	render() {
		return (
			<Router history={this.props.history} routes={routes}>

			</Router>
		);
	}
}

export default Routers;