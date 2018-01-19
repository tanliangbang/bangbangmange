import './style/style.scss';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory} from 'react-router' // 路由
import { syncHistoryWithStore } from 'react-router-redux' //路由使用redux管理
import configureStore from './store/configureStore.jsx';

import Routers from './Routers.jsx'


//注册store
const store = configureStore();
/*store.subscribe(() =>
	console.log(store.getState())
);*/

//保持历史同步
const history = syncHistoryWithStore(browserHistory, store)

//路由
render(
    <Provider store={store}>
        <Routers history={history}/>
    </Provider>,
    document.getElementById('App')
);