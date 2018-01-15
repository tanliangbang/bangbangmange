import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute} from 'react-router' // 路由

//index为入口
import App from './containers/App.jsx';
import Login from './containers/Login/index.jsx';
import Index from './containers/Index/index.jsx';
import ResContentList from './containers/Res/ResContentList.jsx';
import ResAdd from './containers/Res/ResAdd.jsx';
import ResAddContent from './containers/Res/ResAddContent.jsx';
import Home from './containers/Home/index.jsx';



export const routes = {
	component: App,
	indexRoute: {component: Index},
	childRoutes: [{
		component: Index,
        onEnter:checkLogin,
        childRoutes: [{
            path: '/',
            component: Home,
        },{
			path: 'ResContentList',
			component: ResContentList,
        },{
			path: 'resAdd',
			component: ResAdd,
        },{
			path: 'resAddContent',
			component: ResAddContent,
        }]
	},{
		path: 'login',
		component: Login
	}]
}

function checkLogin(nextState, replace,next) {
    if(window.localStorage.userInfo){
        next()
    }else{
        replace('/login')//重定向
        next()
    }
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