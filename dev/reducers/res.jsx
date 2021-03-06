import * as actionConstant from '../constants/actionConstant.jsx';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initRes = {
    resList:[],
    resContentList:null,
    resDetail:null,
    resContent:null
}

export default function res(state = initRes, action) {
    switch (action.type) {
        case actionConstant.GET_RES_LIST:
            return Object.assign({}, state, {
                resList:action.resList
            });
        case actionConstant.GET_RES_CONTENT_LIST:
            return Object.assign({}, state, {
                resContentList:action.resContentList
            });
        case actionConstant.GET_RES_DETAIL:
            return Object.assign({}, state, {
                resDetail:action.resDetail
            });
        case actionConstant.GET_RES_CONTENT:
            return Object.assign({}, state, {
                resContent:action.resContent
            });


        default : return state;
    }
}