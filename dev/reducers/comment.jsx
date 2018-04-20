import * as actionConstant from '../constants/actionConstant.jsx';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initComment = {
    commentList:[]
}

export default function plate(state = initComment, action) {
    switch (action.type) {
        case actionConstant.SET_COMMENT_LIST:
            return Object.assign({}, state, {
                commentList:action.commentList
            });
        default : return state;
    }
}