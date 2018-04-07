import * as actionConstant from '../constants/actionConstant.jsx';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initarticle = {
    articleList:[],
}

export default function article(state = initarticle, action) {
    switch (action.type) {
        case actionConstant.GET_ARTICLE_LIST:
            return Object.assign({}, state, {
                articleList:action.articleList
            });

        default : return state;
    }
}