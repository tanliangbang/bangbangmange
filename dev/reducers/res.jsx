import * as actionConstant from '../constants/actionConstant';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initRes = {
    resList:[]
}

export default function res(state = initRes, action) {
    switch (action.type) {
        case actionConstant.GET_RES_LIST:
            return Object.assign({}, state, {
                resList:action.resList
            });
        default : return state;
    }
}