import * as actionConstant from '../constants/actionConstant.jsx';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initarticle = {
    articleList:[],
    preUrl:""
}

export default function article(state = initarticle, action) {
    switch (action.type) {
        case actionConstant.GET_ARTICLE_LIST:
            return Object.assign({}, state, {
                articleList:action.articleList
            });
        case actionConstant.SET_PRE_URL:
            return Object.assign({}, state, {
                preUrl:action.preUrl
            });
        default : return state;
    }
}