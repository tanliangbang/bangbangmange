import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute} from 'react-router' // 路由

export const routes = {
    childRoutes: [{
        onEnter:checkLogin,
        getComponent(nextState, callback){
            require.ensure([], (require) => {
                callback(null, require('./containers/Index/index.jsx').default)
            }, 'Index')
        },
        childRoutes: [{
            path: '/',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('./containers/Home/index.jsx').default)
                }, 'Home')
            },
           },{
            path: 'ResContentList',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('./containers/Res/ResContentList.jsx').default)
                }, 'ResContentList')
            }
        },{
            path: 'resAdd',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('./containers/Res/ResAdd.jsx').default)
                }, 'ResAdd')
            }
        },{
            path: 'resAddContent',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('./containers/Res/ResAddContent.jsx').default)
                }, 'ResAddContent')
            }
        }]
    },{
        path: 'login',
        getComponent(nextState, callback){
            require.ensure([], (require) => {
                callback(null, require('./containers/Login/index.jsx').default)
            }, 'Login')
        }
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