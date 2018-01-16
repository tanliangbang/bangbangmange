import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import res from './res.jsx'

//todos

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
	res,
	routing: routerReducer //整合路由
})

export default rootReducer
