import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute} from 'react-router' // 路由

//index为入口
import App from './containers/App';
import Login from './containers/Login';
import Index from './containers/Index';
import ResContentList from './containers/Res/ResContentList';
import ResAdd from './containers/Res/ResAdd';

export const routes = {
	path: '/',
	component: App,
	indexRoute: {component: Index},
	childRoutes: [{
		component: Index,
		childRoutes: [{
			path: 'ResContentList',
			component: ResContentList,
		},{
			path: 'resAdd',
			component: ResAdd,
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