import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import product from './product'
//todos

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
	product,
	form: formReducer,
	routing: routerReducer //整合路由
})

export default rootReducer
