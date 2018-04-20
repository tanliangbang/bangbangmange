import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute} from 'react-router' // 路由
import axios from "axios";

export const routes = {
    childRoutes: [{
        onEnter:checkLogin,
        getComponent(nextState, callback){
            require.ensure([], (require) => {
                callback(null, require('../containers/Index/index.jsx').default)
            }, 'Index')
        },
        childRoutes: [{
            path: '/',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Home/index.jsx').default)
                }, 'Home')
            },
           },{
            path: 'ResContentList',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Res/ResContentList.jsx').default)
                }, 'ResContentList')
            }
        },{
            path: 'resAdd',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Res/ResAdd.jsx').default)
                }, 'ResAdd')
            }
        },{
            path: 'resAddContent',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Res/ResAddContent.jsx').default)
                }, 'ResAddContent')
            }
        },{
            path: 'addArticle',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Article/AddArticle.jsx').default)
                }, 'AddArticle')
            }
        },{
            path: 'articleList',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Article/ArticleList.jsx').default)
                }, 'ArticleList')
            }
        },{
            path: 'commentList',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Comment/CommentList.jsx').default)
                }, 'CommentList')
            }
        },{
            path: 'addPlate',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Plate/AddPlate.jsx').default)
                }, 'AddPlate')
            }
        },{
            path: 'plateList',
            getComponent(nextState, callback){
                require.ensure([], (require) => {
                    callback(null, require('../containers/Plate/PlateList.jsx').default)
                }, 'PlateList')
            }
        }]
    },{
        path: 'login',
        getComponent(nextState, callback){
            require.ensure([], (require) => {
                callback(null, require('../containers/Login/index.jsx').default)
            }, 'Login')
        }
    },{
        path: '*',
        getComponent(nextState, callback){
            require.ensure([], (require) => {
                callback(null, require('../containers/Error/Error.jsx').default)
            }, 'Error')
        }
    }]
}

function checkLogin(nextState, replace,next) {
    axios.get("/api/users/getUserInfo").then(function (res) {
        if(res.data.statusCode === 500){
            replace('/login')//重定向
            next()
        } else {
            next()
        }
    }).catch(function (err) {
        console.log(err)
    });
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